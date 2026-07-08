import { useState, useMemo } from 'react'
import { Container, Typography, Box } from '@mui/material'
import type { Event } from '../types/events'
import eventData from '../data/events.json'
import EventFilters from './EventFilters'
import { getTimeGroup } from '../colors'
import EventCard from './EventCard'

const events = eventData as Event[]

const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
const defaultDateStr = tomorrow.toISOString().slice(0, 10)
const allLibraries = [...new Set(events.map((e) => e.library))].sort()

export default function EventList() {
  const [selectedLibraries, setSelectedLibraries] = useState<string[]>(allLibraries)
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>(['Children'])
  const [exactDate, setExactDate] = useState(defaultDateStr)
  const [timeGroups, setTimeGroups] = useState<string[]>(['Morning (8am–12pm)'])

  const libraries = useMemo(() => allLibraries, [])

  const audiences = useMemo(
    () => [...new Set(events.map((e) => e.audience).filter(Boolean))].sort() as string[],
    []
  )

  const filtered = useMemo(
    () =>
      events.filter((e) => {
        if (selectedLibraries.length > 0 && !selectedLibraries.includes(e.library)) return false
        if (selectedAudiences.length > 0 && !e.audience) return false
        if (selectedAudiences.length > 0 && !selectedAudiences.includes(e.audience!)) return false
        if (exactDate && e.date !== exactDate) return false
        if (timeGroups.length > 0) {
          const g = getTimeGroup(e.startTime)
          if (!g || !timeGroups.includes(g)) return false
        }
        return true
      }),
    [selectedLibraries, selectedAudiences, exactDate, timeGroups]
  )

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF5F5 0%, #F0FFF4 50%, #FFF8E1 100%)' }}>
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{
        mb: 2,
        p: 1.5,
        px: 2,
        borderRadius: 1,
        background: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 50%, #4ECDC4 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#fff', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
          <Box component="span" sx={{ fontSize: 32 }}>🌈</Box>
          Library StoryTimes
          <Box component="span" sx={{ fontSize: 32 }}>🌟</Box>
        </Typography>
      </Box>
      <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400, mb: 2 }}>
        {filtered.length} event{filtered.length !== 1 ? 's' : ''} found
      </Typography>
      <EventFilters
        libraries={libraries}
        selectedLibraries={selectedLibraries}
        onLibrariesChange={setSelectedLibraries}
        audiences={audiences}
        selectedAudiences={selectedAudiences}
        onAudiencesChange={setSelectedAudiences}
        exactDate={exactDate}
        onExactDateChange={setExactDate}
        timeGroups={timeGroups}
        onTimeGroupsChange={setTimeGroups}
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
    </Box>
  )
}
