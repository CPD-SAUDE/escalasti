'use client'

import { useMemo } from 'react'
import { useSchedule } from '@/hooks/use-schedule'
import { useProfessionals } from '@/hooks/use-professionals'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Loader2 } from 'lucide-react'

export function ScheduleSummary() {
  const { schedule, loading: scheduleLoading } = useSchedule()
  const { professionals, loading: professionalsLoading } = useProfessionals()

  const summary = useMemo(() => {
    const initialSummary: { [key: number]: { totalHours: number; days: number[] } } = {}

    professionals.forEach(p => {
      initialSummary[p.id] = { totalHours: 0, days: [] }
    })

    schedule.forEach(entry => {
      if (entry.professionalId !== null && entry.hours !== null && entry.hours > 0) {
        if (initialSummary[entry.professionalId]) {
          initialSummary[entry.professionalId].totalHours += entry.hours
          initialSummary[entry.professionalId].days.push(entry.day)
        }
      }
    })

    return initialSummary
  }, [schedule, professionals])

  if (scheduleLoading || professionalsLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Calculando resumo...</span>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo da Escala</CardTitle>
      </CardHeader>
      <CardContent>
        {professionals.length === 0 ? (
          <p className="text-center text-muted-foreground">Nenhum profissional cadastrado para gerar o resumo.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profissional</TableHead>
                <TableHead>Total de Horas</TableHead>
                <TableHead>Dias de Sobreaviso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {professionals.map(p => {
                const professionalSummary = summary[p.id]
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{professionalSummary?.totalHours || 0}</TableCell>
                    <TableCell>
                      {professionalSummary?.days.length > 0
                        ? professionalSummary.days.sort((a, b) => a - b).join(', ')
                        : 'Nenhum'}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
