import { Professional, ScheduleEntry, HistoryEntry, Config } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Função auxiliar para lidar com respostas da API
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(errorData.error || errorData.message || 'Erro na requisição');
  }
  return response.json();
}

// --- Profissionais ---
export async function getAllProfessionals(): Promise<Professional[]> {
  const response = await fetch(`${API_BASE_URL}/professionals`);
  return handleResponse<Professional[]>(response);
}

export async function addProfessional(professional: Omit<Professional, 'id'>): Promise<Professional> {
  const response = await fetch(`${API_BASE_URL}/professionals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(professional),
  });
  return handleResponse<Professional>(response);
}

export async function updateProfessional(id: number, professional: Omit<Professional, 'id'>): Promise<Professional> {
  const response = await fetch(`${API_BASE_URL}/professionals/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(professional),
  });
  return handleResponse<Professional>(response);
}

export async function deleteProfessional(id: number): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/professionals/${id}`, {
    method: 'DELETE',
  });
  return handleResponse<{ message: string }>(response);
}

// --- Escala ---
export async function getScheduleByMonth(year: number, month: number): Promise<ScheduleEntry[]> {
  const response = await fetch(`${API_BASE_URL}/schedule/${year}/${month}`);
  return handleResponse<ScheduleEntry[]>(response);
}

export async function addOrUpdateScheduleEntry(entry: Omit<ScheduleEntry, 'id'>): Promise<ScheduleEntry> {
  const response = await fetch(`${API_BASE_URL}/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  return handleResponse<ScheduleEntry>(response);
}

// --- Histórico ---
export async function getAllHistory(): Promise<HistoryEntry[]> {
  const response = await fetch(`${API_BASE_URL}/history`);
  return handleResponse<HistoryEntry[]>(response);
}

export async function addHistoryEntry(entry: Omit<HistoryEntry, 'id'>): Promise<HistoryEntry> {
  const response = await fetch(`${API_BASE_URL}/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  return handleResponse<HistoryEntry>(response);
}

export async function deleteHistoryEntry(id: number): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/history/${id}`, {
    method: 'DELETE',
  });
  return handleResponse<{ message: string }>(response);
}

// --- Configurações ---
export async function getConfig(): Promise<Config> {
  const response = await fetch(`${API_BASE_URL}/config`);
  return handleResponse<Config>(response);
}

export async function updateConfig(config: Partial<Config>): Promise<Config> {
  const response = await fetch(`${API_BASE_URL}/config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  return handleResponse<Config>(response);
}
