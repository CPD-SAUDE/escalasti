import { useState, useEffect, useCallback } from 'react';
import {
  getAllProfessionals as fetchAllProfessionalsApi,
  addProfessional as addProfessionalApi,
  updateProfessional as updateProfessionalApi,
  deleteProfessional as deleteProfessionalApi,
} from '@/lib/api';
import { Professional } from '@/lib/types';

export function useProfessionals() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfessionals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAllProfessionalsApi();
      setProfessionals(data);
    } catch (err) {
      setError('Failed to fetch professionals.');
      console.error('Error fetching professionals:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addProfessional = useCallback(async (professional: Omit<Professional, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const newProfessional = await addProfessionalApi(professional);
      setProfessionals((prev) => [...prev, newProfessional]);
      return newProfessional;
    } catch (err) {
      setError('Failed to add professional.');
      console.error('Error adding professional:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfessional = useCallback(async (id: number, professional: Omit<Professional, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedProfessional = await updateProfessionalApi(id, professional);
      setProfessionals((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updatedProfessional } : p))
      );
      return updatedProfessional;
    } catch (err) {
      setError('Failed to update professional.');
      console.error('Error updating professional:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteProfessional = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteProfessionalApi(id);
      setProfessionals((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError('Failed to delete professional.');
      console.error('Error deleting professional:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfessionals();
  }, [fetchProfessionals]);

  return { professionals, isLoading, error, fetchProfessionals, addProfessional, updateProfessional, deleteProfessional };
}
