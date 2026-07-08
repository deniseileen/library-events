export interface Event {
  id: string
  title: string
  description: string
  date: string
  startTime?: string
  endTime?: string
  library: string
  url?: string
  audience?: string
  registrationRequired?: boolean
}
