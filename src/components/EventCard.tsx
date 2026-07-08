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
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
<<<<<<< Updated upstream
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
=======
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'flex-start' }, gap: 1 }}>
>>>>>>> Stashed changes
          <Typography variant="h6" component="div">
            {event.url ? (
              <Link href={event.url} target="_blank" rel="noopener noreferrer" underline="hover">
                {event.title}
              </Link>
            ) : (
              event.title
            )}
          </Typography>
          <Stack direction="row" spacing={1}>
            {event.audience && <Chip label={event.audience} size="small" variant="outlined" />}
            <Chip label={event.library} size="small" color="primary" />
          </Stack>
        </Box>
        <Typography color="text.secondary" sx={{ mb: 0.5 }}>
          {event.date}
          {event.startTime && ` · ${formatTime(event.startTime)}`}
          {event.endTime && ` – ${formatTime(event.endTime)}`}
        </Typography>
        <Typography variant="body2">{event.description}</Typography>
      </CardContent>
    </Card>
  )
}
