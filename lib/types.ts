export interface Professional {
  id: number
  name: string
  color: string
}

export interface ScheduleData {
  [day: number]: number | null // day (1-31) maps to professional ID or null
}

export interface HistoryEntry {
  id: number
  action: string
  details: any // JSON stringified details
  timestamp: string // ISO 8601 string
}

export interface Config {
  id: number
  api_url: string
}
