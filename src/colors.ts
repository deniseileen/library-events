export const LIBRARY_COLORS: Record<string, string> = {
  'Melrose Public Library': '#FF6B6B',
  'Stoneham Public Library': '#4ECDC4',
  'Lucius Beebe Memorial Library (Wakefield)': '#FFE66D',
  'Saugus Public Library': '#B19CD9',
  'Boston Public Library': '#87CEEB',
}

export const AUDIENCE_COLORS: Record<string, string> = {
  'Children': '#BAFFC9',
  'Teens': '#BAB4FF',
  'Adults': '#BAE1FF',
}

export const TIME_GROUPS = ['Morning (8am–12pm)', 'Afternoon (12pm–5pm)', 'Evening (5pm–11pm)'] as const
export type TimeGroup = (typeof TIME_GROUPS)[number]

export function getTimeGroup(startTime?: string): TimeGroup | undefined {
  if (!startTime) return undefined
  const h = parseInt(startTime.split(':')[0])
  if (h >= 8 && h < 12) return 'Morning (8am–12pm)'
  if (h >= 12 && h < 17) return 'Afternoon (12pm–5pm)'
  if (h >= 17 && h < 23) return 'Evening (5pm–11pm)'
  return undefined
}

export const TIME_BORDER_COLORS: Record<string, string> = {
  'Morning (8am–12pm)': '#FDB813',
  'Afternoon (12pm–5pm)': '#4ECDC4',
  'Evening (5pm–11pm)': '#7B68EE',
}

export const TIME_CHIP_COLORS: Record<string, string> = {
  'Morning (8am–12pm)': '#FFF3D0',
  'Afternoon (12pm–5pm)': '#D4F5EF',
  'Evening (5pm–11pm)': '#D8CCF9',
}

export const TIME_TEXT_COLORS: Record<string, string> = {
  'Morning (8am–12pm)': '#8B6914',
  'Afternoon (12pm–5pm)': '#1A6B65',
  'Evening (5pm–11pm)': '#5B4BCE',
}

export const CHIP_TEXT_COLOR = '#1A1A1A'

export const DAY_COLORS: Record<string, string> = {
  'Mon': '#FFB3B3',
  'Tue': '#FFE082',
  'Wed': '#A8E6CF',
  'Thu': '#B8A9C9',
  'Fri': '#FFCCBC',
  'Sat': '#C8F7C5',
  'Sun': '#D4B3FF',
}

export const DAY_TEXT_COLORS: Record<string, string> = {
  'Mon': '#7A1A1A',
  'Tue': '#7A5C00',
  'Wed': '#1A5C3A',
  'Thu': '#3A1A6B',
  'Fri': '#7A3A1A',
  'Sat': '#1A5C1A',
  'Sun': '#4A1A7A',
}
