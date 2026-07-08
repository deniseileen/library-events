import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import * as cheerio from 'cheerio'
import type { Event } from '../src/types/events'

const BPL_API_BASE = 'https://gateway.bibliocommons.com/v2/libraries/bpl/events/search'
const BPL_LOCATION_ID = '3' // Central Library in Copley Square
const BPL_LIMIT = 50

function categoryToAudience(cat: string): string | undefined {
  const c = cat.toLowerCase().replace(/[^a-z0-9]/g, '')
  return ASSABET_AUDIENCE_MAP[c]
}

function parseIsoDuration(duration: string): number | null {
  const m = duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/)
  if (!m) return null
  const h = parseInt(m[1] || '0')
  const min = parseInt(m[2] || '0')
  const s = parseInt(m[3] || '0')
  return h * 3600 + min * 60 + s
}

type ScrapeResult = Omit<Event, 'id' | 'library'>[]

interface LibraryScraper {
  name: string
  url: string
  scrape: (html?: string) => ScrapeResult | Promise<ScrapeResult>
}

async function scrapeAssabet(html: string): Promise<ScrapeResult> {
  const $ = cheerio.load(html)
  const events: Omit<Event, 'id' | 'library'>[] = []
  const slugToCategory = new Map<string, string>()

  $('.listing-event').each((_i, el) => {
    const classes = ($(el).attr('class') || '').split(/\s+/)
    const catClass = classes.find((c: string) => c.startsWith('category-'))
    const slug = $(el).find('h3 a').attr('data-slug') || $(el).find('h2 a').attr('data-slug') || ''
    if (catClass && slug) slugToCategory.set(slug, catClass.replace('category-', ''))
  })

  $('script[type="application/ld+json"]').each((_i, el) => {
    const raw = $(el).html()
    if (!raw) return
    try {
      const data = JSON.parse(raw)
      if (data['@type'] !== 'Event' || !data.name) return

      const startDate = data.startDate || ''
      const timeStr = data.doorTime || ''
      const durationSec = parseIsoDuration(data.duration || '')

      let startTime = ''
      let endTime = ''
      if (timeStr) {
        startTime = timeStr.slice(0, 5)
        if (durationSec) {
          const [h, m] = timeStr.split(':').map(Number)
          const totalMin = h * 60 + m + durationSec / 60
          const endH = Math.floor(totalMin / 60) % 24
          const endM = Math.floor(totalMin % 60)
          endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`
        }
      }

      const slug = (data.url || '').split('/').filter(Boolean).pop() || ''
      const category = slugToCategory.get(slug) || ''
      const audience = categoryToAudience(category) || ''

      const desc = (data.description || '')
        .replace(/<[^>]*>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&hellip;/g, '…')
        .replace(/\s+/g, ' ')
        .trim()

      events.push({
        title: data.name,
        description: desc,
        date: startDate.slice(0, 10),
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        url: data.url || undefined,
        audience: audience || undefined,
      })
    } catch {
      // skip invalid JSON
    }
  })

  return events
}

const BPL_AUDIENCE_MAP: Record<string, string> = {
  'Children (Birth-Age 5)': 'Children (0-5)',
  'Children (Ages 3–5)': 'Children (0-5)',
  'Children (Birth–18 months)': 'Children (0-5)',
  'Children (Ages 6-12)': 'Children (6-11)',
  'Tweens (Ages 9-12)': 'Children (6-11)',
  'Teens (Ages 13-18)': 'Teens',
  'Young Adults (Ages 20-34)': 'Adults',
  'All Adults': 'Adults',
  'College Students': 'Adults',
  'Older Adults': 'Adults',
  'Businesses': 'Adults',
}

const ASSABET_AUDIENCE_MAP: Record<string, string> = {
  'children-0-5': 'Children (0-5)',
  'children-6-11': 'Children (6-11)',
  'young-adult': 'Teens',
  'adult': 'Adults',
  'adults': 'Adults',
  'seniors': 'Adults',
  'teen': 'Teens',
  'teens': 'Teens',
  'cfce': 'Children',
  'toddler': 'Children (0-3)',
  'baby': 'Children (0-1)',
  'preschool': 'Children (3-5)',
  'storytime': 'Children (0-5)',
  'children': 'Children',
  'child': 'Children',
  'junior': 'Children',
  'youth': 'Children',
  'infant': 'Children (0-1)',
  'babies': 'Children (0-1)',
  'tween': 'Tweens',
}

function pickBplAudience(audiences: string[]): string | undefined {
  const priority = ['Children (0-5)', 'Children (6-11)', 'Children', 'Teens', 'Adults']
  const mapped = new Set<string>()
  for (const a of audiences) {
    const m = BPL_AUDIENCE_MAP[a]
    if (m) mapped.add(m)
  }
  for (const p of priority) {
    if (mapped.has(p)) return p
  }
  return undefined
}

interface BplApiEvent {
  id: string
  key: string
  definition: {
    start: string
    end?: string
    title: string
    description?: string
    branchLocationId?: string
    locationDetails?: string
    audienceIds?: string[]
  }
}

interface BplApiResponse {
  events: {
    results: string[]
    pagination: { count: number; page: number; pages: number; limit: number }
  }
  entities: {
    events: Record<string, BplApiEvent>
    eventAudiences: Record<string, { name: string }>
    locations?: Record<string, { name: string }>
  }
}

async function scrapeBpl(_html?: string): Promise<ScrapeResult> {
  const allEvents: ScrapeResult = []
  let page = 1
  let totalPages = 1

  while (page <= totalPages) {
    const url = `${BPL_API_BASE}?page=${page}&limit=${BPL_LIMIT}&locale=en-US&locations=${BPL_LOCATION_ID}`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'library-events-scraper/1.0', Accept: 'application/json' },
    })
    if (!res.ok) {
      console.warn(`  BPL API: HTTP ${res.status} on page ${page} — stopping`)
      break
    }
    const data: BplApiResponse = await res.json()

    if (page === 1) {
      totalPages = data.events.pagination.pages
    }

    for (const id of data.events.results) {
      const ev = data.entities.events[id]
      if (!ev?.definition?.title) continue
      const def = ev.definition

      let startTime: string | undefined
      let endTime: string | undefined

      if (def.start && def.start.includes('T')) {
        const parts = def.start.split('T')[1]
        if (parts) startTime = parts.slice(0, 5)
      }
      if (def.end && def.end.includes('T')) {
        const parts = def.end.split('T')[1]
        if (parts) endTime = parts.slice(0, 5)
      }

      const audienceIds = def.audienceIds || []
      const audienceNames = audienceIds
        .map((aid) => data.entities.eventAudiences[aid]?.name)
        .filter(Boolean) as string[]
      const audience = pickBplAudience(audienceNames)

      let locationName = ''
      if (def.branchLocationId && data.entities.locations?.[def.branchLocationId]) {
        locationName = data.entities.locations[def.branchLocationId].name
      }
      if (!locationName && def.locationDetails) {
        locationName = def.locationDetails
      }

      const desc = (def.description || '')
        .replace(/<[^>]*>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&hellip;/g, '…')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()

      allEvents.push({
        title: def.title,
        description: locationName ? `[${locationName}] ${desc}` : desc,
        date: (def.start || '').slice(0, 10),
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        url: `https://bpl.bibliocommons.com/events/${id}`,
        audience: audience || undefined,
      })
    }

    page++
    if (page <= totalPages) await new Promise((r) => setTimeout(r, 300))
  }

  return allEvents
}

const scrapers: LibraryScraper[] = [
  {
    name: 'Melrose Public Library',
    url: 'https://melrosepubliclibrary.assabetinteractive.com/calendar/',
    scrape: scrapeAssabet,
  },
  {
    name: 'Stoneham Public Library',
    url: 'https://stonehamlibrary.assabetinteractive.com/calendar/',
    scrape: scrapeAssabet,
  },
  {
    name: 'Lucius Beebe Memorial Library (Wakefield)',
    url: 'https://wakefieldlibrary.assabetinteractive.com/calendar/',
    scrape: scrapeAssabet,
  },
  {
    name: 'Saugus Public Library',
    url: 'https://sauguspubliclibrary.assabetinteractive.com/calendar/',
    scrape: scrapeAssabet,
  },
  {
    name: 'Boston Public Library',
    url: BPL_API_BASE,
    scrape: scrapeBpl,
  },
]

async function scrapeLibrary(scraper: LibraryScraper): Promise<Event[]> {
  try {
    let items: ScrapeResult

    if (scraper.name === 'Boston Public Library') {
      items = await scraper.scrape()
    } else {
      const res = await fetch(scraper.url, {
        headers: { 'User-Agent': 'library-events-scraper/1.0' },
      })
      if (!res.ok) {
        console.warn(`  ${scraper.name}: HTTP ${res.status} — skipping`)
        return []
      }
      const html = await res.text()
      items = await scraper.scrape(html)
    }

    return items.map((item, i) => ({
      ...item,
      id: `${scraper.name.replace(/\s+/g, '-').toLowerCase()}-${i}`,
      library: scraper.name,
    }))
  } catch (err) {
    console.warn(`  ${scraper.name}: ${err} — skipping`)
    return []
  }
}

async function main() {
  const allEvents: Event[] = []

  for (const scraper of scrapers) {
    process.stdout.write(`Scraping ${scraper.name}… `)
    const events = await scrapeLibrary(scraper)
    allEvents.push(...events)
    console.log(`${events.length} events`)
  }

  if (allEvents.length === 0) {
    console.log('No events scraped — skipping write to preserve existing data')
    return
  }

  const outPath = resolve(import.meta.dirname, '..', 'src', 'data', 'events.json')
  writeFileSync(outPath, JSON.stringify(allEvents, null, 2))
  console.log(`\nWrote ${allEvents.length} events to ${outPath}`)
}

main()
