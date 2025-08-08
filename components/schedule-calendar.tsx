'use client'

import { useState } from 'react'
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  startOfMonth,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Professional, ScheduleData } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'

interface ScheduleCalendarProps {
  year: number
  month: number
  schedule: ScheduleData
  professionals: Professional[]
  updateSchedule: (
    year: number,
    month: number,
    data: ScheduleData,
  ) => Promise<void>
}

export default function ScheduleCalendar({
  year,
  month,
  schedule,
  professionals,
  updateSchedule,
}: ScheduleCalendarProps) {
  const firstDayOfMonth = startOfMonth(new Date(year, month - 1))
  const lastDayOfMonth = endOfMonth(new Date(year, month - 1))
  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  })

  const startingDayIndex = getDay(firstDayOfMonth) // 0 for Sunday, 1 for Monday...

  const [currentSchedule, setCurrentSchedule] =
    useState<ScheduleData>(schedule)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)

  // Update internal state when external schedule prop changes
  // This is important if the schedule is fetched asynchronously
  useState(() => {
    setCurrentSchedule(schedule)
  }, [schedule])

  const handleProfessionalChange = (day: number, professionalId: string) => {
    setCurrentSchedule((prev) => ({
      ...prev,
      [day]: professionalId === 'none' ? null : parseInt(professionalId),
    }))
    setSaveSuccess(null) // Clear success message on change
  }

  const handleSaveSchedule = async () => {
    setIsSaving(true)
    setSaveError(null)
    setSaveSuccess(null)
    try {
      await updateSchedule(year, month, currentSchedule)
      setSaveSuccess('Escala salva com sucesso!')
    } catch (err: any) {
      setSaveError(err.message || 'Erro ao salvar a escala.')
    } finally {
      setIsSaving(false)
    }
  }

  const getProfessionalForDay = (day: number) => {
    const professionalId = currentSchedule[day]
    return professionals.find((p) => p.id === professionalId)
  }

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Escala Mensal</CardTitle>
        <Button onClick={handleSaveSchedule} disabled={isSaving}>
          {isSaving ? 'Salvando...' : 'Salvar Escala'}
        </Button>
      </CardHeader>
      <CardContent>
        {saveError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Erro ao Salvar</AlertTitle>
            <AlertDescription>{saveError}</AlertDescription>
          </Alert>
        )}
        {saveSuccess && (
          <Alert className="mb-4 border-green-500 text-green-700 dark:border-green-400 dark:text-green-300">
            <AlertTitle>Sucesso</AlertTitle>
            <AlertDescription>{saveSuccess}</AlertDescription>
          </Alert>
        )}
        <div className="grid grid-cols-7 gap-2 text-center font-semibold">
          {weekDays.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-2">
          {Array.from({ length: startingDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-24 rounded-md bg-gray-100 dark:bg-gray-800" />
          ))}
          {daysInMonth.map((day, index) => {
            const dayNumber = parseInt(format(day, 'd'))
            const professional = getProfessionalForDay(dayNumber)

            return (
              <div
                key={index}
                className={cn(
                  'flex flex-col rounded-md border p-2 shadow-sm',
                  isSameDay(day, new Date()) && 'border-blue-500 ring-2 ring-blue-500',
                )}
              >
                <div className="text-lg font-bold">{dayNumber}</div>
                <Select
                  value={professional ? String(professional.id) : 'none'}
                  onValueChange={(value) =>
                    handleProfessionalChange(dayNumber, value)
                  }
                >
                  <SelectTrigger
                    className="mt-1 h-auto min-h-[36px] text-xs"
                    style={{
                      backgroundColor: professional?.color || 'transparent',
                      color: professional ? '#FFF' : 'inherit',
                    }}
                  >
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    {professionals.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
