import { useState, useEffect, useCallback } from 'react';
import { Professional } from '@/lib/types';

export function useProfessionals() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  const fetchProfessionals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/professionals`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Professional[] = await response.json();
      setProfessionals(data);
    } catch (e: any) {
      setError(e.message);
      console.error("Failed to fetch professionals:", e);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const addProfessional = useCallback(async (name: string, color: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/professionals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, color }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json(); // Get the new professional with ID
      await fetchProfessionals(); // Re-fetch professionals to ensure state is up-to-date
    } catch (e: any) {
      setError(e.message);
      console.error("Failed to add professional:", e);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, fetchProfessionals]);

  const updateProfessional = useCallback(async (id: string, name: string, color: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/professionals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, color }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
      await fetchProfessionals(); // Re-fetch professionals to ensure state is up-to-date
    } catch (e: any) {
      setError(e.message);
      console.error("Failed to update professional:", e);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, fetchProfessionals]);

  const deleteProfessional = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/professionals/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
      await fetchProfessionals(); // Re-fetch professionals to ensure state is up-to-date
    } catch (e: any) {
      setError(e.message);
      console.error("Failed to delete professional:", e);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, fetchProfessionals]);

  useEffect(() => {
    fetchProfessionals();
  }, [fetchProfessionals]);

  return { professionals, loading, error, addProfessional, updateProfessional, deleteProfessional, fetchProfessionals };
}
