import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Link,
  Stack,
} from '@mui/material'
import dayjs from 'dayjs'
import type { Event } from '../types/events'
import { LIBRARY_COLORS, AUDIENCE_COLORS, TIME_BORDER_COLORS, TIME_TEXT_COLORS, CHIP_TEXT_COLOR, getTimeGroup, DAY_COLORS, DAY_TEXT_COLORS, TIME_CHIP_COLORS } from '../colors'

interface EventCardProps {
  event: Event
}

function decodeHtml(html: string) {
  const txt = document.createElement('textarea')
  txt.innerHTML = html
  return txt.value.replace(/<[^>]*>/g, '')
}

function formatDate(date: string) {
  return dayjs(date).format('ddd, MMM D')
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
  const dayColor = DAY_COLORS[dayjs(event.date).format('ddd')]
  const dayTextColor = DAY_TEXT_COLORS[dayjs(event.date).format('ddd')] || CHIP_TEXT_COLOR

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        borderLeft: borderColor ? `6px solid ${borderColor}` : undefined,
        borderTop: dayColor ? `4px solid ${dayColor}` : undefined,
        borderRight: `6px solid ${libColor}`,
        borderBottom: audColor ? `4px solid ${audColor}` : undefined,
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
                {decodeHtml(event.title)}
              </Link>
            ) : (
              decodeHtml(event.title)
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, mb: 0.5, flexWrap: 'wrap' }}>
          <Chip
            label={formatDate(event.date)}
            size="small"
            sx={{
              backgroundColor: dayColor || '#E0E0E0',
              color: dayTextColor || CHIP_TEXT_COLOR,
              fontWeight: 700,
              '& .MuiChip-label': { lineHeight: 1.2, py: 0 },
            }}
          />
          {event.startTime && (
            <Chip
              label={`${formatTime(event.startTime)}${event.endTime ? ` – ${formatTime(event.endTime)}` : ''}`}
              size="small"
              sx={{
                backgroundColor: timeGroup ? TIME_CHIP_COLORS[timeGroup] : '#E0E0E0',
                color: timeColor || CHIP_TEXT_COLOR,
                fontWeight: 700,
                '& .MuiChip-label': { lineHeight: 1.2, py: 0 },
              }}
            />
          )}
          {event.registrationRequired && (
            <Chip
              label="Registration required"
              size="small"
              sx={{
                backgroundColor: '#FFE0B2',
                color: '#E65100',
                fontWeight: 700,
                height: 20,
                '& .MuiChip-label': { fontSize: 11, px: 1, lineHeight: 1.2, py: 0 },
              }}
            />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary">
          {decodeHtml(event.description)}
        </Typography>
      </CardContent>
    </Card>
  )
}
