import { useState, useEffect, useCallback } from 'react';
import { HistoryEntry } from '@/lib/types';

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/history`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: HistoryEntry[] = await response.json();
      setHistory(data);
    } catch (e: any) {
      setError(e.message);
      console.error("Failed to fetch history:", e);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const addHistoryEntry = useCallback(async (date: string, description: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, description }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json(); // Get the new entry with ID
      await fetchHistory(); // Re-fetch history to ensure state is up-to-date
    } catch (e: any) {
      setError(e.message);
      console.error("Failed to add history entry:", e);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, fetchHistory]);

  const deleteHistoryEntry = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/history/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
      await fetchHistory(); // Re-fetch history to ensure state is up-to-date
    } catch (e: any) {
      setError(e.message);
      console.error("Failed to delete history entry:", e);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, fetchHistory]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { history, loading, error, addHistoryEntry, deleteHistoryEntry, fetchHistory };
}
