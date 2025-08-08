"use client";

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { ScaleData } from '@/lib/types';

export function useHistory() {
  const [history, setHistory] = useState<ScaleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getHistoryRecords(); // Updated line
      setHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar histórico');
      console.error('Erro ao buscar histórico:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveToHistory = async (data: Omit<ScaleData, 'id' | 'created_at'>) => {
    try {
      const savedRecord = await apiClient.saveToHistory(data);
      
      setHistory(prev => {
        const existingIndex = prev.findIndex(record => record.month_year === data.month_year);
        if (existingIndex > -1) {
          return prev.map((record, i) => i === existingIndex ? savedRecord : record);
        } else {
          return [...prev, savedRecord];
        }
      });
      
      return savedRecord;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao salvar no histórico';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteFromHistory = async (monthYear: string) => {
    try {
      await apiClient.deleteFromHistory(monthYear);
      setHistory(prev => prev.filter(record => record.month_year !== monthYear));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar do histórico';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getHistoryByMonth = async (monthYear: string) => {
    try {
      return await apiClient.getHistoryByMonth(monthYear);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar registro';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return {
    history,
    loading,
    error,
    saveToHistory,
    deleteFromHistory,
    getHistoryByMonth,
    refetch: fetchHistory,
  };
}
