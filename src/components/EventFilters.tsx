import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
} from '@mui/material'

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

interface EventFiltersProps {
  libraries: string[]
  selectedLibrary: string
  onLibraryChange: (library: string) => void
  audiences: string[]
  selectedAudience: string
  onAudienceChange: (audience: string) => void
  month: string
  onMonthChange: (month: string) => void
  exactDate: string
  onExactDateChange: (date: string) => void
  daysOfWeek: string[]
  onDaysOfWeekChange: (days: string[]) => void
}

export default function EventFilters({
  libraries,
  selectedLibrary,
  onLibraryChange,
  audiences,
  selectedAudience,
  onAudienceChange,
  month,
  onMonthChange,
  exactDate,
  onExactDateChange,
  daysOfWeek,
  onDaysOfWeekChange,
}: EventFiltersProps) {
  return (
    <Stack direction="row" sx={{ mb: 3, flexWrap: 'wrap', gap: 2 }}>
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Library</InputLabel>
        <Select
          value={selectedLibrary}
          label="Library"
          onChange={(e) => onLibraryChange(e.target.value)}
        >
          <MenuItem value="all">All Libraries</MenuItem>
          {libraries.map((lib) => (
            <MenuItem key={lib} value={lib}>
              {lib}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Audience</InputLabel>
        <Select
          value={selectedAudience}
          label="Audience"
          onChange={(e) => onAudienceChange(e.target.value)}
        >
          <MenuItem value="all">All Audiences</MenuItem>
          {audiences.map((a) => (
            <MenuItem key={a} value={a}>
              {a}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        size="small"
        type="month"
        label="Month"
        value={month}
        onChange={(e) => onMonthChange(e.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{ minWidth: 160 }}
      />
      <TextField
        size="small"
        type="date"
        label="Exact date"
        value={exactDate}
        onChange={(e) => onExactDateChange(e.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{ minWidth: 160 }}
      />
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Day of week</InputLabel>
        <Select
          multiple
          value={daysOfWeek}
          label="Day of week"
          onChange={(e) => onDaysOfWeekChange(e.target.value as string[])}
          renderValue={(selected) => (selected.length === 0 ? 'Any day' : selected.join(', '))}
        >
          {DAYS_OF_WEEK.map((day) => (
            <MenuItem key={day} value={day}>
              {day}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  )
}
