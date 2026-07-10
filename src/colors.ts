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

export const TIME_TEXT_COLORS: Record<string, string> = {
  'Morning (8am–12pm)': '#8B6914',
  'Afternoon (12pm–5pm)': '#1A6B65',
  'Evening (5pm–11pm)': '#5B4BCE',
}

export const CHIP_TEXT_COLOR = '#1A1A1A'

export const DAY_COLORS: Record<string, string> = {
  'Mon': '#FF6B6B',
  'Tue': '#FDB813',
  'Wed': '#4ECDC4',
  'Thu': '#7B68EE',
  'Fri': '#FF8C94',
  'Sat': '#BAFFC9',
  'Sun': '#BAB4FF',
}
