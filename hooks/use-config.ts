import { useState, useEffect, useCallback } from 'react'
import { Config } from '@/lib/types'

export function useConfig() {
  const [config, setConfig] = useState<Config | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

  const fetchConfig = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/config`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setConfig(data)
    } catch (e) {
      setError(e as Error)
      console.error("Failed to fetch config:", e)
    } finally {
      setLoading(false)
    }
  }, [API_URL])

  const updateConfig = useCallback(async (newConfig: Config) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConfig),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setConfig(newConfig) // Update local state immediately
      return data
    } catch (e) {
      setError(e as Error)
      console.error("Failed to update config:", e)
      throw e; // Re-throw to allow caller to handle
    } finally {
      setLoading(false)
    }
  }, [API_URL])

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

  return { config, fetchConfig, updateConfig, loading, error }
}
