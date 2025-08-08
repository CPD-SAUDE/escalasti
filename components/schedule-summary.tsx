'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getAllProfessionals, getScheduleByMonth } from '@/lib/api'
import { Professional, ScheduleEntry } from '@/lib/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ScheduleSummaryProps {
  selectedMonth: Date
}

export function ScheduleSummary({ selectedMonth }: ScheduleSummaryProps) {
  const [summary, setSummary] = useState<Record<number, { professional: Professional; days: string[] }>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const year = selectedMonth.getFullYear()
  const month = selectedMonth.getMonth() + 1 // Mês é 1-indexed para a API

  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const [scheduleData, professionalsData] = await Promise.all([
          getScheduleByMonth(year, month),
          getAllProfessionals(),
        ])

        const newSummary: Record<number, { professional: Professional; days: string[] }> = {}

        // Inicializa o resumo com todos os profissionais
        professionalsData.forEach(p => {
          newSummary[p.id] = { professional: p, days: [] }
        })

        // Preenche os dias para cada profissional
        scheduleData.forEach(entry => {
          if (entry.professionalId !== null) {
            const professional = professionalsData.find(p => p.id === entry.professionalId)
            if (professional) {
              const day = format(new Date(entry.date), 'dd', { locale: ptBR })
              if (newSummary[professional.id]) {
                newSummary[professional.id].days.push(day)
              } else {
                // Caso um profissional na escala não esteja na lista de profissionais (ex: foi deletado)
                newSummary[professional.id] = { professional: professional, days: [day] }
              }
            }
          }
        })

        setSummary(newSummary)
      } catch (err) {
        setError('Erro ao carregar resumo da escala.')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSummary()
  }, [selectedMonth])

  const sortedProfessionals = Object.values(summary).sort((a, b) => a.professional.name.localeCompare(b.professional.name));

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Resumo da Escala ({format(selectedMonth, 'MM/yyyy')})</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <p>Carregando resumo...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!isLoading && !error && (
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <div className="space-y-4">
              {sortedProfessionals.length === 0 && <p className="text-center text-muted-foreground">Nenhum profissional ou escala encontrada para este mês.</p>}
              {sortedProfessionals.map(({ professional, days }) => (
                <div key={professional.id} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: professional.color }}
                    />
                    <span className="font-medium">{professional.name}</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {days.length > 0 ? days.sort((a, b) => parseInt(a) - parseInt(b)).join(', ') : 'Nenhum dia'}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
