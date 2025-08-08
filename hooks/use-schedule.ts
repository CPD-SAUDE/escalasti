import { useState, useEffect, useCallback } from 'react';
import { getScheduleByMonth, addOrUpdateScheduleEntry, deleteScheduleEntry } from '@/lib/api';
import { ScheduleEntry } from '@/lib/types';

export function useSchedule(year: number, month: number) {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getScheduleByMonth(year, month);
      setSchedule(data);
    } catch (err) {
      setError('Erro ao carregar escala.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const addOrUpdateEntry = useCallback(async (entry: Omit<ScheduleEntry, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      await addOrUpdateScheduleEntry(entry);
      await fetchSchedule(); // Recarrega a escala após adicionar/atualizar
      return true;
    } catch (err) {
      setError('Erro ao adicionar ou atualizar entrada da escala.');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchSchedule]);

  const deleteEntry = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteScheduleEntry(id);
      await fetchSchedule(); // Recarrega a escala após deletar
      return true;
    } catch (err) {
      setError('Erro ao remover entrada da escala.');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchSchedule]);

  return { schedule, isLoading, error, addOrUpdateEntry, deleteEntry, refetchSchedule: fetchSchedule };
}
