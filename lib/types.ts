export interface Professional {
  id: string;
  name: string;
  color: string;
}

export interface ScheduleEntry {
  id: string;
  date: string; // YYYY-MM-DD
  professionalId: string | null;
  professionalName?: string; // Opcional, para facilitar o frontend
  professionalColor?: string; // Opcional, para facilitar o frontend
}

export interface HistoryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
}

export interface Config {
  backendIp: string | null;
}
