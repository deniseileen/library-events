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
import { LIBRARY_COLORS, AUDIENCE_COLORS, TIME_BORDER_COLORS, TIME_TEXT_COLORS, CHIP_TEXT_COLOR, getTimeGroup } from '../colors'

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

export default function EventCard({ event }: EventCardProps) {
  const libColor = LIBRARY_COLORS[event.library] || '#ccc'
  const audColor = event.audience ? AUDIENCE_COLORS[event.audience] : undefined
  const timeGroup = getTimeGroup(event.startTime)
  const borderColor = timeGroup ? TIME_BORDER_COLORS[timeGroup] : undefined
  const timeColor = timeGroup ? TIME_TEXT_COLORS[timeGroup] : undefined

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
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'flex-start' }, gap: 1 }}>
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
                  color: CHIP_TEXT_COLOR,
                  fontWeight: 700,
                  '& .MuiChip-label': { lineHeight: 1.2, py: 0 },
                }}
              />
            )}
            <Chip
              label={event.library}
              size="small"
              sx={{
                backgroundColor: libColor,
                color: CHIP_TEXT_COLOR,
                fontWeight: 700,
                '& .MuiChip-label': { lineHeight: 1.2, py: 0 },
              }}
            />
          </Stack>
        </Box>
        <Typography color="text.secondary" sx={{ mt: 1, mb: 0.5, fontWeight: 600 }}>
          {event.date}
          {event.startTime && (
            <Box component="span" sx={{ color: timeColor || 'text.secondary' }}>
              {' · '}{formatTime(event.startTime)}
            </Box>
          )}
          {event.endTime && (
            <Box component="span" sx={{ color: timeColor || 'text.secondary' }}>
              {' – '}{formatTime(event.endTime)}
            </Box>
          )}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {event.description}
        </Typography>
      </CardContent>
    </Card>
  )
}
