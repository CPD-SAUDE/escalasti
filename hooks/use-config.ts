import { useState, useEffect, useCallback } from 'react'
import { fetchConfig, updateConfig as apiUpdateConfig } from '@/lib/api'
import { Config } from '@/lib/types'

export function useConfig() {
  const [config, setConfig] = useState<Config | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadConfig = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchConfig()
      setConfig(data)
    } catch (err: any) {
      setError(err)
      console.error('Failed to fetch config:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadConfig()
  }, [loadConfig])

  const updateConfig = useCallback(
    async (newConfig: Partial<Config>) => {
      setError(null)
      try {
        const updated = await apiUpdateConfig(newConfig)
        setConfig(updated)
        return updated
      } catch (err: any) {
        setError(err)
        console.error('Failed to update config:', err)
        throw err
      }
    },
    [],
  )

  return { config, isLoading, error, updateConfig, refetch: loadConfig }
}
