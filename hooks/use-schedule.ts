import { useState, useEffect, useCallback } from 'react'
import { ScheduleEntry } from '@/lib/types'

export function useSchedule() {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

  const fetchSchedule = useCallback(async (year: number, month: number) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/schedule?year=${year}&month=${month}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setSchedule(data)
    } catch (e) {
      setError(e as Error)
      console.error("Failed to fetch schedule:", e)
    } finally {
      setLoading(false)
    }
  }, [API_URL])

  const updateScheduleEntry = useCallback(async (
    year: number,
    month: number,
    day: number,
    professionalId: number | null,
    hours: number | null,
    notes: string
  ) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/schedule?year=${year}&month=${month}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ day, professionalId, hours, notes }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      // Optimistically update the local state
      setSchedule(prev => prev.map(entry =>
        entry.day === day ? { ...entry, professionalId, hours, notes } : entry
      ));
      return data
    } catch (e) {
      setError(e as Error)
      console.error("Failed to update schedule entry:", e)
      throw e;
    } finally {
      setLoading(false)
    }
  }, [API_URL])

  const generateSchedule = useCallback(async (year: number, month: number, type: 'daily' | 'weekly') => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/schedule/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ year, month, type }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      // After generation, refetch the schedule to get the new data
      await fetchSchedule(year, month);
      return data
    } catch (e) {
      setError(e as Error)
      console.error("Failed to generate schedule:", e)
      throw e;
    } finally {
      setLoading(false)
    }
  }, [API_URL, fetchSchedule])

  const clearSchedule = useCallback(async (year: number, month: number) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/schedule/clear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ year, month }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      // After clearing, refetch the schedule to get the empty state
      await fetchSchedule(year, month);
      return data
    } catch (e) {
      setError(e as Error)
      console.error("Failed to clear schedule:", e)
      throw e;
    } finally {
      setLoading(false)
    }
  }, [API_URL, fetchSchedule])

  return { schedule, fetchSchedule, updateScheduleEntry, generateSchedule, clearSchedule, loading, error }
}
