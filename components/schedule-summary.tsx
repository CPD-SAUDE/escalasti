'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Professional, ScheduleEntry } from '@/lib/types'
import { format, isSameDay, getDaysInMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ScheduleSummaryProps {
  currentMonth: Date;
  professionals: Professional[];
  schedule: ScheduleEntry[];
}

export function ScheduleSummary({ currentMonth, professionals, schedule }: ScheduleSummaryProps) {
  const daysInMonthCount = getDaysInMonth(currentMonth)
  const summary: { [key: string]: number } = {}

  professionals.forEach(p => {
    summary[p.id] = 0
  })

  // Contar dias atribuídos a cada profissional
  schedule.forEach(entry => {
    if (entry.professionalId && summary.hasOwnProperty(entry.professionalId)) {
      summary[entry.professionalId]++
    }
  })

  // Contar dias não atribuídos
  const assignedDaysCount = Object.values(summary).reduce((acc, count) => acc + count, 0)
  const unassignedDaysCount = daysInMonthCount - assignedDaysCount

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Resumo da Escala de {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Dias Atribuídos por Profissional:</h4>
            {professionals.length === 0 ? (
              <p className="text-muted-foreground">Nenhum profissional cadastrado.</p>
            ) : (
              <ul className="space-y-1">
                {professionals.map(p => (
                  <li key={p.id} className="flex items-center">
                    <div className="h-4 w-4 rounded-full mr-2 border" style={{ backgroundColor: p.color }} />
                    {p.name}: <span className="font-medium ml-1">{summary[p.id] || 0} dias</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h4 className="font-semibold mb-2">Status Geral:</h4>
            <p>Total de dias no mês: <span className="font-medium">{daysInMonthCount}</span></p>
            <p>Dias atribuídos: <span className="font-medium">{assignedDaysCount}</span></p>
            <p>Dias não atribuídos: <span className="font-medium">{unassignedDaysCount}</span></p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
