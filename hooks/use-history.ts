import { useState, useEffect, useCallback } from 'react';
import { getAllHistory, addHistoryEntry, deleteHistoryEntry } from '@/lib/api';
import { HistoryEntry } from '@/lib/types';

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllHistory();
      setHistory(data);
    } catch (err) {
      setError('Erro ao carregar histórico.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const addEntry = useCallback(async (entry: Omit<HistoryEntry, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      await addHistoryEntry(entry);
      await fetchHistory(); // Recarrega o histórico após adicionar
    } catch (err) {
      setError('Erro ao adicionar entrada de histórico.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchHistory]);

  const deleteEntry = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteHistoryEntry(id);
      await fetchHistory(); // Recarrega o histórico após deletar
    } catch (err) {
      setError('Erro ao remover entrada de histórico.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchHistory]);

  return { history, isLoading, error, addEntry, deleteEntry, fetchHistory };
}
