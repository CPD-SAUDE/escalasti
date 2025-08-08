'use client'

import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSchedule } from '@/hooks/use-schedule'

interface MonthSelectorProps {
  initialMonth?: number // 1-12
  initialYear?: number
}

export function MonthSelector({ initialMonth, initialYear }: MonthSelectorProps) {
  const { currentMonth, currentYear, setCurrentMonth, setCurrentYear } = useSchedule()

  const months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' },
  ]

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i) // 5 anos para trás e 4 para frente

  useEffect(() => {
    if (initialMonth && initialYear) {
      setCurrentMonth(initialMonth)
      setCurrentYear(initialYear)
    }
  }, [initialMonth, initialYear, setCurrentMonth, setCurrentYear])

  const handleMonthChange = (value: string) => {
    setCurrentMonth(parseInt(value))
  }

  const handleYearChange = (value: string) => {
    setCurrentYear(parseInt(value))
  }

  const goToPreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Select value={currentMonth.toString()} onValueChange={handleMonthChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecione o Mês" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month.value} value={month.value.toString()}>
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={currentYear.toString()} onValueChange={handleYearChange}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Selecione o Ano" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" size="icon" onClick={goToNextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
