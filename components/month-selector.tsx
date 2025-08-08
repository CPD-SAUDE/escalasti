'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addMonths, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface MonthSelectorProps {
  currentMonth: Date;
  onMonthChange: (newMonth: Date) => void;
}

export function MonthSelector({ currentMonth, onMonthChange }: MonthSelectorProps) {
  const handlePreviousMonth = () => {
    onMonthChange(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    onMonthChange(addMonths(currentMonth, 1))
  }

  return (
    <div className="flex items-center justify-between mb-4">
      <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <h2 className="text-xl font-semibold">
        {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
      </h2>
      <Button variant="outline" size="icon" onClick={handleNextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
