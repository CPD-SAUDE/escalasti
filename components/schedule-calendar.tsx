'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { addOrUpdateScheduleEntry, getAllProfessionals, getScheduleByMonth } from '@/lib/api'
import { Professional, ScheduleEntry } from '@/lib/types'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWeekend, isToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Check, PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ScheduleCalendarProps {
  selectedMonth: Date
}

export function ScheduleCalendar({ selectedMonth }: ScheduleCalendarProps) {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const year = selectedMonth.getFullYear()
  const month = selectedMonth.getMonth() + 1 // Mês é 1-indexed para a API

  const fetchScheduleAndProfessionals = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [scheduleData, professionalsData] = await Promise.all([
        getScheduleByMonth(year, month),
        getAllProfessionals(),
      ])
      setSchedule(scheduleData)
      setProfessionals(professionalsData)
    } catch (err) {
      setError('Erro ao carregar dados da escala ou profissionais.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchScheduleAndProfessionals()
  }, [selectedMonth]) // Recarrega quando o mês selecionado muda

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(selectedMonth),
    end: endOfMonth(selectedMonth),
  })

  const getProfessionalForDay = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd')
    const entry = schedule.find((s) => s.date === formattedDate)
    return professionals.find((p) => p.id === entry?.professionalId)
  }

  const handleAssignProfessional = async (date: Date, professionalId: number | null) => {
    setIsLoading(true)
    setError(null)
    try {
      const formattedDate = format(date, 'yyyy-MM-dd')
      await addOrUpdateScheduleEntry({ date: formattedDate, professionalId })
      await fetchScheduleAndProfessionals() // Recarrega os dados após a atualização
    } catch (err) {
      setError('Erro ao atribuir profissional.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Calcula o offset para o primeiro dia do mês (para alinhar com a semana)
  const firstDayOfMonth = startOfMonth(selectedMonth)
  const startingDayIndex = (firstDayOfMonth.getDay() + 6) % 7 // Ajusta para segunda-feira como primeiro dia (0=Seg, 6=Dom)

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Escala de Sobreaviso</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <p>Carregando escala...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!isLoading && !error && (
          <div className="grid grid-cols-7 gap-2 text-center font-semibold text-gray-700 dark:text-gray-300">
            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
            {Array.from({ length: startingDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="py-4" />
            ))}
            {daysInMonth.map((date) => {
              const professional = getProfessionalForDay(date)
              const isWeekendDay = isWeekend(date)
              const isCurrentDay = isToday(date)

              return (
                <Popover key={date.toISOString()}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'flex flex-col h-24 w-full p-1 text-center relative',
                        isWeekendDay && 'bg-gray-50 dark:bg-gray-800 text-gray-500',
                        isCurrentDay && 'border-2 border-primary ring-2 ring-primary/50',
                        professional && 'border-2'
                      )}
                      style={professional ? { borderColor: professional.color, borderWidth: '2px' } : {}}
                    >
                      <span className="text-xs font-bold absolute top-1 right-1">
                        {format(date, 'd')}
                      </span>
                      <div className="flex-1 flex items-center justify-center text-sm font-medium">
                        {professional ? (
                          <span
                            className="text-center px-1 py-0.5 rounded-md text-white text-xs"
                            style={{ backgroundColor: professional.color }}
                          >
                            {professional.name}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">Vazio</span>
                        )}
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Buscar profissional..." />
                      <CommandEmpty>Nenhum profissional encontrado.</CommandEmpty>
                      <CommandGroup>
                        {professionals.map((p) => (
                          <CommandItem
                            key={p.id}
                            onSelect={() => handleAssignProfessional(date, p.id)}
                            className="flex items-center cursor-pointer"
                          >
                            <div
                              className="w-3 h-3 rounded-full mr-2 border"
                              style={{ backgroundColor: p.color }}
                            />
                            {p.name}
                            <Check
                              className={cn(
                                'ml-auto h-4 w-4',
                                professional?.id === p.id ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                          </CommandItem>
                        ))}
                        {professional && ( // Opção para remover profissional se já houver um
                          <CommandItem
                            onSelect={() => handleAssignProfessional(date, null)}
                            className="flex items-center cursor-pointer text-red-500"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Remover Profissional
                          </CommandItem>
                        )}
                        {professionals.length === 0 && (
                          <CommandItem disabled>
                            Nenhum profissional cadastrado. Adicione um na aba "Gerenciar Profissionais".
                          </CommandItem>
                        )}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
