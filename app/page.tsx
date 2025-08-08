'use client'

import { useState, useEffect } from 'react'
import { CalendarDays, Users, Settings, History, Printer, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MonthSelector } from '@/components/month-selector'
import { ScheduleCalendar } from '@/components/schedule-calendar'
import { ProfessionalManagement } from '@/components/professional-management'
import { ScheduleSummary } from '@/components/schedule-summary'
import { HistoryDialog } from '@/components/history-dialog'
import { useSchedule } from '@/hooks/use-schedule'
import { useProfessionals } from '@/hooks/use-professionals'
import { useConfig } from '@/hooks/use-config'
import { ApiStatus } from '@/components/api-status'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function Home() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isPrintPreview, setIsPrintPreview] = useState(false)
  const [autoGenerateType, setAutoGenerateType] = useState<'daily' | 'weekly'>('daily')

  const {
    schedule,
    fetchSchedule,
    updateScheduleEntry,
    generateSchedule,
    clearSchedule,
    loading: scheduleLoading,
    error: scheduleError
  } = useSchedule()
  const {
    professionals,
    fetchProfessionals,
    addProfessional,
    updateProfessional,
    deleteProfessional,
    loading: professionalsLoading,
    error: professionalsError
  } = useProfessionals()
  const {
    config,
    fetchConfig,
    updateConfig,
    loading: configLoading,
    error: configError
  } = useConfig()

  useEffect(() => {
    fetchProfessionals()
    fetchConfig()
  }, [])

  useEffect(() => {
    fetchSchedule(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
  }, [currentMonth, fetchSchedule])

  const handlePrint = () => {
    setIsPrintPreview(true)
    setTimeout(() => {
      window.print()
      setIsPrintPreview(false)
    }, 500) // Pequeno atraso para garantir que os estilos de impressão sejam aplicados
  }

  const handleGenerateSchedule = async () => {
    if (professionals.length === 0) {
      alert('Adicione profissionais antes de gerar a escala.')
      return
    }
    const confirmGenerate = window.confirm(
      'Isso irá apagar a escala atual e gerar uma nova. Deseja continuar?'
    )
    if (confirmGenerate) {
      await generateSchedule(currentMonth.getFullYear(), currentMonth.getMonth() + 1, autoGenerateType)
      fetchSchedule(currentMonth.getFullYear(), currentMonth.getMonth() + 1) // Recarrega a escala após a geração
    }
  }

  const handleClearSchedule = async () => {
    const confirmClear = window.confirm(
      'Isso irá apagar completamente a escala atual. Deseja continuar?'
    )
    if (confirmClear) {
      await clearSchedule(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
      fetchSchedule(currentMonth.getFullYear(), currentMonth.getMonth() + 1) // Recarrega a escala após a limpeza
    }
  }

  const isLoading = scheduleLoading || professionalsLoading || configLoading
  const hasError = scheduleError || professionalsError || configError

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${isPrintPreview ? 'print-preview-active-body-wrapper' : ''}`}>
      <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center no-print">
        <div className="flex items-center gap-2">
          <img src="/placeholder-logo.png" alt="Logo" className="h-8 w-8" />
          <h1 className="text-xl font-bold">{config?.systemName || 'Sistema de Escala'}</h1>
        </div>
        <ApiStatus />
      </header>

      <main className="p-4 md:p-6">
        {hasError && (
          <Alert variant="destructive" className="mb-4 no-print">
            <AlertTitle>Erro!</AlertTitle>
            <AlertDescription>
              Ocorreu um erro ao carregar os dados: {scheduleError?.message || professionalsError?.message || configError?.message}.
              Verifique a conexão com o backend.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="schedule" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 no-print">
            <TabsTrigger value="schedule">
              <CalendarDays className="mr-2 h-4 w-4" /> Escala
            </TabsTrigger>
            <TabsTrigger value="professionals">
              <Users className="mr-2 h-4 w-4" /> Profissionais
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="mr-2 h-4 w-4" /> Histórico
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" /> Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Escala de {config?.departmentName || 'TI'} - {config?.companyName || 'Empresa'}
                </CardTitle>
                <div className="flex items-center gap-2 no-print">
                  <MonthSelector currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <RefreshCcw className="mr-2 h-4 w-4" /> Gerar Escala
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Gerar Escala Automática</DialogTitle>
                        <DialogDescription>
                          Selecione o tipo de rotação para a geração automática da escala.
                          Isso irá apagar a escala atual do mês selecionado.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="autoGenerateType" className="text-right">
                            Tipo de Rotação
                          </Label>
                          <Select value={autoGenerateType} onValueChange={setAutoGenerateType}>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Diária</SelectItem>
                              <SelectItem value="weekly">Semanal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={handleClearSchedule}>Limpar Escala</Button>
                        <Button onClick={handleGenerateSchedule}>Gerar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button onClick={handlePrint} variant="outline" size="sm">
                    <Printer className="mr-2 h-4 w-4" /> Imprimir
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <p>Carregando escala...</p>
                  </div>
                ) : (
                  <ScheduleCalendar
                    schedule={schedule}
                    professionals={professionals}
                    updateScheduleEntry={updateScheduleEntry}
                    currentMonth={currentMonth}
                  />
                )}
              </CardContent>
            </Card>
            <ScheduleSummary schedule={schedule} professionals={professionals} className="mt-4" />
          </TabsContent>

          <TabsContent value="professionals">
            <ProfessionalManagement
              professionals={professionals}
              addProfessional={addProfessional}
              updateProfessional={updateProfessional}
              deleteProfessional={deleteProfessional}
              loading={professionalsLoading}
            />
          </TabsContent>

          <TabsContent value="history">
            <HistoryDialog />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Nome da Empresa</Label>
                  <Input
                    id="companyName"
                    value={config?.companyName || ''}
                    onChange={(e) => updateConfig({ ...config, companyName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="departmentName">Nome do Departamento</Label>
                  <Input
                    id="departmentName"
                    value={config?.departmentName || ''}
                    onChange={(e) => updateConfig({ ...config, departmentName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="systemName">Título do Sistema</Label>
                  <Input
                    id="systemName"
                    value={config?.systemName || ''}
                    onChange={(e) => updateConfig({ ...config, systemName: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
