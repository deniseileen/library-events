import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
} from '@mui/material'

<<<<<<< Updated upstream
const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
=======
function SelectAllClear({
  selected,
  options,
  onChange,
}: {
  selected: string[]
  options: string[]
  onChange: (v: string[]) => void
}) {
  const allSelected = selected.length === options.length
  return (
    <Box sx={{ display: 'flex', gap: 1, px: 2, py: 0.5 }}>
      <Button
        size="small"
        disabled={allSelected}
        onClick={() => onChange([...options])}
      >
        Select all
      </Button>
      <Button
        size="small"
        disabled={selected.length === 0}
        onClick={() => onChange([])}
      >
        Clear
      </Button>
    </Box>
  )
}

function MultiSelect({
  label,
  pluralLabel,
  options,
  value,
  onChange,
  bgColor,
}: {
  label: string
  pluralLabel?: string
  options: string[]
  value: string[]
  onChange: (v: string[]) => void
  bgColor?: string
}) {
  const allText = pluralLabel || `${label.toLowerCase()}s`
  return (
    <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 200 } }}>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={value}
        label={label}
        onChange={(e) => onChange(e.target.value as string[])}
        renderValue={(selected) =>
          selected.length === 0
            ? `All ${allText}`
            : selected.length === options.length
              ? `All ${allText}`
              : selected.join(', ')
        }
        sx={{ backgroundColor: bgColor || '#fff', borderRadius: 3 }}
      >
        <SelectAllClear selected={value} options={options} onChange={onChange} />
        {options.map((opt) => (
          <MenuItem key={opt} value={opt}>
            <Checkbox checked={value.includes(opt)} />
            <ListItemText primary={opt} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
        sx={{ minWidth: 160 }}
=======
        sx={{ minWidth: { xs: '100%', sm: 160 }, '& .MuiOutlinedInput-root': { backgroundColor: '#E0F0FF', borderRadius: 3 } }}
      />
      <MultiSelect
        label="Time of day"
        pluralLabel="times of day"
        options={[...TIME_GROUPS]}
        value={timeGroups}
        onChange={onTimeGroupsChange}
        bgColor="#FFF0E0"
>>>>>>> Stashed changes
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
