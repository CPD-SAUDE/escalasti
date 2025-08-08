export interface Professional {
  id: number;
  name: string;
  color: string;
}

export interface ScheduleEntry {
  id: number;
  date: string; // YYYY-MM-DD
  professionalId: number | null; // null if no professional is assigned
}

export interface HistoryEntry {
  id: number;
  date: string; // YYYY-MM-DD
  description: string;
}

export interface Config {
  id: number;
  networkIp: string;
}
