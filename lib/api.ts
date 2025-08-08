import { Professional, ScheduleEntry, HistoryEntry, Config } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Helper para lidar com respostas da API
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(errorData.message || 'Erro na requisição da API')
  }
  return response.json()
}

// --- API Status ---
export async function getApiStatus(): Promise<{ status: string; database: string }> {
  const response = await fetch(`${API_BASE_URL}/status`, { cache: 'no-store' })
  return handleResponse(response)
}

// --- Professionals API ---
export async function getProfessionals(): Promise<Professional[]> {
  const response = await fetch(`${API_BASE_URL}/professionals`, { cache: 'no-store' })
  return handleResponse(response)
}

export async function addProfessional(name: string, color: string): Promise<Professional> {
  const response = await fetch(`${API_BASE_URL}/professionals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  })
  return handleResponse(response)
}

export async function updateProfessional(id: string, name: string, color: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/professionals/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  })
  await handleResponse(response)
}

export async function deleteProfessional(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/professionals/${id}`, {
    method: 'DELETE',
  })
  await handleResponse(response)
}

// --- Schedule API ---
export async function getScheduleByMonth(year: number, month: number): Promise<ScheduleEntry[]> {
  const response = await fetch(`${API_BASE_URL}/schedule/${year}/${month}`, { cache: 'no-store' })
  return handleResponse(response)
}

export async function addOrUpdateScheduleEntry(date: string, professionalId: string | null): Promise<ScheduleEntry> {
  const response = await fetch(`${API_BASE_URL}/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, professionalId }),
  })
  return handleResponse(response)
}

// --- History API ---
export async function getHistory(): Promise<HistoryEntry[]> {
  const response = await fetch(`${API_BASE_URL}/history`, { cache: 'no-store' })
  return handleResponse(response)
}

export async function addHistory(date: string, description: string): Promise<HistoryEntry> {
  const response = await fetch(`${API_BASE_URL}/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, description }),
  })
  return handleResponse(response)
}

export async function deleteHistory(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/history/${id}`, {
    method: 'DELETE',
  })
  await handleResponse(response)
}

// --- Config API ---
export async function getConfig(): Promise<Config> {
  const response = await fetch(`${API_BASE_URL}/config`, { cache: 'no-store' })
  return handleResponse(response)
}

export async function updateConfig(config: Partial<Config>): Promise<Config> {
  const response = await fetch(`${API_BASE_URL}/config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  })
  return handleResponse(response)
}
