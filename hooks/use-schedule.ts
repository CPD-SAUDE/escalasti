import { useState, useEffect, useCallback } from 'react'
import { fetchSchedule, saveSchedule as apiSaveSchedule } from '@/lib/api'
import { ScheduleData } from '@/lib/types'

export function useSchedule(year: number, month: number) {
  const [schedule, setSchedule] = useState<ScheduleData>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadSchedule = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchSchedule(year, month)
      setSchedule(data)
    } catch (err: any) {
      setError(err)
      console.error('Failed to fetch schedule:', err)
    } finally {
      setIsLoading(false)
    }
  }, [year, month])

  useEffect(() => {
    loadSchedule()
  }, [loadSchedule])

  const updateSchedule = useCallback(
    async (year: number, month: number, data: ScheduleData) => {
      setError(null)
      try {
        await apiSaveSchedule(year, month, data)
        setSchedule(data) // Update local state immediately on success
      } catch (err: any) {
        setError(err)
        console.error('Failed to save schedule:', err)
        throw err
      }
    },
    [],
  )

  return { schedule, isLoading, error, updateSchedule, refetch: loadSchedule }
}
