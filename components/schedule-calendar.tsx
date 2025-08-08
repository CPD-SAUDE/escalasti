'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSchedule } from '@/hooks/use-schedule'
import { useProfessionals } from '@/hooks/use-professionals'
import { ScheduleEntry, Professional } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'

export function ScheduleCalendar() {
  const { schedule, setSchedule, currentMonth, currentYear, loading, error } = useSchedule()
  const { professionals, loading: professionalsLoading } = useProfessionals()
  const [saving, setSaving] = useState(false)

  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay() // 0 for Sunday, 1 for Monday

  const handleProfessionalChange = useCallback((day: number, professionalId: string) => {
    setSchedule(prevSchedule => {
      const newSchedule = [...prevSchedule]
      const index = newSchedule.findIndex(entry => entry.day === day)
      if (index !== -1) {
        newSchedule[index].professionalId = professionalId === 'null' ? null : parseInt(professionalId)
      } else {
        newSchedule.push({ day, professionalId: parseInt(professionalId), hours: null, notes: '' })
      }
      return newSchedule
    })
  }, [setSchedule])

  const handleHoursChange = useCallback((day: number, hours: string) => {
    setSchedule(prevSchedule => {
      const newSchedule = [...prevSchedule]
      const index = newSchedule.findIndex(entry => entry.day === day)
      if (index !== -1) {
        newSchedule[index].hours = parseInt(hours) || null
      } else {
        newSchedule.push({ day, professionalId: null, hours: parseInt(hours), notes: '' })
      }
      return newSchedule
    })
  }, [setSchedule])

  const handleNotesChange = useCallback((day: number, notes: string) => {
    setSchedule(prevSchedule => {
      const newSchedule = [...prevSchedule]
      const index = newSchedule.findIndex(entry => entry.day === day)
      if (index !== -1) {
        newSchedule[index].notes = notes
      } else {
        newSchedule.push({ day, professionalId: null, hours: null, notes: notes })
      }
      return newSchedule
    })
  }, [setSchedule])

  const getScheduleEntry = useCallback((day: number): ScheduleEntry | undefined => {
    return schedule.find(entry => entry.day === day)
  }, [schedule])

  const handleSaveSchedule = async () => {
    setSaving(true)
    try {
      await api.post('/schedule', {
        year: currentYear,
        month: currentMonth,
        scheduleData: schedule,
      })
      toast.success('Escala salva com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar escala:', error)
      toast.error('Erro ao salvar escala.')
    } finally {
      setSaving(false)
    }
  }

  if (loading || professionalsLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="ml-4 text-lg">Carregando escala...</span>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 text-center">Erro ao carregar escala: {error}</div>
  }

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {calendarDays.map(day => {
          const entry = getScheduleEntry(day)
          const selectedProfessionalId = entry?.professionalId?.toString() || 'null'
          const selectedHours = entry?.hours?.toString() || ''
          const notes = entry?.notes || ''
          const professionalColor = professionals.find(p => p.id === entry?.professionalId)?.color || '#cccccc'

          return (
            <Card key={day} className="flex flex-col">
              <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-bold">Dia {day}</CardTitle>
                <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: professionalColor }} />
              </CardHeader>
              <CardContent className="p-3 pt-0 space-y-2 flex-grow">
                <div className="space-y-1">
                  <Label htmlFor={`professional-${day}`} className="text-xs">Profissional</Label>
                  <Select
                    value={selectedProfessionalId}
                    onValueChange={(value) => handleProfessionalChange(day, value)}
                  >
                    <SelectTrigger id={`professional-${day}`} className="h-9 text-sm">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="null">Nenhum</SelectItem>
                      {professionals.map(p => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`hours-${day}`} className="text-xs">Horas</Label>
                  <Input
                    id={`hours-${day}`}
                    type="number"
                    value={selectedHours}
                    onChange={(e) => handleHoursChange(day, e.target.value)}
                    placeholder="Horas"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`notes-${day}`} className="text-xs">Observações</Label>
                  <Textarea
                    id={`notes-${day}`}
                    value={notes}
                    onChange={(e) => handleNotesChange(day, e.target.value)}
                    placeholder="Observações"
                    className="min-h-[40px] text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSaveSchedule} disabled={saving} className="flex items-center gap-2">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Salvar Escala
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
