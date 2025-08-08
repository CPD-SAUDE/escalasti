import { useState, useEffect, useCallback } from 'react';
import { Config } from '@/lib/types';

export function useConfig() {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/config`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Config = await response.json();
      setConfig(data);
    } catch (e: any) {
      setError(e.message);
      console.error("Failed to fetch config:", e);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const updateConfig = useCallback(async (newConfig: Partial<Config>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConfig),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchConfig(); // Re-fetch config to ensure state is up-to-date
    } catch (e: any) {
      setError(e.message);
      console.error("Failed to update config:", e);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, fetchConfig]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return { config, loading, error, updateConfig, fetchConfig };
}
