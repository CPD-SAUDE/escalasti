'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Config } from '@/lib/types'

export function useConfig() {
  const [config, setConfig] = useState<Config>({
    id: 1,
    companyName: '',
    departmentName: '',
    systemName: '',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConfig = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/config')
      setConfig(response.data)
    } catch (err: any) {
      console.error('Erro ao buscar configuração:', err)
      setError(err.message || 'Erro ao carregar configuração.')
      toast.error('Erro ao carregar configuração.')
    } finally {
      setLoading(false)
    }
  }, [])

  const updateConfig = useCallback(async (newConfig: Partial<Config>) => {
    try {
      const response = await api.put('/config', newConfig)
      setConfig(prev => ({ ...prev, ...newConfig }))
      toast.success('Configuração atualizada com sucesso!')
      return response.data
    } catch (err: any) {
      console.error('Erro ao atualizar configuração:', err)
      setError(err.message || 'Erro ao atualizar configuração.')
      toast.error('Erro ao atualizar configuração.')
      throw err
    }
  }, [])

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

  return { config, loading, error, updateConfig, fetchConfig }
}
