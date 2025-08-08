'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Professional, ScheduleEntry } from '@/lib/types'
import { format, isSameDay, parseISO, getDaysInMonth, startOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ScheduleSummaryProps {
  currentMonth: Date
  schedule: ScheduleEntry[]
  professionals: Professional[]
}

export default function ScheduleSummary({ currentMonth, schedule, professionals }: ScheduleSummaryProps) {
  const daysInMonth = getDaysInMonth(currentMonth)
  const startOfMonthDate = startOfMonth(currentMonth)

  const professionalCounts: { [key: string]: number } = {}
  professionals.forEach(p => (professionalCounts[p.id] = 0))

  const dailySchedule: { date: Date; professional?: Professional }[] = []

  for (let i = 1; i <= daysInMonth; i++) {
    const day = new Date(startOfMonthDate.getFullYear(), startOfMonthDate.getMonth(), i)
    const entry = schedule.find(s => isSameDay(parseISO(s.date), day))
    const professional = entry ? professionals.find(p => p.id === entry.professionalId) : undefined

    dailySchedule.push({ date: day, professional })

    if (professional) {
      professionalCounts[professional.id] = (professionalCounts[professional.id] || 0) + 1
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo da Escala ({format(currentMonth, 'MMMM yyyy', { locale: ptBR })})</CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold mb-2">Contagem por Profissional</h3>
        <div className="space-y-2 mb-4">
          {professionals.length === 0 ? (
            <p className="text-muted-foreground">Nenhum profissional cadastrado.</p>
          ) : (
            professionals.map(p => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: p.color }} />
                  <span>{p.name}</span>
                </div>
                <span className="font-medium">{professionalCounts[p.id] || 0} dias</span>
              </div>
            ))
          )}
        </div>

        <h3 className="text-lg font-semibold mb-2">Escala Diária</h3>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {dailySchedule.map((dayEntry, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  {format(dayEntry.date, 'dd/MM (EEE)', { locale: ptBR })}:
                </span>
                {dayEntry.professional ? (
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: dayEntry.professional.color }}
                    />
                    <span>{dayEntry.professional.name}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Livre</span>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
