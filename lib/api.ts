// lib/api.ts
import { Professional, ScheduleEntry, HistoryRecord, Config } from './types';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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
    const response = await axios.get(`${this.baseUrl}/professionals`);
    return response.data;
  }

  async createProfessional(professional: Omit<Professional, 'id' | 'created_at' | 'updated_at'>): Promise<Professional> {
    const response = await axios.post(`${this.baseUrl}/professionals`, professional);
    return response.data;
  }

  async updateProfessional(id: string, professional: Partial<Omit<Professional, 'id' | 'created_at' | 'updated_at'>>): Promise<Professional> {
    const response = await axios.put(`${this.baseUrl}/professionals/${id}`, professional);
    return response.data;
  }

  async deleteProfessional(id: string): Promise<{ message: string }> {
    const response = await axios.delete(`${this.baseUrl}/professionals/${id}`);
    return response.data;
  }

  // --- Schedule API ---
  async getScheduleEntries(): Promise<ScheduleEntryWithProfessional[]> {
    // Este método é genérico, para buscar todas as entradas sem filtro de mês/ano
    const response = await axios.get(`${this.baseUrl}/schedule`);
    return response.data;
  }

  async getScheduleByMonth(year: number, month: number): Promise<ScheduleEntryWithProfessional[]> {
    const response = await axios.get(`${this.baseUrl}/schedule?year=${year}&month=${month}`);
    return response.data;
  }

  async createOrUpdateScheduleEntry(entry: Omit<ScheduleEntry, 'id' | 'created_at' | 'updated_at'>): Promise<ScheduleEntry> {
    const response = await axios.post(`${this.baseUrl}/schedule`, entry);
    return response.data;
  }

  async deleteScheduleEntry(date: string): Promise<{ message: string }> {
    const response = await axios.delete(`${this.baseUrl}/schedule/${date}`);
    return response.data;
  }

  async clearScheduleMonth(year: number, month: number): Promise<{ message: string, deletedCount: number }> {
    const response = await axios.post(`${this.baseUrl}/schedule/clear-month`, { year, month });
    return response.data;
  }

  // --- History API ---
  async getHistoryRecords(): Promise<HistoryRecord[]> {
    const response = await axios.get(`${this.baseUrl}/history`);
    return response.data;
  }

  async saveToHistory(record: Omit<HistoryRecord, 'id' | 'created_at'>): Promise<HistoryRecord> {
    const response = await axios.post(`${this.baseUrl}/history`, record);
    return response.data;
  }

  async deleteFromHistory(id: string): Promise<{ message: string }> {
    const response = await axios.delete(`${this.baseUrl}/history/${id}`);
    return response.data;
  }

  // --- Config API ---
  async getConfig(): Promise<Config> {
    const response = await axios.get(`${this.baseUrl}/config`);
    return response.data;
  }

  async updateConfig(config: Omit<Config, 'id' | 'created_at' | 'updated_at'>): Promise<Config> {
    const response = await axios.put(`${this.baseUrl}/config`, config);
    return response.data;
  }
}

// Exporta uma instância única do ApiClient
export const apiClient = new ApiClient(API_URL);

// Hook para verificar a conexão com a API
export function useApiConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Flag para evitar atualização de estado em componente desmontado

    const checkConnection = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/status`);
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
