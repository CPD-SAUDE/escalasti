// lib/api.ts
import { Professional, ScheduleEntry, HistoryRecord, Config } from './types';
import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface ScheduleEntryWithProfessional extends ScheduleEntry {
  professional_name: string;
  professional_color: string;
}

// Classe para agrupar todas as chamadas de API
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // --- Professionals API ---
  async getProfessionals(): Promise<Professional[]> {
    const response = await fetch(`${this.baseUrl}/professionals`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async createProfessional(professional: Omit<Professional, 'id' | 'created_at' | 'updated_at'>): Promise<Professional> {
    const response = await fetch(`${this.baseUrl}/professionals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(professional),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async updateProfessional(id: string, professional: Partial<Omit<Professional, 'id' | 'created_at' | 'updated_at'>>): Promise<Professional> {
    const response = await fetch(`${this.baseUrl}/professionals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(professional),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async deleteProfessional(id: string): Promise<{ message: string }> {
    const response = await fetch(`${this.baseUrl}/professionals/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // --- Schedule API ---
  async getScheduleEntries(): Promise<ScheduleEntryWithProfessional[]> {
    // Este método é genérico, para buscar todas as entradas sem filtro de mês/ano
    const response = await fetch(`${this.baseUrl}/schedule`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getScheduleByMonth(year: number, month: number): Promise<ScheduleEntryWithProfessional[]> {
    const response = await fetch(`${this.baseUrl}/schedule?year=${year}&month=${month}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async createOrUpdateScheduleEntry(entry: Omit<ScheduleEntry, 'id' | 'created_at' | 'updated_at'>): Promise<ScheduleEntry> {
    const response = await fetch(`${this.baseUrl}/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async deleteScheduleEntry(date: string): Promise<{ message: string }> {
    const response = await fetch(`${this.baseUrl}/schedule/${date}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async clearScheduleMonth(year: number, month: number): Promise<{ message: string, deletedCount: number }> {
    const response = await fetch(`${this.baseUrl}/schedule/clear-month`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year, month }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // --- History API ---
  async getHistoryRecords(): Promise<HistoryRecord[]> {
    const response = await fetch(`${this.baseUrl}/history`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async saveToHistory(record: Omit<HistoryRecord, 'id' | 'created_at'>): Promise<HistoryRecord> {
    const response = await fetch(`${this.baseUrl}/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async deleteFromHistory(id: string): Promise<{ message: string }> {
    const response = await fetch(`${this.baseUrl}/history/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // --- Config API ---
  async getConfig(): Promise<Config> {
    const response = await fetch(`${this.baseUrl}/config`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async updateConfig(config: Omit<Config, 'id' | 'created_at' | 'updated_at'>): Promise<Config> {
    const response = await fetch(`${this.baseUrl}/config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
}

// Exporta uma instância única do ApiClient
export const apiClient = new ApiClient(API_BASE_URL);

// Hook para verificar a conexão com a API
export function useApiConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Flag para evitar atualização de estado em componente desmontado

    const checkConnection = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/status`);
        if (isMounted) {
          setIsConnected(response.ok);
        }
      } catch (error) {
        if (isMounted) {
          setIsConnected(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000); // Verifica a cada 5 segundos

    return () => {
      isMounted = false; // Limpa a flag ao desmontar
      clearInterval(interval);
    };
  }, []);

  return { isConnected, isLoading };
}
