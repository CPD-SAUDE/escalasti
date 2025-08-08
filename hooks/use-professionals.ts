import { useState, useEffect, useCallback } from 'react'
import {
  fetchProfessionals,
  addProfessional as apiAddProfessional,
  updateProfessional as apiUpdateProfessional,
  deleteProfessional as apiDeleteProfessional,
} from '@/lib/api'
import { Professional } from '@/lib/types'

export function useProfessionals() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadProfessionals = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchProfessionals()
      setProfessionals(data)
    } catch (err: any) {
      setError(err)
      console.error('Failed to fetch professionals:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProfessionals()
  }, [loadProfessionals])

  const addProfessional = useCallback(
    async (name: string, color: string) => {
      setError(null)
      try {
        const newProfessional = await apiAddProfessional(name, color)
        setProfessionals((prev) => [...prev, newProfessional])
      } catch (err: any) {
        setError(err)
        console.error('Failed to add professional:', err)
        throw err
      }
    },
    [],
  )

  const updateProfessional = useCallback(
    async (id: number, name: string, color: string) => {
      setError(null)
      try {
        const updatedProfessional = await apiUpdateProfessional(id, name, color)
        setProfessionals((prev) =>
          prev.map((p) => (p.id === id ? updatedProfessional : p)),
        )
      } catch (err: any) {
        setError(err)
        console.error('Failed to update professional:', err)
        throw err
      }
    },
    [],
  )

  const deleteProfessional = useCallback(
    async (id: number) => {
      setError(null)
      try {
        await apiDeleteProfessional(id)
        setProfessionals((prev) => prev.filter((p) => p.id !== id))
      } catch (err: any) {
        setError(err)
        console.error('Failed to delete professional:', err)
        throw err
      }
    },
    [],
  )

  return {
    professionals,
    isLoading,
    error,
    addProfessional,
    updateProfessional,
    deleteProfessional,
    refetch: loadProfessionals,
  }
}
