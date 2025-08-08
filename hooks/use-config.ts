import { useState, useEffect, useCallback } from 'react';
import { getConfig as fetchConfigApi, updateConfig as updateConfigApi } from '@/lib/api';
import { Config } from '@/lib/types';

export function useConfig() {
  const [config, setConfig] = useState<Config | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchConfigApi();
      setConfig(data);
    } catch (err) {
      setError('Failed to fetch configuration.');
      console.error('Error fetching config:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateConfig = useCallback(async (newConfig: Partial<Config>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedData = await updateConfigApi(newConfig);
      setConfig(updatedData);
      return updatedData;
    } catch (err) {
      setError('Failed to update configuration.');
      console.error('Error updating config:', err);
      throw err; // Re-throw to allow caller to handle
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return { config, isLoading, error, fetchConfig, updateConfig };
}
