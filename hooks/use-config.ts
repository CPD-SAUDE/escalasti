import { useState, useEffect, useCallback } from 'react';
import { getConfig, updateConfig } from '@/lib/api';
import { Config } from '@/lib/types';

export function useConfig() {
  const [config, setConfig] = useState<Config | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getConfig();
      setConfig(data);
    } catch (err) {
      setError('Erro ao carregar configurações.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const saveConfig = useCallback(async (newConfig: Partial<Config>) => {
    setIsLoading(true);
    setError(null);
    try {
      await updateConfig(newConfig);
      await fetchConfig(); // Recarrega a configuração após salvar
    } catch (err) {
      setError('Erro ao salvar configurações.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchConfig]);

  return { config, isLoading, error, saveConfig, fetchConfig };
}
