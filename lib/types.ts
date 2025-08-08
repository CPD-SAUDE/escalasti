export interface Professional {
  id: number;
  name: string;
  color: string;
}

export interface ScheduleEntry {
  id: number;
  date: string; // Formato 'YYYY-MM-DD'
  professionalId: number | null; // Pode ser null se o dia estiver vazio
}

export interface HistoryEntry {
  id: number;
  date: string; // Formato 'YYYY-MM-DD'
  description: string;
}

export interface Config {
  id: number;
  holidays: string[]; // Array de datas em formato 'YYYY-MM-DD'
}
