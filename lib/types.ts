export interface Professional {
  id: string;
  name: string;
  color: string;
}

export interface ScheduleEntry {
  id: string;
  date: string; // YYYY-MM-DD
  professionalId: string | null;
  professionalName?: string; // Populated by join in backend
  professionalColor?: string; // Populated by join in backend
}

export interface HistoryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
}

export interface Config {
  id: number;
  backendIp: string | null;
}
