import { useState, useEffect, useCallback } from 'react';
import { fetchAllHistoryApi, addHistoryEntryApi } from '@/lib/api';
import { HistoryEntry } from '@/lib/types';

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAllHistoryApi();
      setHistory(data);
    } catch (err) {
      setError('Failed to fetch history.');
      console.error('Error fetching history:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addHistoryEntry = useCallback(async (entry: Omit<HistoryEntry, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const newEntry = await addHistoryEntryApi(entry);
      setHistory((prevHistory) => [newEntry, ...prevHistory]); // Add new entry to the top
      return newEntry;
    } catch (err) {
      setError('Failed to add history entry.');
      console.error('Error adding history entry:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { history, isLoading, error, fetchHistory, addHistoryEntry };
}
