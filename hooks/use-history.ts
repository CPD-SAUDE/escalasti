'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import { toast } from 'sonner'

interface HistoryItem {
  id: number
  year: number
  month: number
  monthYear: string
  scheduleData: string // JSON string
  summaryData: string // JSON string
  companyName: string | null
  departmentName: string | null
  systemName: string | null
  savedAt: string // ISO string
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/history')
      setHistory(response.data)
    } catch (err: any) {
      console.error('Erro ao buscar histórico:', err)
      setError(err.message || 'Erro ao carregar histórico.')
      toast.error('Erro ao carregar histórico.')
    } finally {
      setLoading(false)
    }
  }, [])

  const saveHistory = useCallback(async (data: Omit<HistoryItem, 'id' | 'savedAt'>) => {
    try {
      const response = await api.post('/history', data)
      toast.success('Histórico salvo com sucesso!')
      fetchHistory() // Recarrega o histórico após salvar
      return response.data
    } catch (err: any) {
      console.error('Erro ao salvar histórico:', err)
      setError(err.message || 'Erro ao salvar histórico.')
      toast.error('Erro ao salvar histórico.')
      throw err
    }
  }, [fetchHistory])

  const deleteHistoryItem = useCallback(async (id: number) => {
    try {
      await api.delete(`/history/${id}`)
      toast.success('Item do histórico deletado com sucesso!')
      setHistory(prevHistory => prevHistory.filter(item => item.id !== id)) // Remove da lista localmente
    } catch (err: any) {
      console.error('Erro ao deletar item do histórico:', err)
      setError(err.message || 'Erro ao deletar item do histórico.')
      toast.error('Erro ao deletar item do histórico.')
      throw err
    }
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return { history, loading, error, fetchHistory, saveHistory, deleteHistoryItem }
}
