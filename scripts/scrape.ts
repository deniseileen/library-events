import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import * as cheerio from 'cheerio'
import type { Event } from '../src/types/events'

interface LibraryScraper {
  name: string
  url: string
  scrape: ($: cheerio.CheerioAPI) => Omit<Event, 'id' | 'library'>[]
}

const scrapers: LibraryScraper[] = [
  {
    name: 'Library A',
    url: 'https://example.com/library-a/events',
    scrape: ($) => {
      // TODO: parse the library's event page
      return []
    },
  },
  {
    name: 'Library B',
    url: 'https://example.com/library-b/events',
    scrape: ($) => {
      // TODO: parse the library's event page
      return []
    },
  },
]

async function scrapeLibrary(scraper: LibraryScraper): Promise<Event[]> {
  // TODO: fetch and parse the page
  // const res = await fetch(scraper.url)
  // const html = await res.text()
  // const $ = cheerio.load(html)
  // const items = scraper.scrape($)
  console.warn(`Scraping ${scraper.name} — not yet implemented`)
  return []
}

async function main() {
  const allEvents: Event[] = []

  for (const scraper of scrapers) {
    const events = await scrapeLibrary(scraper)
    allEvents.push(...events)
  }

  if (allEvents.length === 0) {
    console.log('No events scraped — skipping write to preserve existing data')
    return
  }

  const outPath = resolve(import.meta.dirname, '..', 'src', 'data', 'events.json')
  writeFileSync(outPath, JSON.stringify(allEvents, null, 2))
  console.log(`Wrote ${allEvents.length} events to ${outPath}`)
}

main()
