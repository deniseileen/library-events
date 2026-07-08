import { useState, useMemo } from 'react'
import { Container, Typography, Box } from '@mui/material'
import type { Event } from '../types/events'
import eventData from '../data/events.json'
import EventFilters from './EventFilters'
import EventCard from './EventCard'

const events = eventData as Event[]

function getMonthFilter(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function getDayOfWeek(dateStr: string): string {
  return DAYS[new Date(dateStr + 'T00:00:00').getDay()]
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function EventList() {
  const [selectedLibrary, setSelectedLibrary] = useState('all')
  const [selectedAudience, setSelectedAudience] = useState('all')
  const [month, setMonth] = useState(getMonthFilter)
  const [exactDate, setExactDate] = useState('')
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([])

  const libraries = useMemo(
    () => [...new Set(events.map((e) => e.library))].sort(),
    []
  )

  const audiences = useMemo(
    () => [...new Set(events.map((e) => e.audience).filter(Boolean))].sort() as string[],
    []
  )

  const filtered = useMemo(
    () =>
      events.filter((e) => {
        if (selectedLibrary !== 'all' && e.library !== selectedLibrary) return false
        if (selectedAudience !== 'all' && e.audience !== selectedAudience) return false
        if (exactDate) return e.date === exactDate
        if (month && !e.date.startsWith(month)) return false
        if (daysOfWeek.length > 0 && !daysOfWeek.includes(getDayOfWeek(e.date))) return false
        return true
      }),
    [selectedLibrary, selectedAudience, month, exactDate, daysOfWeek]
  )

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
<<<<<<< Updated upstream
      <Typography variant="h4" gutterBottom>
        Library Events
      </Typography>
=======
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 0.5, mb: 2 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box component="span" sx={{ fontSize: 36 }}>📚</Box>
          Storytime & Events
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400, ml: { sm: 'auto' } }}>
          {filtered.length} event{filtered.length !== 1 ? 's' : ''} found
        </Typography>
      </Box>
>>>>>>> Stashed changes
      <EventFilters
        libraries={libraries}
        selectedLibrary={selectedLibrary}
        onLibraryChange={setSelectedLibrary}
        audiences={audiences}
        selectedAudience={selectedAudience}
        onAudienceChange={setSelectedAudience}
        month={month}
        onMonthChange={setMonth}
        exactDate={exactDate}
        onExactDateChange={setExactDate}
        daysOfWeek={daysOfWeek}
        onDaysOfWeekChange={setDaysOfWeek}
      />
      {filtered.length === 0 ? (
        <Typography color="text.secondary">No events found for the selected filters.</Typography>
      ) : (
        <Box>
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </Box>
      )}
    </Container>
  )
}
