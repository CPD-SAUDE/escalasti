"use client";

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { SystemConfig } from '@/lib/types';

export function useConfig() {
  const [config, setConfig] = useState<SystemConfig>({
    department_name: 'DEPARTAMENTO - TI',
    company_name: 'Departamento de TI da Saúde',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getConfig();
      setConfig(data as SystemConfig);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar configurações');
      console.error('Erro ao buscar configurações:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (key: keyof SystemConfig, value: string) => {
    try {
      await apiClient.updateConfig(key, value);
      setConfig(prev => ({ ...prev, [key]: value }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar configuração';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return {
    config,
    loading,
    error,
    updateConfig,
    refetch: fetchConfig,
  };
}
