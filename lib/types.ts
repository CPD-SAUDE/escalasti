export interface Professional {
  id: number;
  name: string;
  color: string;
}

export interface ScheduleEntry {
  id: number;
  date: string; // Formato 'YYYY-MM-DD'
  professionalId: number | null; // ID do profissional ou null se não houver atribuição
}

export interface HistoryEntry {
  id: number;
  date: string; // Formato 'YYYY-MM-DD'
  description: string;
}

export interface Config {
  id: number;
  backendIp: string | null;
}
