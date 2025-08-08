import { useState, useEffect, useCallback } from 'react'
import { getProfessionals, addProfessional as apiAddProfessional, updateProfessional as apiUpdateProfessional, deleteProfessional as apiDeleteProfessional } from '@/lib/api'
import { Professional } from '@/lib/types'

export function useProfessionals() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfessionals = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getProfessionals()
      setProfessionals(data)
    } catch (err) {
      console.error("Failed to fetch professionals:", err)
      setError("Falha ao carregar profissionais.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfessionals()
  }, [fetchProfessionals])

  const addProfessional = useCallback(async (name: string, color: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const newProfessional = await apiAddProfessional(name, color)
      setProfessionals(prev => [...prev, newProfessional])
    } catch (err) {
      console.error("Failed to add professional:", err)
      setError("Falha ao adicionar profissional.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateProfessional = useCallback(async (id: string, name: string, color: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await apiUpdateProfessional(id, name, color)
      setProfessionals(prev => prev.map(p => p.id === id ? { ...p, name, color } : p))
    } catch (err) {
      console.error("Failed to update professional:", err)
      setError("Falha ao atualizar profissional.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteProfessional = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await apiDeleteProfessional(id)
      setProfessionals(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error("Failed to delete professional:", err)
      setError("Falha ao deletar profissional.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { professionals, isLoading, error, addProfessional, updateProfessional, deleteProfessional, refetchProfessionals: fetchProfessionals }
}
