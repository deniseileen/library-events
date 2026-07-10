import {
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  ListItemText,
  Select,
  MenuItem,
  Stack,
  Button,
  Box,
} from '@mui/material'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import type { Dayjs } from 'dayjs'
import { TIME_GROUPS } from '../colors'

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

interface EventFiltersProps {
  libraries: string[]
  selectedLibraries: string[]
  onLibrariesChange: (libraries: string[]) => void
  audiences: string[]
  selectedAudiences: string[]
  onAudiencesChange: (audiences: string[]) => void
  dateRange: [Dayjs | null, Dayjs | null]
  onDateRangeChange: (range: [Dayjs | null, Dayjs | null]) => void
  timeGroups: string[]
  onTimeGroupsChange: (groups: string[]) => void
  noRegistrationOnly: boolean
  onNoRegistrationOnlyChange: (v: boolean) => void
}

export default function EventFilters({
  libraries,
  selectedLibraries,
  onLibrariesChange,
  audiences,
  selectedAudiences,
  onAudiencesChange,
  dateRange,
  onDateRangeChange,
  timeGroups,
  onTimeGroupsChange,
  noRegistrationOnly,
  onNoRegistrationOnlyChange,
}: EventFiltersProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack direction="row" sx={{ mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <MultiSelect
          label="Library"
          pluralLabel="libraries"
          options={libraries}
          value={selectedLibraries}
          onChange={onLibrariesChange}
          bgColor="#FFE0E0"
        />
        <MultiSelect
          label="Audience"
          pluralLabel="audiences"
          options={audiences}
          value={selectedAudiences}
          onChange={onAudiencesChange}
          bgColor="#E0FFE0"
        />
        <DatePicker
          label="From"
          value={dateRange[0]}
          onChange={(v) => onDateRangeChange([v, dateRange[1]])}
          slotProps={{
            textField: {
              size: 'small',
              sx: {
                minWidth: { xs: '100%', sm: 140 },
                backgroundColor: '#F0E0FF',
                borderRadius: 3,
              },
            },
          }}
        />
        <DatePicker
          label="To"
          value={dateRange[1]}
          onChange={(v) => onDateRangeChange([dateRange[0], v])}
          slotProps={{
            textField: {
              size: 'small',
              sx: {
                minWidth: { xs: '100%', sm: 140 },
                backgroundColor: '#F0E0FF',
                borderRadius: 3,
              },
            },
          }}
        />
        <MultiSelect
          label="Time of day"
          pluralLabel="times of day"
          options={[...TIME_GROUPS]}
          value={timeGroups}
          onChange={onTimeGroupsChange}
          bgColor="#FFF0E0"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={noRegistrationOnly}
              onChange={(e) => onNoRegistrationOnlyChange(e.target.checked)}
              sx={{ '&.Mui-checked': { color: '#2E7D32' } }}
            />
          }
          label="No registration required"
          sx={{ whiteSpace: 'nowrap', '& .MuiTypography-root': { fontWeight: 600 } }}
        />
      </Stack>
    </LocalizationProvider>
  )
}
