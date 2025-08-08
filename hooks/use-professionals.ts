import { useState, useEffect, useCallback } from 'react'
import { Professional } from '@/lib/types'

export function useProfessionals() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

  const fetchProfessionals = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/professionals`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setProfessionals(data)
    } catch (e) {
      setError(e as Error)
      console.error("Failed to fetch professionals:", e)
    } finally {
      setLoading(false)
    }
  }, [API_URL])

  const addProfessional = useCallback(async (name: string, defaultHours: number, color: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/professionals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, defaultHours, color }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const newProfessional = await response.json()
      setProfessionals(prev => [...prev, newProfessional])
      return newProfessional
    } catch (e) {
      setError(e as Error)
      console.error("Failed to add professional:", e)
      throw e;
    } finally {
      setLoading(false)
    }
  }, [API_URL])

  const updateProfessional = useCallback(async (id: number, name: string, defaultHours: number, color: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/professionals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, defaultHours, color }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const updatedProfessional = await response.json()
      setProfessionals(prev => prev.map(p => p.id === id ? { ...p, name, defaultHours, color } : p))
      return updatedProfessional
    } catch (e) {
      setError(e as Error)
      console.error("Failed to update professional:", e)
      throw e;
    } finally {
      setLoading(false)
    }
  }, [API_URL])

  const deleteProfessional = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/professionals/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      setProfessionals(prev => prev.filter(p => p.id !== id))
      return result
    } catch (e) {
      setError(e as Error)
      console.error("Failed to delete professional:", e)
      throw e;
    } finally {
      setLoading(false)
    }
  }, [API_URL])

  useEffect(() => {
    fetchProfessionals()
  }, [fetchProfessionals])

  return { professionals, fetchProfessionals, addProfessional, updateProfessional, deleteProfessional, loading, error }
}
