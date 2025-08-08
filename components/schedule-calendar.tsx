'use client'

import { Calendar } from '@/components/ui/calendar'
import { Professional, ScheduleEntry } from '@/lib/types'
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ScheduleCalendarProps {
  currentMonth: Date;
  professionals: Professional[];
  schedule: ScheduleEntry[];
  onSelectDay: (date: string, professionalId: string | null) => Promise<void>;
}

export function ScheduleCalendar({ currentMonth, professionals, schedule, onSelectDay }: ScheduleCalendarProps) {
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [dayToAssign, setDayToAssign] = useState<Date | undefined>(undefined)

  const getDayContent = (day: Date) => {
    const entry = schedule.find(s => isSameDay(new Date(s.date), day))
    const professional = entry ? professionals.find(p => p.id === entry.professionalId) : null

    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center text-center">
        <span className="text-sm font-medium">{format(day, 'd')}</span>
        {professional && (
          <div
            className="absolute bottom-0 left-0 right-0 text-xs truncate px-1 py-0.5 rounded-b-md"
            style={{ backgroundColor: professional.color, color: getContrastColor(professional.color) }}
            title={professional.name}
          >
            {professional.name}
          </div>
        )}
      </div>
    )
  }

  const getContrastColor = (hexcolor: string) => {
    // If a professional is not assigned, the color is null, return black
    if (!hexcolor) return '#000000';

    // Remove '#' if it exists
    const r = parseInt(hexcolor.substring(1, 3), 16);
    const g = parseInt(hexcolor.substring(3, 5), 16);
    const b = parseInt(hexcolor.substring(5, 7), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return black for bright colors, white for dark colors
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  const handleDayClick = (day: Date) => {
    setDayToAssign(day)
    setIsPopoverOpen(true)
    const existingEntry = schedule.find(s => isSameDay(new Date(s.date), day))
    setSelectedProfessionalId(existingEntry?.professionalId || null)
  }

  const handleAssign = async () => {
    if (dayToAssign) {
      await onSelectDay(format(dayToAssign, 'yyyy-MM-dd'), selectedProfessionalId)
      setIsPopoverOpen(false)
      setDayToAssign(undefined)
      setSelectedProfessionalId(null)
    }
  }

  const handleRemoveAssignment = async () => {
    if (dayToAssign) {
      await onSelectDay(format(dayToAssign, 'yyyy-MM-dd'), null)
      setIsPopoverOpen(false)
      setDayToAssign(undefined)
      setSelectedProfessionalId(null)
    }
  }

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  return (
    <div className="relative">
      <Calendar
        mode="single"
        month={currentMonth}
        selected={dayToAssign}
        onSelect={handleDayClick}
        locale={ptBR}
        className="rounded-md border"
        components={{
          DayContent: ({ date }) => getDayContent(date),
        }}
        classNames={{
          day: "relative text-center text-sm p-0 focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected])]:text-accent-foreground [&:has([aria-selected])]:rounded-md",
          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside: "text-muted-foreground opacity-50",
          day_hidden: "invisible",
          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_range_end: "aria-selected:rounded-r-md",
          day_range_start: "aria-selected:rounded-l-md",
        }}
      />

      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          {/* Hidden trigger, popover is controlled by state */}
          <Button variant="ghost" className="sr-only" />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4">
          <h4 className="font-semibold mb-2">Atribuir profissional para {dayToAssign ? format(dayToAssign, 'PPP', { locale: ptBR }) : ''}</h4>
          <Select
            onValueChange={(value) => setSelectedProfessionalId(value === 'null' ? null : value)}
            value={selectedProfessionalId || 'null'}
          >
            <SelectTrigger className="w-[200px] mb-2">
              <SelectValue placeholder="Selecione um profissional" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="null">Nenhum (Remover)</SelectItem>
              {professionals.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  <div className="flex items-center">
                    <div className="h-4 w-4 rounded-full mr-2 border" style={{ backgroundColor: p.color }} />
                    {p.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button onClick={handleAssign} className="flex-grow">Atribuir</Button>
            {selectedProfessionalId && (
              <Button variant="outline" onClick={handleRemoveAssignment} className="flex-grow">Remover</Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
