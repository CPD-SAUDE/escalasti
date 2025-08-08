import { useState, useEffect, useCallback } from 'react'
import { ScheduleEntry, Professional, Config } from '@/lib/types'

interface HistoryEntry {
  id: number
  year: number
  month: number
  monthYear: string
  scheduleData: ScheduleEntry[]
  summaryData: { professional: Professional; totalHours: number }[]
  companyName: string
  departmentName: string
  systemName: string
  savedAt: string
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/history`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setHistory(data)
    } catch (e) {
      setError(e as Error)
      console.error("Failed to fetch history:", e)
    } finally {
      setLoading(false)
    }
  }, [API_URL])

  const saveSchedule = useCallback(async (
    year: number,
    month: number,
    scheduleData: ScheduleEntry[],
    summaryData: { professional: Professional; totalHours: number }[],
    companyName: string,
    departmentName: string,
    systemName: string
  ) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ year, month, scheduleData, summaryData, companyName, departmentName, systemName }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      fetchHistory() // Refresh history after saving
      return data
    } catch (e) {
      setError(e as Error)
      console.error("Failed to save schedule:", e)
      throw e;
    } finally {
      setLoading(false)
    }
  }, [API_URL, fetchHistory])

  const deleteHistoryEntry = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/history/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      fetchHistory() // Refresh history after deleting
      return data
    } catch (e) {
      setError(e as Error)
      console.error("Failed to delete history entry:", e)
      throw e;
    } finally {
      setLoading(false)
    }
  }, [API_URL, fetchHistory])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return { history, fetchHistory, saveSchedule, deleteHistoryEntry, loading, error }
}
