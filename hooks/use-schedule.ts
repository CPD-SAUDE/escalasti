import { useState, useEffect, useCallback } from 'react'
import { getScheduleByMonth, addOrUpdateScheduleEntry as apiAddOrUpdateScheduleEntry } from '@/lib/api'
import { ScheduleEntry } from '@/lib/types'

export function useSchedule(year: number, month: number) {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSchedule = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getScheduleByMonth(year, month)
      setSchedule(data)
    } catch (err) {
      console.error(`Failed to fetch schedule for ${month}/${year}:`, err)
      setError("Falha ao carregar a escala.")
    } finally {
      setIsLoading(false)
    }
  }, [year, month])

  useEffect(() => {
    fetchSchedule()
  }, [fetchSchedule])

  const addOrUpdateScheduleEntry = useCallback(async (date: string, professionalId: string | null) => {
    setIsLoading(true)
    setError(null)
    try {
      const updatedEntry = await apiAddOrUpdateScheduleEntry(date, professionalId)
      setSchedule(prev => {
        const existingIndex = prev.findIndex(entry => entry.date === date)
        if (existingIndex > -1) {
          // Atualiza a entrada existente
          const newSchedule = [...prev]
          if (professionalId === null) {
            // Se professionalId é null, remove a entrada
            newSchedule.splice(existingIndex, 1)
          } else {
            // Atualiza o profissional
            const professional = updatedEntry.professionalId ? { id: updatedEntry.professionalId, name: updatedEntry.professionalName || '', color: updatedEntry.professionalColor || '' } : undefined;
            newSchedule[existingIndex] = { ...prev[existingIndex], professionalId: professionalId, professionalName: professional?.name, professionalColor: professional?.color };
          }
          return newSchedule;
        } else if (professionalId !== null) {
          // Adiciona nova entrada se professionalId não for null
          const professional = updatedEntry.professionalId ? { id: updatedEntry.professionalId, name: updatedEntry.professionalName || '', color: updatedEntry.professionalColor || '' } : undefined;
          return [...prev, { id: updatedEntry.id, date: updatedEntry.date, professionalId: professionalId, professionalName: professional?.name, professionalColor: professional?.color }];
        }
        return prev; // Não faz nada se não existe e professionalId é null
      });
      await fetchSchedule(); // Re-fetch para garantir consistência
    } catch (err) {
      console.error("Failed to add or update schedule entry:", err)
      setError("Falha ao adicionar/atualizar entrada da escala.")
    } finally {
      setIsLoading(false)
    }
  }, [fetchSchedule])

  const deleteScheduleEntry = useCallback(async (date: string) => {
    // A API addOrUpdateScheduleEntry já lida com a remoção passando professionalId: null
    // Este wrapper é para clareza ou se houvesse uma rota DELETE específica
    await addOrUpdateScheduleEntry(date, null);
  }, [addOrUpdateScheduleEntry]);


  return { schedule, isLoading, error, addOrUpdateScheduleEntry, deleteScheduleEntry, refetchSchedule: fetchSchedule }
}
