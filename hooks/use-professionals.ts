import { useState, useEffect, useCallback } from 'react';
import { getAllProfessionals, addProfessional, updateProfessional, deleteProfessional } from '@/lib/api';
import { Professional } from '@/lib/types';

export function useProfessionals() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfessionals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllProfessionals();
      setProfessionals(data);
    } catch (err) {
      setError('Erro ao carregar profissionais.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfessionals();
  }, [fetchProfessionals]);

  const addProf = useCallback(async (professional: Omit<Professional, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      await addProfessional(professional);
      await fetchProfessionals(); // Recarrega a lista após adicionar
    } catch (err) {
      setError('Erro ao adicionar profissional.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchProfessionals]);

  const updateProf = useCallback(async (id: number, professional: Omit<Professional, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      await updateProfessional(id, professional);
      await fetchProfessionals(); // Recarrega a lista após atualizar
    } catch (err) {
      setError('Erro ao atualizar profissional.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchProfessionals]);

  const deleteProf = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteProfessional(id);
      await fetchProfessionals(); // Recarrega a lista após deletar
    } catch (err) {
      setError('Erro ao remover profissional.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchProfessionals]);

  return { professionals, isLoading, error, addProf, updateProf, deleteProf, fetchProfessionals };
}
