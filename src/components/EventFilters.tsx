import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  Select,
  MenuItem,
  TextField,
  Stack,
  Button,
  Box,
} from '@mui/material'
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
    <FormControl size="small" sx={{ minWidth: 200 }}>
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
  exactDate: string
  onExactDateChange: (date: string) => void
  timeGroups: string[]
  onTimeGroupsChange: (groups: string[]) => void
}

export default function EventFilters({
  libraries,
  selectedLibraries,
  onLibrariesChange,
  audiences,
  selectedAudiences,
  onAudiencesChange,
  exactDate,
  onExactDateChange,
  timeGroups,
  onTimeGroupsChange,
}: EventFiltersProps) {
  return (
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
      <TextField
        size="small"
        type="date"
        label="Exact date"
        value={exactDate}
        onChange={(e) => onExactDateChange(e.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{ minWidth: 160, '& .MuiOutlinedInput-root': { backgroundColor: '#E0F0FF', borderRadius: 3 } }}
      />
      <MultiSelect
        label="Time of day"
        pluralLabel="times of day"
        options={[...TIME_GROUPS]}
        value={timeGroups}
        onChange={onTimeGroupsChange}
        bgColor="#FFF0E0"
      />
    </Stack>
  )
}
