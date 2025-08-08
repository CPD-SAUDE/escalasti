"use client";

import { useState, useEffect, useMemo } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, parseISO, getWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfessionalManagement } from "@/components/professional-management";
import { ScheduleCalendar } from "@/components/schedule-calendar";
import { MonthSelector } from "@/components/month-selector";
import { HistoryDialog } from "@/components/history-dialog";
import { ScheduleSummary } from "@/components/schedule-summary";
import { ApiStatus } from "@/components/api-status";
import { Professional, ScheduleEntry } from "@/lib/types";
import { ScheduleEntryWithProfessional } from "@/lib/api";
import { useProfessionals } from "@/hooks/use-professionals";
import { useSchedule } from "@/hooks/use-schedule";
import { useHistory } from "@/hooks/use-history";
import { useConfig } from "@/hooks/use-config";
import { cn } from "@/lib/utils";
import { Loader2, History } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";

export default function Home() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeProfessionalIds, setActiveProfessionalIds] = useState<string[]>([]);
  const [isPrintPreviewActive, setIsPrintPreviewActive] = useState(false); // Renamed state

  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [historicalProfessionals, setHistoricalProfessionals] = useState<Professional[] | null>(null);
  const [historicalScheduleEntries, setHistoricalScheduleEntries] = useState<ScheduleEntryWithProfessional[] | null>(null);
  const [historicalMonthYear, setHistoricalMonthYear] = useState<string | null>(null);

  const [scheduleGenerationMode, setScheduleGenerationMode] = useState<'daily' | 'weekly'>('daily');
  const [startingProfessionalId, setStartingProfessionalId] = useState<string | null>(null);

  const { config, updateConfig, isLoading: isLoadingConfig, error: errorConfig } = useConfig();
  const {
    professionals,
    addProfessional,
    updateProfessional,
    deleteProfessional,
    isLoading: isLoadingProfessionals,
    error: errorProfessionals,
  } = useProfessionals();
  const {
    schedule,
    addOrUpdateScheduleEntry,
    deleteScheduleEntry,
    getScheduleByMonth,
    isLoading: isLoadingSchedule,
    error: errorSchedule,
  } = useSchedule();
  const {
    history,
    addHistoryEntry,
    deleteHistoryEntry,
    isLoading: isLoadingHistory,
    error: errorHistory,
    fetchHistory,
  } = useHistory();

  const isLoading =
    isLoadingConfig ||
    isLoadingProfessionals ||
    isLoadingSchedule ||
    isLoadingHistory;
  const error =
    errorConfig || errorProfessionals || errorSchedule || errorHistory;

  useEffect(() => {
    if (professionals.length > 0 && activeProfessionalIds.length === 0) {
      setActiveProfessionalIds(professionals.map(p => p.id));
    }
  }, [professionals, activeProfessionalIds.length]);

  useEffect(() => {
    if (activeProfessionalIds.length > 0 && (!startingProfessionalId || !activeProfessionalIds.includes(startingProfessionalId))) {
      setStartingProfessionalId(activeProfessionalIds[0]);
    } else if (activeProfessionalIds.length === 0) {
      setStartingProfessionalId(null);
    }
  }, [activeProfessionalIds, startingProfessionalId]);

  useEffect(() => {
    console.log("NEXT_PUBLIC_API_URL no frontend:", process.env.NEXT_PUBLIC_API_URL);
  }, []);

  // Apply/remove print-preview-active-body-wrapper class to body
  useEffect(() => {
    if (isPrintPreviewActive) {
      document.body.classList.add('print-preview-active-body-wrapper');
    } else {
      document.body.classList.remove('print-preview-active-body-wrapper');
    }
    // Cleanup function
    return () => {
      document.body.classList.remove('print-preview-active-body-wrapper');
    };
  }, [isPrintPreviewActive]);

  useEffect(() => {
    getScheduleByMonth(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
  }, [currentMonth, getScheduleByMonth]);

  const handleToggleProfessionalActive = (id: string, checked: boolean) => {
    setActiveProfessionalIds(prev => {
      if (checked) {
        return [...prev, id];
      } else {
        return prev.filter(activeId => activeId !== id);
      }
    });
  };

  const handleUpdateScheduleEntry = async (entry: Omit<ScheduleEntry, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await addOrUpdateScheduleEntry(entry);
    } catch (error) {
      console.error('Erro ao atualizar entrada:', error);
    }
  };

  const handleDeleteScheduleEntry = async (date: string) => {
    try {
      await deleteScheduleEntry(date);
    } catch (error) {
      console.error('Erro ao deletar entrada:', error);
    }
  };

  const handlePrevMonth = async () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = async () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const handleGoToMonth = (date: Date) => {
    setCurrentMonth(date);
  };

  const handleGoToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  const generateAutomaticSchedule = async () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start, end });

    const activeProfessionals = professionals.filter(p => activeProfessionalIds.includes(p.id));

    if (activeProfessionals.length === 0) {
      alert("Por favor, adicione e selecione pelo menos um profissional para gerar a escala automática.");
      return;
    }

    let initialProfessionalIndex = 0;
    if (startingProfessionalId) {
      const foundIndex = activeProfessionals.findIndex(p => p.id === startingProfessionalId);
      if (foundIndex !== -1) {
        initialProfessionalIndex = foundIndex;
      }
    }

    try {
      let professionalIndex = initialProfessionalIndex;
      let currentProfessionalForWeek: Professional | null = null;
      let lastProcessedWeek: number | null = null;

      for (const day of daysInMonth) {
        let assignedProfessional: Professional;

        if (scheduleGenerationMode === 'daily') {
          assignedProfessional = activeProfessionals[professionalIndex];
          professionalIndex = (professionalIndex + 1) % activeProfessionals.length;
        } else {
          const currentWeekNumber = getWeek(day, { locale: ptBR, weekStartsOn: 1 });

          if (lastProcessedWeek === null || currentWeekNumber !== lastProcessedWeek) {
            currentProfessionalForWeek = activeProfessionals[professionalIndex];
            professionalIndex = (professionalIndex + 1) % activeProfessionals.length;
            lastProcessedWeek = currentWeekNumber;
          }
          assignedProfessional = currentProfessionalForWeek!;
        }

        await addOrUpdateScheduleEntry({
          date: format(day, "yyyy-MM-dd"),
          professionalId: assignedProfessional.id,
          hours: assignedProfessional.default_hours || 12,
          observation: undefined,
        });
      }

      alert("Escala automática gerada com sucesso!");
    } catch (error) {
      console.error('Erro ao gerar escala automática:', error);
      alert("Erro ao gerar escala automática. Tente novamente.");
    }
  };

  const createScheduleRecord = async () => {
    const monthYear = format(currentMonth, "yyyy-MM");

    try {
      const scheduleData: ScheduleEntry[] = schedule.map(entry => ({
        date: entry.date,
        professionalId: entry.professional_id,
        hours: entry.hours,
        observation: entry.observation,
      }));

      await addHistoryEntry({
        month_year: monthYear,
        schedule_data: scheduleData,
        professionals_data: professionals,
      });

      alert(`Escala para ${format(currentMonth, "MMMM 'de' yyyy", { locale: ptBR })} salva no histórico!`);
    } catch (error) {
      console.error('Erro ao salvar no histórico:', error);
      alert("Erro ao salvar no histórico. Tente novamente.");
    }
  };

  const loadHistoricalSchedule = (record: any) => {
    setCurrentMonth(parseISO(record.month_year + "-01"));
    setHistoricalProfessionals(record.professionals_data);

    const entriesWithProfessional: ScheduleEntryWithProfessional[] = record.schedule_data.map((entry: any) => {
      const prof = record.professionals_data.find((p: any) => p.id === entry.professionalId);
      return {
        ...entry,
        professional_id: entry.professionalId,
        professional_name: prof?.name || 'Desconhecido',
        professional_color: prof?.color || 'bg-gray-500',
      };
    });
    setHistoricalScheduleEntries(entriesWithProfessional);
    setHistoricalMonthYear(record.month_year);
    alert(`Escala de ${format(parseISO(record.month_year + "-01"), "MMMM 'de' yyyy", { locale: ptBR })} carregada para visualização.`);
  };

  const handleOpenHistoryDialog = () => {
    fetchHistory();
    setIsHistoryDialogOpen(true);
  };

  const handlePrintPreview = () => {
    setIsPrintPreviewActive(true);
  };

  const handleExitPrintPreview = () => {
    setIsPrintPreviewActive(false);
  };

  const displayedProfessionals = professionals;
  const displayedScheduleEntries = schedule;

  const professionalHoursSummary = useMemo(() => {
    const summary: { [key: string]: number } = {};
    const currentMonthYearFormatted = format(currentMonth, "yyyy-MM");

    displayedScheduleEntries.forEach(entry => {
      const entryMonthYear = format(parseISO(entry.date), "yyyy-MM");
      if (entryMonthYear === currentMonthYearFormatted) {
        summary[entry.professional_id] = (summary[entry.professional_id] || 0) + entry.hours;
      }
    });
    return summary;
  }, [displayedScheduleEntries, currentMonth]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Carregando sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900", isPrintPreviewActive && "print-preview-active-body-wrapper")}> {/* Add wrapper class */}
      {/* Main content, hidden when in print preview */}
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6 flex flex-col md:flex-row items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Sistema de Escala de Sobreaviso</h1>
        <div className="flex items-center space-x-4">
          <ApiStatus />
          <Button onClick={handleOpenHistoryDialog} variant="outline" size="sm">
            <History className="mr-2 h-4 w-4" />
            Histórico
          </Button>
          <Button onClick={handlePrintPreview}> {/* Changed to handlePrintPreview */}
            Visualizar Impressão
          </Button>
        </div>
      </header>
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Escala Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <MonthSelector currentMonth={currentMonth} onMonthChange={setCurrentMonth} />
              <ScheduleCalendar
                currentMonth={currentMonth}
                schedule={displayedScheduleEntries}
                professionals={displayedProfessionals}
                addOrUpdateScheduleEntry={handleUpdateScheduleEntry}
                deleteScheduleEntry={handleDeleteScheduleEntry}
                isLoading={isLoadingSchedule}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6">
          <ScheduleSummary
            currentMonth={currentMonth}
            schedule={displayedScheduleEntries}
            professionals={displayedProfessionals}
          />
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="professionals" className="w-full">
                <TabsList className="grid w-full grid-cols-1">
                  <TabsTrigger value="professionals">Profissionais</TabsTrigger>
                  {/* <TabsTrigger value="config">Configurações</TabsTrigger> */}
                </TabsList>
                <TabsContent value="professionals" className="mt-4">
                  <ProfessionalManagement
                    professionals={displayedProfessionals}
                    addProfessional={addProfessional}
                    updateProfessional={updateProfessional}
                    deleteProfessional={deleteProfessional}
                    activeProfessionalIds={activeProfessionalIds}
                    onToggleProfessionalActive={handleToggleProfessionalActive}
                  />
                </TabsContent>
                {/* <TabsContent value="config" className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Configurações do Sistema</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="backend-ip">IP do Backend</Label>
                      <Input
                        id="backend-ip"
                        value={config.backendIp || ''}
                        onChange={(e) => updateConfig({ backendIp: e.target.value })}
                        placeholder="Ex: 192.168.1.100"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        O IP do servidor backend para comunicação da API.
                      </p>
                    </div>
                  </div>
                </TabsContent> */}
              </Tabs>
            </CardContent>
          </Card>
          <div className="flex space-x-2">
            <Select value={scheduleGenerationMode} onValueChange={(value: 'daily' | 'weekly') => setScheduleGenerationMode(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Modo de Geração" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Rotação Diária</SelectItem>
                <SelectItem value="weekly">Rotação Semanal</SelectItem>
              </SelectContent>
            </Select>
            {/* NOVO: Seleção do profissional que inicia a escala */}
            <Select
              value={startingProfessionalId || ''}
              onValueChange={setStartingProfessionalId}
              disabled={activeProfessionalIds.length === 0}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Começar com..." />
              </SelectTrigger>
              <SelectContent>
                {activeProfessionalIds.map(profId => {
                  const prof = professionals.find(p => p.id === profId);
                  return prof ? (
                    <SelectItem key={prof.id} value={prof.id}>
                      {prof.name}
                    </SelectItem>
                  ) : null;
                })}
              </SelectContent>
            </Select>
            <Button 
              onClick={generateAutomaticSchedule} 
              disabled={activeProfessionalIds.length === 0 || isLoadingSchedule || !startingProfessionalId}
            >
              {isLoadingSchedule ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Gerando...
                </>
              ) : (
                'Gerar Escala Automática'
              )}
            </Button>
            <Button 
              onClick={createScheduleRecord}
              disabled={schedule.length === 0 || isLoadingHistory}
            >
              {isLoadingHistory ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                'Criar Registro de Escala'
              )}
            </Button>
          </div>
        </div>
      </main>

      {/* Print preview content, shown when in print preview */}
      {isPrintPreviewActive && (
        <div className="p-8 print-scale-container-preview"> {/* New class for preview container */}
          {/* Cabeçalho para impressão */}
          <div className="flex flex-col items-center mb-4 print-header-container-preview"> {/* New class */}
            <div className="flex-shrink-0">
              <Image 
                src="/images/logo.png" 
                alt="Logo Chapadão do Céu" 
                width={80} 
                height={50} 
                priority
                className="print-logo-preview" // New class
              />
            </div>
            <div className="flex-grow print-header-text-preview"> {/* New class */}
              <h1 className="font-bold print-header-preview">SECRETARIA MUNICIPAL DE SAÚDE DE CHAPADÃO DO CÉU</h1> {/* New class */}
              <h2 className="font-semibold print-header-preview sub-header-preview">DEPARTAMENTO DE INFORMÁTICA</h2> {/* New class */}
              <h3 className="print-header-preview system-title-preview"> {/* New class */}
                Escala de Sobreaviso - {format(currentMonth, "MMMM 'de' yyyy", { locale: ptBR })}
              </h3>
            </div>
          </div>
          <ScheduleCalendar
            currentMonth={currentMonth}
            schedule={displayedScheduleEntries}
            professionals={displayedProfessionals}
            addOrUpdateScheduleEntry={async () => {}}
            deleteScheduleEntry={async () => {}}
            isPrintMode={true} // Keep this true to apply print-specific logic within calendar/summary components
          />
          <ScheduleSummary
            schedule={displayedScheduleEntries}
            professionals={displayedProfessionals}
            isPrintMode={true} // Keep this true to apply print-specific logic within calendar/summary components
          />
          <footer className="py-2 text-center text-xs text-muted-foreground print-footer-preview"> {/* New class */}
            <p>{config.company_name}</p>
          </footer>
          <div className="text-center mt-4">
            <Button onClick={handleExitPrintPreview}>Voltar</Button>
            <Button onClick={() => window.print()} className="ml-2">Imprimir Agora</Button>
          </div>
        </div>
      )}
      <HistoryDialog
        isOpen={isHistoryDialogOpen}
        onClose={() => setIsHistoryDialogOpen(false)}
        history={history}
        isLoading={isLoadingHistory}
        error={errorHistory}
        onLoadHistory={loadHistoricalSchedule}
      />
    </div>
  );
}
