"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Download } from 'lucide-react';
import { useHistory } from '@/hooks/use-history';
import { ScheduleEntry, Professional, Config } from '@/lib/types';
import { useProfessionals } from '@/hooks/use-professionals';
import { useConfig } from '@/hooks/use-config';

interface HistoryEntry {
  id: number;
  year: number;
  month: number;
  monthYear: string;
  scheduleData: ScheduleEntry[];
  summaryData: { professional: Professional; totalHours: number }[];
  companyName: string;
  departmentName: string;
  systemName: string;
  savedAt: string;
}

export function HistoryDialog() {
  const { history, fetchHistory, deleteHistoryEntry, loading, error } = useHistory();
  const { professionals, fetchProfessionals } = useProfessionals();
  const { config, fetchConfig } = useConfig();
  const [selectedHistory, setSelectedHistory] = useState<HistoryEntry | null>(null);

  useEffect(() => {
    fetchHistory();
    fetchProfessionals();
    fetchConfig();
  }, [fetchHistory, fetchProfessionals, fetchConfig]);

  const getProfessionalName = (id: number | null) => {
    if (!id) return 'N/A';
    const professional = professionals.find(p => p.id === id);
    return professional ? professional.name : 'Desconhecido';
  };

  const getProfessionalColor = (id: number | null) => {
    if (!id) return '#cccccc'; // Cor padrão para não atribuído
    const professional = professionals.find(p => p.id === id);
    return professional ? professional.color : '#cccccc';
  };

  const handleDownload = (entry: HistoryEntry) => {
    const scheduleHtml = generateScheduleHtml(entry, professionals, config);
    const blob = new Blob([scheduleHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `escala_${entry.monthYear.replace(/ /g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateScheduleHtml = (entry: HistoryEntry, allProfessionals: Professional[], currentConfig: Config | null) => {
    const daysInMonth = new Date(entry.year, entry.month, 0).getDate();
    const firstDayOfMonth = new Date(entry.year, entry.month - 1, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday, 6 for Saturday

    const headerHtml = `
      <style>
        body { font-family: Arial, sans-serif; margin: 20mm; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 24px; }
        .header h2 { margin: 5px 0 15px; font-size: 18px; color: #555; }
        .schedule-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1px;
          border: 1px solid #ccc;
          background-color: #eee;
        }
        .day-header {
          background-color: #f0f0f0;
          padding: 8px;
          text-align: center;
          font-weight: bold;
          border: 1px solid #ccc;
        }
        .day-cell {
          background-color: #fff;
          padding: 8px;
          min-height: 100px;
          border: 1px solid #ccc;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .day-number {
          font-weight: bold;
          font-size: 1.1em;
          margin-bottom: 5px;
        }
        .professional-info {
          margin-top: auto;
          font-size: 0.9em;
        }
        .professional-name {
          font-weight: bold;
          color: #333;
        }
        .professional-hours {
          font-size: 0.8em;
          color: #666;
        }
        .professional-notes {
          font-size: 0.7em;
          color: #888;
          margin-top: 5px;
        }
        .summary-section {
          margin-top: 40px;
          page-break-before: always;
        }
        .summary-section h2 {
          text-align: center;
          margin-bottom: 20px;
          font-size: 20px;
        }
        .summary-table {
          width: 80%;
          margin: 0 auto;
          border-collapse: collapse;
        }
        .summary-table th, .summary-table td {
          border: 1px solid #ccc;
          padding: 8px;
          text-align: left;
        }
        .summary-table th {
          background-color: #f0f0f0;
        }
      </style>
      <div class="header">
        <h1>${currentConfig?.systemName || 'Sistema de Escala'}</h1>
        <h2>Escala de ${currentConfig?.departmentName || 'TI'} - ${currentConfig?.companyName || 'Empresa'}</h2>
        <h3>Mês: ${entry.monthYear}</h3>
      </div>
      <div class="schedule-grid">
        ${['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map(day => `<div class="day-header">${day}</div>`).join('')}
    `;

    let cellsHtml = '';
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      cellsHtml += `<div class="day-cell"></div>`;
    }

    for (let i = 0; i < daysInMonth; i++) {
      const day = i + 1;
      const scheduleEntry = entry.scheduleData.find(s => s.day === day);
      const professional = allProfessionals.find(p => p.id === scheduleEntry?.professionalId);
      const professionalName = professional ? professional.name : 'N/A';
      const professionalHours = scheduleEntry?.hours ? `${scheduleEntry.hours}h` : '';
      const professionalNotes = scheduleEntry?.notes || '';
      const professionalColor = professional ? professional.color : '#cccccc';

      cellsHtml += `
        <div class="day-cell">
          <div class="day-number">${day}</div>
          <div class="professional-info" style="color: ${professionalColor};">
            <div class="professional-name">${professionalName}</div>
            ${professionalHours ? `<div class="professional-hours">${professionalHours}</div>` : ''}
            ${professionalNotes ? `<div class="professional-notes">${professionalNotes}</div>` : ''}
          </div>
        </div>
      `;
    }

    const summaryHtml = `
      </div>
      <div class="summary-section">
        <h2>Resumo de Horas - ${entry.monthYear}</h2>
        <table class="summary-table">
          <thead>
            <tr>
              <th>Profissional</th>
              <th>Total de Horas</th>
            </tr>
          </thead>
          <tbody>
            ${entry.summaryData.map(s => `
              <tr>
                <td>${s.professional.name}</td>
                <td>${s.totalHours}h</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    return `<!DOCTYPE html><html><head><title>Escala de ${entry.monthYear}</title></head><body>${headerHtml}${cellsHtml}${summaryHtml}</body></html>`;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={loading}>
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin mr-2"></span>
              Carregando...
            </>
          ) : (
            'Ver Histórico'
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Histórico de Escalas Salvas</DialogTitle>
          <DialogDescription>
            Visualize e gerencie as escalas salvas anteriormente.
          </DialogDescription>
        </DialogHeader>
        {loading && <p>Carregando histórico...</p>}
        {error && <p className="text-red-500">Erro ao carregar histórico: {error.message}</p>}
        {!loading && history.length === 0 && <p>Nenhuma escala salva no histórico.</p>}

        <ScrollArea className="flex-grow pr-4">
          <div className="grid gap-4 py-4">
            {history.map((entry) => (
              <Card key={entry.id} className="flex items-center justify-between p-4">
                <div>
                  <CardTitle className="text-lg">
                    Escala de {entry.monthYear}
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    Salvo em: {format(new Date(entry.savedAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </p>
                  <p className="text-sm text-gray-500">
                    Empresa: {entry.companyName || 'N/A'}, Departamento: {entry.departmentName || 'N/A'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedHistory(entry)}>
                    Ver Detalhes
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDownload(entry)}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (window.confirm('Tem certeza que deseja excluir esta entrada do histórico?')) {
                        deleteHistoryEntry(entry.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="no-print">
          <Button onClick={() => setSelectedHistory(null)}>Fechar</Button>
        </DialogFooter>

        {selectedHistory && (
          <Dialog open={!!selectedHistory} onOpenChange={() => setSelectedHistory(null)}>
            <DialogContent className="max-w-5xl h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Detalhes da Escala de {selectedHistory.monthYear}</DialogTitle>
                <DialogDescription>
                  Visualização detalhada da escala salva.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="flex-grow p-4 border rounded-md">
                <div className="mb-4 text-center">
                  <h3 className="text-xl font-bold">{selectedHistory.systemName || 'Sistema de Escala'}</h3>
                  <p className="text-md">{selectedHistory.departmentName || 'TI'} - {selectedHistory.companyName || 'Empresa'}</p>
                  <p className="text-lg font-semibold mt-2">Mês: {selectedHistory.monthYear}</p>
                </div>
                <div className="grid grid-cols-7 gap-1 border">
                  {['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map(day => (
                    <div key={day} className="bg-gray-200 dark:bg-gray-700 p-2 text-center font-bold text-sm">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: new Date(selectedHistory.year, selectedHistory.month, 0).getDate() + new Date(selectedHistory.year, selectedHistory.month - 1, 1).getDay() }, (_, i) => {
                    const firstDayOfMonth = new Date(selectedHistory.year, selectedHistory.month - 1, 1).getDay();
                    const dayNumber = i - firstDayOfMonth + 1;
                    const scheduleEntry = selectedHistory.scheduleData.find(entry => entry.day === dayNumber);
                    const professional = professionals.find(p => p.id === scheduleEntry?.professionalId);

                    if (dayNumber <= 0) {
                      return <div key={`empty-${i}`} className="p-2 border min-h-[100px]"></div>;
                    }

                    return (
                      <div key={dayNumber} className="p-2 border min-h-[100px] flex flex-col justify-between">
                        <div className="font-bold text-lg">{dayNumber}</div>
                        {professional && (
                          <div className="mt-auto text-sm" style={{ color: professional.color }}>
                            <div className="font-semibold">{professional.name}</div>
                            {scheduleEntry?.hours && <div className="text-xs">{scheduleEntry.hours}h</div>}
                            {scheduleEntry?.notes && <div className="text-xs text-gray-600 dark:text-gray-400">{scheduleEntry.notes}</div>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4 text-center">Resumo de Horas</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th scope="col" className="px-6 py-3">Profissional</th>
                          <th scope="col" className="px-6 py-3">Total de Horas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedHistory.summaryData.map((summary, index) => (
                          <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              {getProfessionalName(summary.professional.id)}
                            </td>
                            <td className="px-6 py-4">{summary.totalHours}h</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </ScrollArea>
              <DialogFooter className="no-print">
                <Button onClick={() => setSelectedHistory(null)}>Fechar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}
