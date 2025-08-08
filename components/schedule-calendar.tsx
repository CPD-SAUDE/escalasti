'use client'

import { useState, useEffect } from 'react'
import { format, getDaysInMonth, startOfMonth, getDay, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ScheduleEntry, Professional } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface ScheduleCalendarProps {
  schedule: ScheduleEntry[]
  professionals: Professional[]
  updateScheduleEntry: (year: number, month: number, day: number, professionalId: number | null, hours: number | null, notes: string) => Promise<void>
  currentMonth: Date
}

export function ScheduleCalendar({ schedule, professionals, updateScheduleEntry, currentMonth }: ScheduleCalendarProps) {
  const [selectedDay, setSelectedDay] = useState<ScheduleEntry | null>(null)
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<number | null>(null)
  const [hours, setHours] = useState<number | null>(null)
  const [notes, setNotes] = useState<string>('')

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth() + 1 // Mês é 0-indexado no JS Date

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDayOfMonth = startOfMonth(currentMonth)
  const startingDayOfWeek = getDay(firstDayOfMonth) // 0 for Sunday, 6 for Saturday

  useEffect(() => {
    if (selectedDay) {
      setSelectedProfessionalId(selectedDay.professionalId)
      setHours(selectedDay.hours)
      setNotes(selectedDay.notes)
    }
  }, [selectedDay])

  const handleDayClick = (dayEntry: ScheduleEntry) => {
    setSelectedDay(dayEntry)
  }

  const handleSave = async () => {
    if (selectedDay) {
      await updateScheduleEntry(
        year,
        month,
        selectedDay.day,
        selectedProfessionalId,
        hours,
        notes
      )
      setSelectedDay(null) // Fecha o dialog
    }
  }

  const getProfessionalColor = (professionalId: number | null) => {
    const professional = professionals.find(p => p.id === professionalId)
    return professional ? professional.color : '#cccccc' // Cor padrão para não atribuído
  }

  const getProfessionalName = (professionalId: number | null) => {
    const professional = professionals.find(p => p.id === professionalId)
    return professional ? professional.name : 'N/A'
  }

  const getProfessionalDefaultHours = (professionalId: number | null) => {
    const professional = professionals.find(p => p.id === professionalId)
    return professional ? professional.defaultHours : 0
  }

  const handleProfessionalChange = (value: string) => {
    const id = value === 'null' ? null : parseInt(value)
    setSelectedProfessionalId(id)
    if (id !== null) {
      setHours(getProfessionalDefaultHours(id))
    } else {
      setHours(null)
    }
  }

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  return (
    <div className="p-4">
      <div className="grid grid-cols-7 gap-1 text-center font-bold text-sm mb-2">
        {dayNames.map(day => (
          <div key={day} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-sm">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startingDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} className="p-2 min-h-[100px] border rounded-sm bg-gray-50 dark:bg-gray-800"></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const dayNumber = index + 1
          const dayEntry = schedule.find(entry => entry.day === dayNumber) || {
            day: dayNumber,
            professionalId: null,
            hours: null,
            notes: ''
          }
          const professional = professionals.find(p => p.id === dayEntry.professionalId)

          return (
            <Dialog key={dayNumber}>
              <DialogTrigger asChild>
                <div
                  className="day-cell p-2 border rounded-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex flex-col justify-between min-h-[100px]"
                  onClick={() => handleDayClick(dayEntry)}
                >
                  <div className="font-bold text-lg">{dayNumber}</div>
                  {professional && (
                    <div className="mt-auto text-sm" style={{ color: professional.color }}>
                      <div className="professional-name font-semibold">{professional.name}</div>
                      {dayEntry.hours && <div className="professional-hours text-xs">{dayEntry.hours}h</div>}
                      {dayEntry.notes && <div className="professional-notes text-xs text-gray-600 dark:text-gray-400">{dayEntry.notes}</div>}
                    </div>
                  )}
                </div>
              </DialogTrigger>
              {selectedDay && selectedDay.day === dayNumber && (
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Escala para {dayNumber} de {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}</DialogTitle>
                    <DialogDescription>
                      Atribua um profissional, horas e observações para este dia.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="professional" className="text-right">
                        Profissional
                      </Label>
                      <Select
                        value={selectedProfessionalId !== null ? String(selectedProfessionalId) : 'null'}
                        onValueChange={handleProfessionalChange}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecione um profissional" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="null">Nenhum</SelectItem>
                          {professionals.map(p => (
                            <SelectItem key={p.id} value={String(p.id)}>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: p.color }} />
                                {p.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="hours" className="text-right">
                        Horas
                      </Label>
                      <Input
                        id="hours"
                        type="number"
                        value={hours !== null ? hours : ''}
                        onChange={(e) => setHours(e.target.value ? parseInt(e.target.value) : null)}
                        className="col-span-3"
                        min="0"
                        disabled={selectedProfessionalId === null}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="notes" className="text-right">
                        Observações
                      </Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="col-span-3"
                        placeholder="Adicione observações (ex: folga, férias)"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setSelectedDay(null)}>Cancelar</Button>
                    <Button onClick={handleSave}>Salvar</Button>
                  </DialogFooter>
                </DialogContent>
              )}
            </Dialog>
          )
        })}
      </div>
    </div>
  )
}
