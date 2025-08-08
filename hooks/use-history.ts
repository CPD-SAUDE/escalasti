import { useState, useEffect, useCallback } from 'react'
import { getHistory, addHistory, deleteHistory } from '@/lib/api'
import { HistoryEntry } from '@/lib/types'

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHistory = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getHistory()
      setHistory(data)
    } catch (err) {
      console.error("Failed to fetch history:", err)
      setError("Falha ao carregar histórico.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const addHistoryEntry = useCallback(async (date: string, description: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const newEntry = await addHistory(date, description)
      setHistory(prev => [newEntry, ...prev]) // Adiciona no início para mostrar os mais recentes
    } catch (err) {
      console.error("Failed to add history entry:", err)
      setError("Falha ao adicionar registro de histórico.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteHistoryEntry = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await deleteHistory(id)
      setHistory(prev => prev.filter(entry => entry.id !== id))
    } catch (err) {
      console.error("Failed to delete history entry:", err)
      setError("Falha ao deletar registro de histórico.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { history, isLoading, error, addHistoryEntry, deleteHistoryEntry, refetchHistory: fetchHistory }
}
