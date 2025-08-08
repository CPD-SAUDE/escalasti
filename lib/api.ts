import { Professional, ScheduleData, HistoryEntry, Config } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Helper function for API calls
async function apiCall<T>(
  url: string,
  method: string,
  data?: any,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
    throw new Error(errorData.error || errorData.message || 'Something went wrong')
  }

  // For DELETE requests, response might be empty
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T // Return an empty object for successful empty responses
  }

  return response.json()
}

// Professionals API
export const fetchProfessionals = (): Promise<Professional[]> =>
  apiCall<Professional[]>('/professionals', 'GET')

export const addProfessional = (name: string, color: string): Promise<Professional> =>
  apiCall<Professional>('/professionals', 'POST', { name, color })

export const updateProfessional = (
  id: number,
  name: string,
  color: string,
): Promise<Professional> =>
  apiCall<Professional>(`/professionals/${id}`, 'PUT', { name, color })

export const deleteProfessional = (id: number): Promise<void> =>
  apiCall<void>(`/professionals/${id}`, 'DELETE')

// Schedule API
export const fetchSchedule = (year: number, month: number): Promise<ScheduleData> =>
  apiCall<ScheduleData>(`/schedule/${year}/${month}`, 'GET')

export const saveSchedule = (
  year: number,
  month: number,
  data: ScheduleData,
): Promise<void> => apiCall<void>('/schedule', 'POST', { year, month, data })

// History API
export const fetchHistory = (): Promise<HistoryEntry[]> =>
  apiCall<HistoryEntry[]>('/history', 'GET')

// Config API
export const fetchConfig = (): Promise<Config> =>
  apiCall<Config>('/config', 'GET')

export const updateConfig = (config: Partial<Config>): Promise<Config> =>
  apiCall<Config>('/config', 'PUT', config)
