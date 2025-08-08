'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import { Professional } from '@/lib/types'
import { toast } from 'sonner'

export function useProfessionals() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfessionals = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/professionals')
      setProfessionals(response.data)
    } catch (err: any) {
      console.error('Erro ao buscar profissionais:', err)
      setError(err.message || 'Erro ao carregar profissionais.')
      toast.error('Erro ao carregar profissionais.')
    } finally {
      setLoading(false)
    }
  }, [])

  const addProfessional = useCallback(async (newProfessional: Omit<Professional, 'id'>) => {
    try {
      const response = await api.post('/professionals', newProfessional)
      toast.success('Profissional adicionado com sucesso!')
      fetchProfessionals() // Recarrega a lista para incluir o novo profissional
      return response.data
    } catch (err: any) {
      console.error('Erro ao adicionar profissional:', err)
      setError(err.response?.data?.error || err.message || 'Erro ao adicionar profissional.')
      toast.error(err.response?.data?.error || 'Erro ao adicionar profissional.')
      throw err
    }
  }, [fetchProfessionals])

  const updateProfessional = useCallback(async (id: number, updatedProfessional: Partial<Omit<Professional, 'id'>>) => {
    try {
      const response = await api.put(`/professionals/${id}`, updatedProfessional)
      toast.success('Profissional atualizado com sucesso!')
      fetchProfessionals() // Recarrega a lista para refletir as mudanças
      return response.data
    } catch (err: any) {
      console.error('Erro ao atualizar profissional:', err)
      setError(err.response?.data?.error || err.message || 'Erro ao atualizar profissional.')
      toast.error(err.response?.data?.error || 'Erro ao atualizar profissional.')
      throw err
    }
  }, [fetchProfessionals])

  const deleteProfessional = useCallback(async (id: number) => {
    try {
      await api.delete(`/professionals/${id}`)
      toast.success('Profissional deletado com sucesso!')
      setProfessionals(prevProfessionals => prevProfessionals.filter(p => p.id !== id)) // Remove da lista localmente
    } catch (err: any) {
      console.error('Erro ao deletar profissional:', err)
      setError(err.response?.data?.error || err.message || 'Erro ao deletar profissional.')
      toast.error(err.response?.data?.error || 'Erro ao deletar profissional.')
      throw err
    }
  }, [])

  useEffect(() => {
    fetchProfessionals()
  }, [fetchProfessionals])

  return { professionals, loading, error, addProfessional, updateProfessional, deleteProfessional, fetchProfessionals }
}
