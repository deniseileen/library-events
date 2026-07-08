import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Link,
  Stack,
} from '@mui/material'
import type { Event } from '../types/events'
import { LIBRARY_COLORS, AUDIENCE_COLORS, TIME_BORDER_COLORS, getTimeGroup } from '../colors'

interface EventCardProps {
  event: Event
}

function formatTime(time?: string) {
  if (!time) return ''
  const [h, m] = time.split(':')
  const hour = parseInt(h)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${m} ${ampm}`
}

function darken(hex: string, amount: number) {
  const num = parseInt(hex.slice(1), 16)
  const r = Math.max(0, (num >> 16) - amount)
  const g = Math.max(0, ((num >> 8) & 0xff) - amount)
  const b = Math.max(0, (num & 0xff) - amount)
  return `rgb(${r}, ${g}, ${b})`
}

export default function EventCard({ event }: EventCardProps) {
  const libColor = LIBRARY_COLORS[event.library] || '#ccc'
  const audColor = event.audience ? AUDIENCE_COLORS[event.audience] : undefined
  const timeGroup = getTimeGroup(event.startTime)
  const borderColor = timeGroup ? TIME_BORDER_COLORS[timeGroup] : undefined

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        borderLeft: borderColor ? `6px solid ${borderColor}` : undefined,
        transition: 'transform 0.15s, box-shadow 0.15s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
          <Typography variant="h6" component="div">
            {event.url ? (
              <Link href={event.url} target="_blank" rel="noopener noreferrer" underline="hover">
                {event.title}
              </Link>
            ) : (
              event.title
            )}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
            {event.audience && audColor && (
              <Chip
                label={event.audience}
                size="small"
                sx={{
                  backgroundColor: audColor,
                  color: darken(audColor, 120),
                  fontWeight: 700,
                }}
              />
            )}
            <Chip
              label={event.library}
              size="small"
              sx={{
                backgroundColor: libColor,
                color: darken(libColor, 120),
                fontWeight: 700,
              }}
            />
          </Stack>
        </Box>
        <Typography color="text.secondary" sx={{ mb: 0.5, fontWeight: 600 }}>
          {event.date}
          {event.startTime && ` · ${formatTime(event.startTime)}`}
          {event.endTime && ` – ${formatTime(event.endTime)}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {event.description}
        </Typography>
      </CardContent>
    </Card>
  )
}
