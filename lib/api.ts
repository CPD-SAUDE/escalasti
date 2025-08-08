import { Professional, ScheduleEntry, HistoryEntry, Config } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Função auxiliar para lidar com respostas da API
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(errorData.message || 'Erro na requisição');
  }
  return response.json();
}

// --- Status da API ---
export async function getApiStatus(): Promise<{ status: string; timestamp: string }> {
  const response = await fetch(`${API_BASE_URL}/status`);
  return handleResponse(response);
}

// --- Profissionais ---
export async function getAllProfessionals(): Promise<Professional[]> {
  const response = await fetch(`${API_BASE_URL}/professionals`);
  return handleResponse(response);
}

export async function getProfessionalById(id: number): Promise<Professional> {
  const response = await fetch(`${API_BASE_URL}/professionals/${id}`);
  return handleResponse(response);
}

export async function addProfessional(professional: Omit<Professional, 'id'>): Promise<Professional> {
  const response = await fetch(`${API_BASE_URL}/professionals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(professional),
  });
  return handleResponse(response);
}

export async function updateProfessional(id: number, professional: Omit<Professional, 'id'>): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/professionals/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(professional),
  });
  return handleResponse(response);
}

export async function deleteProfessional(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/professionals/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}

// --- Escala ---
export async function getScheduleByMonth(year: number, month: number): Promise<ScheduleEntry[]> {
  const response = await fetch(`${API_BASE_URL}/schedule/${year}/${month}`);
  return handleResponse(response);
}

export async function addOrUpdateScheduleEntry(entry: Omit<ScheduleEntry, 'id'>): Promise<ScheduleEntry> {
  const response = await fetch(`${API_BASE_URL}/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  return handleResponse(response);
}

export async function deleteScheduleEntry(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/schedule/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}

// --- Histórico ---
export async function getAllHistory(): Promise<HistoryEntry[]> {
  const response = await fetch(`${API_BASE_URL}/history`);
  return handleResponse(response);
}

export async function getHistoryByMonth(year: number, month: number): Promise<HistoryEntry[]> {
  const response = await fetch(`${API_BASE_URL}/history/${year}/${month}`);
  return handleResponse(response);
}

export async function addHistoryEntry(entry: Omit<HistoryEntry, 'id'>): Promise<HistoryEntry> {
  const response = await fetch(`${API_BASE_URL}/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  return handleResponse(response);
}

// --- Configurações ---
export async function getConfig(): Promise<Config> {
  const response = await fetch(`${API_BASE_URL}/config`);
  return handleResponse(response);
}

export async function updateConfig(config: Omit<Config, 'id'>): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  return handleResponse(response);
}
