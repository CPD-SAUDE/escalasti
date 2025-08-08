import { useState, useEffect, useCallback } from 'react';
import { ScheduleEntry } from '@/lib/types';

export function useSchedule() {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  const getScheduleByMonth = useCallback(async (year: number, month: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/schedule/${year}/${month}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ScheduleEntry[] = await response.json();
      setSchedule(data);
    } catch (e: any) {
      setError(e.message);
      console.error("Failed to fetch schedule:", e);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const addOrUpdateScheduleEntry = useCallback(async (date: string, professionalId: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, professionalId }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
      // Re-fetch the current month's schedule to reflect changes
      const currentMonth = new Date(date);
      await getScheduleByMonth(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
    } catch (e: any) {
      setError(e.message);
      console.error("Failed to add or update schedule entry:", e);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, getScheduleByMonth]);

  return { schedule, loading, error, getScheduleByMonth, addOrUpdateScheduleEntry };
}
