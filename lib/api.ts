import { Professional, ScheduleEntry, HistoryEntry, Config } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// --- Professionals API ---
export async function getAllProfessionals(): Promise<Professional[]> {
  const response = await fetch(`${API_BASE_URL}/professionals`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function addProfessional(professional: Omit<Professional, 'id'>): Promise<Professional> {
  const response = await fetch(`${API_BASE_URL}/professionals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(professional),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function updateProfessional(id: number, professional: Omit<Professional, 'id'>): Promise<Professional> {
  const response = await fetch(`${API_BASE_URL}/professionals/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(professional),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function deleteProfessional(id: number): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/professionals/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// --- Schedule API ---
export async function getScheduleByMonth(year: number, month: number): Promise<ScheduleEntry[]> {
  const response = await fetch(`${API_BASE_URL}/schedule/${year}/${month}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function addOrUpdateScheduleEntry(entry: Omit<ScheduleEntry, 'id'>): Promise<ScheduleEntry> {
  const response = await fetch(`${API_BASE_URL}/schedule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entry),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// --- History API ---
export async function getAllHistory(): Promise<HistoryEntry[]> {
  const response = await fetch(`${API_BASE_URL}/history`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function addHistoryEntry(entry: Omit<HistoryEntry, 'id'>): Promise<HistoryEntry> {
  const response = await fetch(`${API_BASE_URL}/history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entry),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// --- Config API ---
export async function getConfig(): Promise<Config> {
  const response = await fetch(`${API_BASE_URL}/config`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function updateConfig(config: Partial<Config>): Promise<Config> {
  const response = await fetch(`${API_BASE_URL}/config`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}
