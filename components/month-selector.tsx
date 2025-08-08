"use client"

import * as React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from "@/components/ui/button"

interface MonthSelectorProps {
  currentMonth: Date
  setCurrentMonth: (date: Date) => void
}

export function MonthSelector({ currentMonth, setCurrentMonth }: MonthSelectorProps) {
  const handlePreviousMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
      return newDate;
    });
  }

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
      return newDate;
    });
  }

  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium w-32 text-center">
        {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
      </span>
      <Button variant="outline" size="icon" onClick={handleNextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
