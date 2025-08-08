'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Professional, ScheduleEntry } from '@/lib/types'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import { useHistory } from '@/hooks/use-history'
import { useConfig } from '@/hooks/use-config'
import { useToast } from '@/hooks/use-toast'

interface ScheduleSummaryProps {
  schedule: ScheduleEntry[]
  professionals: Professional[]
  className?: string
}

export function ScheduleSummary({ schedule, professionals, className }: ScheduleSummaryProps) {
  const [summary, setSummary] = useState<{ professional: Professional; totalHours: number }[]>([])
  const { saveSchedule } = useHistory()
  const { config } = useConfig()
  const { toast } = useToast()

  useEffect(() => {
    const calculateSummary = () => {
      const hoursMap = new Map<number, number>()
      schedule.forEach(entry => {
        if (entry.professionalId !== null && entry.hours !== null) {
          const currentHours = hoursMap.get(entry.professionalId) || 0
          hoursMap.set(entry.professionalId, currentHours + entry.hours)
        }
      })

      const newSummary = professionals.map(p => ({
        professional: p,
        totalHours: hoursMap.get(p.id) || 0
      }))

      setSummary(newSummary)
    }

    calculateSummary()
  }, [schedule, professionals])

  const handleSaveSchedule = async () => {
    if (schedule.length === 0 || professionals.length === 0) {
      toast({
        title: "Erro ao salvar",
        description: "Não há escala ou profissionais para salvar.",
        variant: "destructive",
      })
      return
    }

    const currentMonth = schedule.length > 0 ? new Date(schedule[0].day) : new Date(); // Assuming schedule has at least one entry to get month/year
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1; // Month is 0-indexed in JS Date

    try {
      await saveSchedule(
        year,
        month,
        schedule,
        summary,
        config?.companyName || 'N/A',
        config?.departmentName || 'N/A',
        config?.systemName || 'N/A'
      )
      toast({
        title: "Sucesso!",
        description: "Escala salva no histórico.",
      })
    } catch (error) {
      console.error("Erro ao salvar escala:", error)
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a escala no histórico.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Resumo de Horas do Mês</CardTitle>
        <Button onClick={handleSaveSchedule} size="sm" className="no-print">
          <Save className="mr-2 h-4 w-4" /> Salvar no Histórico
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Profissional</th>
                <th scope="col" className="px-6 py-3">Horas Padrão</th>
                <th scope="col" className="px-6 py-3">Total de Horas na Escala</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((item) => (
                <tr key={item.professional.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: item.professional.color || '#cccccc' }} />
                      {item.professional.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">{item.professional.defaultHours || 0}h</td>
                  <td className="px-6 py-4">{item.totalHours}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
