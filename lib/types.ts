export interface Professional {
  id: number
  name: string
  defaultHours: number
  color: string
}

export interface ScheduleEntry {
  day: number
  professionalId: number | null
  hours: number | null
  notes: string
}

export interface Config {
  id: number
  companyName: string
  departmentName: string
  systemName: string
}
