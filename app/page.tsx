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
  const [activeProfessionalIds, setActiveProfessionalIds] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [isPrintPreviewActive, setIsPrintPreviewActive] = useState(false); // Renamed state

  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [historicalProfessionals, setHistoricalProfessionals] = useState<Professional[] | null>(null);
  const [historicalScheduleEntries, setHistoricalScheduleEntries] = useState<ScheduleEntryWithProfessional[] | null>(null);
  const [historicalMonthYear, setHistoricalMonthYear] = useState<string | null>(null);

  const [scheduleGenerationMode, setScheduleGenerationMode] = useState<'daily' | 'weekly'>('daily');
  const [startingProfessionalId, setStartingProfessionalId] = useState<string | null>(null);

  const { config, isLoading: isLoadingConfig, error: errorConfig } = useConfig();
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
    updateSchedule,
    isLoading: isLoadingSchedule,
    error: errorSchedule,
  } = useSchedule(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1);
  const {
    history,
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
      await updateSchedule(entry);
    } catch (error) {
      console.error('Erro ao atualizar entrada:', error);
    }
  };

  const handleDeleteScheduleEntry = async (date: string) => {
    try {
      await updateSchedule({ date });
    } catch (error) {
      console.error('Erro ao deletar entrada:', error);
    }
  };

  const handlePrevMonth = async () => {
    setSelectedMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = async () => {
    setSelectedMonth(prev => addMonths(prev, 1));
  };

  const handleGoToMonth = (date: Date) => {
    setSelectedMonth(date);
  };

  const handleGoToCurrentMonth = () => {
    setSelectedMonth(new Date());
  };

  const generateAutomaticSchedule = async () => {
    const start = startOfMonth(selectedMonth);
    const end = endOfMonth(selectedMonth);
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

        await updateSchedule({
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
    const monthYear = format(selectedMonth, "yyyy-MM");

    try {
      const scheduleData: ScheduleEntry[] = schedule.map(entry => ({
        date: entry.date,
        professionalId: entry.professional_id,
        hours: entry.hours,
        observation: entry.observation,
      }));

      await fetchHistory({
        month_year: monthYear,
        schedule_data: scheduleData,
        professionals_data: professionals,
      });

      alert(`Escala para ${format(selectedMonth, "MMMM 'de' yyyy", { locale: ptBR })} salva no histórico!`);
    } catch (error) {
      console.error('Erro ao salvar no histórico:', error);
      alert("Erro ao salvar no histórico. Tente novamente.");
    }
  };

  const loadHistoricalSchedule = (record: any) => {
    setSelectedMonth(parseISO(record.month_year + "-01"));
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
    const currentMonthYearFormatted = format(selectedMonth, "yyyy-MM");

    displayedScheduleEntries.forEach(entry => {
      const entryMonthYear = format(parseISO(entry.date), "yyyy-MM");
      if (entryMonthYear === currentMonthYearFormatted) {
        summary[entry.professional_id] = (summary[entry.professional_id] || 0) + entry.hours;
      }
    });
    return summary;
  }, [displayedScheduleEntries, selectedMonth]);

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
      <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Image
            src="/images/logo.png"
            alt="Logo do Sistema"
            width={64}
            height={64}
            className="rounded-full shadow-md"
          />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
            Sistema de Escala de Sobreaviso
          </h1>
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-2">
          <MonthSelector selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
          <Button onClick={handleOpenHistoryDialog} variant="outline" size="sm">
            <History className="mr-2 h-4 w-4" />
            Histórico
          </Button>
          <Button onClick={handlePrintPreview}>
            Visualizar Impressão
          </Button>
          <ApiStatus />
        </div>
      </header>

      <main className="flex-1">
        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-4">
            <TabsTrigger value="schedule">Escala</TabsTrigger>
            <TabsTrigger value="professionals">Profissionais</TabsTrigger>
            <TabsTrigger value="summary">Resumo</TabsTrigger>
            {/* <TabsTrigger value="settings">Configurações</TabsTrigger> */}
          </TabsList>

          <TabsContent value="schedule" className="mt-4">
            <div className="flex justify-center mb-4">
              <MonthSelector selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
            </div>
            <ScheduleCalendar
              year={selectedMonth.getFullYear()}
              month={selectedMonth.getMonth() + 1}
              professionals={displayedProfessionals}
              scheduleEntries={displayedScheduleEntries}
              onUpdateEntry={handleUpdateScheduleEntry}
              onDeleteEntry={handleDeleteScheduleEntry}
            />
          </TabsContent>

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

          <TabsContent value="summary" className="mt-4">
            <ScheduleSummary
              professionals={displayedProfessionals}
              hoursSummary={professionalHoursSummary}
            />
          </TabsContent>

          {/* <TabsContent value="settings">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Configurações do Sistema</h2>
                <p className="text-muted-foreground">Em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent> */}
        </Tabs>
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
                Escala de Sobreaviso - {format(selectedMonth, "MMMM 'de' yyyy", { locale: ptBR })}
              </h3>
            </div>
          </div>
          <ScheduleCalendar
            year={selectedMonth.getFullYear()}
            month={selectedMonth.getMonth() + 1}
            professionals={displayedProfessionals}
            scheduleEntries={displayedScheduleEntries}
            onUpdateEntry={async () => {}}
            onDeleteEntry={async () => {}}
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
