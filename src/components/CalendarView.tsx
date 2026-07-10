import { useState, useMemo } from 'react'
import { Typography, Box, Chip, Link, IconButton, Stack } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import type { Event } from '../types/events'
import {
  LIBRARY_COLORS, AUDIENCE_COLORS, TIME_TEXT_COLORS,
  CHIP_TEXT_COLOR, getTimeGroup, TIME_CHIP_COLORS,
} from '../colors'

dayjs.extend(isoWeek)

function decodeHtml(html: string) {
  const txt = document.createElement('textarea')
  txt.innerHTML = html
  return txt.value.replace(/<[^>]*>/g, '')
}

function formatTime(time?: string) {
  if (!time) return ''
  const [h, m] = time.split(':')
  const hour = parseInt(h)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${m} ${ampm}`
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface CalendarViewProps {
  events: Event[]
}

export default function CalendarView({ events }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(() => dayjs().startOf('month'))

  const startOfMonth = currentMonth.startOf('month')
  const endOfMonth = currentMonth.endOf('month')
  const startDay = startOfMonth.day()
  const daysInMonth = endOfMonth.date()

  const eventsByDate = useMemo(() => {
    const map: Record<string, Event[]> = {}
    events.forEach((e) => {
      if (!map[e.date]) map[e.date] = []
      map[e.date].push(e)
    })
    return map
  }, [events])

  const cells: (dayjs.Dayjs | null)[] = []
  for (let i = 0; i < startDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(startOfMonth.date(d))
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, gap: 1 }}>
        <IconButton onClick={() => setCurrentMonth((m) => m.subtract(1, 'month'))} size="small">
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 700, minWidth: 180, textAlign: 'center' }}>
          {currentMonth.format('MMMM YYYY')}
        </Typography>
        <IconButton onClick={() => setCurrentMonth((m) => m.add(1, 'month'))} size="small">
          <ChevronRightIcon />
        </IconButton>
      </Box>
      <Box sx={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(90px, 1fr))', gap: 0.5, minWidth: 630 }}>
        {WEEKDAYS.map((day) => (
          <Box key={day} sx={{ textAlign: 'center', fontWeight: 700, py: 0.5, color: 'text.secondary', fontSize: 13 }}>
            {day}
          </Box>
        ))}
        {cells.map((day, i) => {
          if (!day) return <Box key={`empty-${i}`} />
          const dateStr = day.format('YYYY-MM-DD')
          const dayEvents = eventsByDate[dateStr] || []
          const isToday = day.isSame(dayjs(), 'day')
          return (
            <Box
              key={dateStr}
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                minHeight: 110,
                p: 0.5,
                backgroundColor: isToday ? '#FFFDE7' : '#fff',
                overflow: 'hidden',
              }}
            >
              <Typography sx={{ fontSize: 12, fontWeight: isToday ? 800 : 600, mb: 0.5, color: isToday ? '#1565C0' : 'text.primary' }}>
                {day.date()}
              </Typography>
              {dayEvents.slice(0, 3).map((event) => {
                const libColor = LIBRARY_COLORS[event.library] || '#ccc'
                const audColor = event.audience ? AUDIENCE_COLORS[event.audience] : undefined
                const timeGroup = getTimeGroup(event.startTime)
                const timeColor = timeGroup ? TIME_TEXT_COLORS[timeGroup] : undefined
                return (
                  <Box key={event.id} sx={{ mb: 0.5 }}>
                    <Link
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                      sx={{ fontSize: 11, fontWeight: 600, display: 'block', lineHeight: 1.2, mb: 0.25, color: 'text.primary' }}
                    >
                      {decodeHtml(event.title)}
                    </Link>
                    <Stack direction="row" spacing={0.25} sx={{ flexWrap: 'wrap', gap: 0.25 }}>
                      {event.audience && audColor && (
                        <Chip label={event.audience} size="small" sx={{ height: 16, fontSize: 9, fontWeight: 700, backgroundColor: audColor, color: CHIP_TEXT_COLOR, '& .MuiChip-label': { px: 0.5, lineHeight: 1.2 } }} />
                      )}
                      <Chip label={event.library.split(' ')[0]} size="small" sx={{ height: 16, fontSize: 9, fontWeight: 700, backgroundColor: libColor, color: CHIP_TEXT_COLOR, '& .MuiChip-label': { px: 0.5, lineHeight: 1.2 } }} />
                      {event.startTime && (
                        <Chip
                          label={formatTime(event.startTime)}
                          size="small"
                          sx={{
                            height: 16,
                            fontSize: 9,
                            fontWeight: 700,
                            backgroundColor: timeGroup ? TIME_CHIP_COLORS[timeGroup] : '#E0E0E0',
                            color: timeColor || CHIP_TEXT_COLOR,
                            '& .MuiChip-label': { px: 0.5, lineHeight: 1.2 },
                          }}
                        />
                      )}
                    </Stack>
                  </Box>
                )
              })}
              {dayEvents.length > 3 && (
                <Typography sx={{ fontSize: 10, color: 'text.secondary', fontWeight: 600 }}>
                  +{dayEvents.length - 3} more
                </Typography>
              )}
            </Box>
          )
        })}
      </Box>
      </Box>
    </Box>
  )
}
