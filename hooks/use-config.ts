import { useState, useEffect, useCallback } from 'react'
import { getConfig, updateConfig as apiUpdateConfig } from '@/lib/api'
import { Config } from '@/lib/types'

export function useConfig() {
  const [config, setConfig] = useState<Config>({ backendIp: null })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConfig = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getConfig()
      setConfig(data)
    } catch (err) {
      console.error("Failed to fetch config:", err)
      setError("Falha ao carregar configurações.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

  const updateConfig = useCallback(async (newConfig: Partial<Config>) => {
    setIsLoading(true)
    setError(null)
    try {
      const updated = await apiUpdateConfig({ ...config, ...newConfig })
      setConfig(updated)
      // Re-fetch para garantir que o estado local está sincronizado com o DB
      await fetchConfig()
    } catch (err) {
      console.error("Failed to update config:", err)
      setError("Falha ao atualizar configurações.")
    } finally {
      setIsLoading(false)
    }
  }, [config, fetchConfig])

  return { config, isLoading, error, updateConfig, refetchConfig: fetchConfig }
}
