'use client'

import { Calendar } from '@/components/ui/calendar'
import { Professional, ScheduleEntry } from '@/lib/types'
import { format, isSameDay, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface ScheduleCalendarProps {
  currentMonth: Date
  schedule: ScheduleEntry[]
  professionals: Professional[]
  addOrUpdateScheduleEntry: (date: string, professionalId: string | null) => Promise<void>
  deleteScheduleEntry: (date: string) => Promise<void>
  isLoading: boolean
}

export default function ScheduleCalendar({
  currentMonth,
  schedule,
  professionals,
  addOrUpdateScheduleEntry,
  deleteScheduleEntry,
  isLoading,
}: ScheduleCalendarProps) {
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null)

  const getDayContent = (day: Date) => {
    const entry = schedule.find(s => isSameDay(parseISO(s.date), day))
    const professional = entry ? professionals.find(p => p.id === entry.professionalId) : null

    return (
      <div className="relative h-full w-full flex flex-col items-center justify-center text-center">
        <span className="text-sm font-semibold">{format(day, 'd')}</span>
        {professional && (
          <div
            className="absolute bottom-0 left-0 right-0 text-xs truncate px-1 py-0.5 rounded-b-md"
            style={{ backgroundColor: professional.color, color: 'white' }}
          >
            {professional.name}
          </div>
        )}
      </div>
    )
  }

  const handleDayClick = async (day: Date) => {
    const formattedDate = format(day, 'yyyy-MM-dd')
    const existingEntry = schedule.find(s => isSameDay(parseISO(s.date), day))

    if (selectedProfessionalId) {
      // Se um profissional foi selecionado, atribui ou atualiza
      await addOrUpdateScheduleEntry(formattedDate, selectedProfessionalId)
    } else if (existingEntry) {
      // Se nenhum profissional foi selecionado, mas há uma entrada existente, remove
      await addOrUpdateScheduleEntry(formattedDate, null) // Define como null para remover o profissional do dia
    }
    // Se nenhum profissional selecionado e nenhuma entrada existente, não faz nada
  }

  const getDayStyle = (day: Date) => {
    const entry = schedule.find(s => isSameDay(parseISO(s.date), day))
    const professional = entry ? professionals.find(p => p.id === entry.professionalId) : null

    if (professional) {
      return {
        '--color-professional': professional.color,
        backgroundColor: professional.color,
        color: 'white',
      } as React.CSSProperties
    }
    return {}
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 flex items-center justify-center z-10 rounded-lg">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      )}
      <div className="mb-4 flex items-center gap-2">
        <Select onValueChange={setSelectedProfessionalId} value={selectedProfessionalId || ''}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Atribuir Profissional" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Remover Atribuição</SelectItem>
            {professionals.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: p.color }} />
                  {p.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          Clique em um dia para atribuir/remover.
        </span>
      </div>
      <Calendar
        mode="single"
        month={currentMonth}
        selected={[]} // Não selecione nenhum dia por padrão, o estilo é via modifiers
        onDayClick={handleDayClick}
        locale={ptBR}
        className="rounded-md border w-full"
        classNames={{
          day: 'h-16 w-full text-center text-sm p-0 relative', // Ajuste a altura e largura do dia
          cell: 'h-16 w-full', // Garante que a célula tenha a mesma dimensão
          day_today: 'bg-accent text-accent-foreground',
          day_selected: 'bg-[--color-professional] text-primary-foreground hover:bg-[--color-professional] hover:opacity-90 focus:bg-[--color-professional]',
          day_outside: 'text-muted-foreground opacity-50',
          day_hidden: 'invisible',
        }}
        modifiers={{
          scheduled: schedule.map(s => parseISO(s.date)),
        }}
        modifiersStyles={{
          scheduled: (day) => getDayStyle(day),
        }}
        components={{
          DayContent: ({ date }) => getDayContent(date),
        }}
      />
    </div>
  )
}
