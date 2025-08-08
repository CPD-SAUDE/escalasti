import { useState, useEffect, useCallback } from 'react'
import { fetchHistory as apiFetchHistory } from '@/lib/api'
import { HistoryEntry } from '@/lib/types'

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchHistory = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await apiFetchHistory()
      setHistory(data)
    } catch (err: any) {
      setError(err)
      console.error('Failed to fetch history:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return { history, isLoading, error, fetchHistory }
}
