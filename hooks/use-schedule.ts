import { useState, useEffect, useCallback } from 'react';
import { getScheduleByMonth as fetchScheduleByMonthApi, addOrUpdateScheduleEntry as addOrUpdateScheduleEntryApi } from '@/lib/api';
import { ScheduleEntry } from '@/lib/types';

export function useSchedule(year: number, month: number) {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchScheduleByMonthApi(year, month);
      setSchedule(data);
    } catch (err) {
      setError('Failed to fetch schedule.');
      console.error('Error fetching schedule:', err);
    } finally {
      setIsLoading(false);
    }
  }, [year, month]);

  const addOrUpdateScheduleEntry = useCallback(async (entry: Omit<ScheduleEntry, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedEntry = await addOrUpdateScheduleEntryApi(entry);
      // Re-fetch the entire schedule to ensure consistency after update/add
      await fetchSchedule();
      return updatedEntry;
    } catch (err) {
      setError('Failed to add or update schedule entry.');
      console.error('Error adding/updating schedule entry:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchSchedule]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  return { schedule, isLoading, error, fetchSchedule, addOrUpdateScheduleEntry };
}
