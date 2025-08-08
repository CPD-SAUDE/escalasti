'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import { ScheduleEntry } from '@/lib/types'
import { toast } from 'sonner'

export function useSchedule() {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1) // 1-12
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSchedule = useCallback(async (year: number, month: number) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get(`/schedule/${year}/${month}`)
      // Certifica-se de que cada dia tem um objeto completo, mesmo que vazio
      const daysInMonth = new Date(year, month, 0).getDate()
      const initialSchedule: ScheduleEntry[] = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1
        const existingEntry = response.data.find((entry: ScheduleEntry) => entry.day === day)
        return existingEntry || { day, professionalId: null, hours: null, notes: '' }
      })
      setSchedule(initialSchedule)
    } catch (err: any) {
      console.error('Erro ao buscar escala:', err)
      setError(err.message || 'Erro ao carregar escala.')
      toast.error('Erro ao carregar escala.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSchedule(currentYear, currentMonth)
  }, [currentYear, currentMonth, fetchSchedule])

  return {
    schedule,
    setSchedule,
    currentMonth,
    setCurrentMonth,
    currentYear,
    setCurrentYear,
    loading,
    error,
    fetchSchedule,
  }
}
