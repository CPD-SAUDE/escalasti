'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useSchedule } from '@/hooks/use-schedule'
import { useProfessionals } from '@/hooks/use-professionals'
import { useConfig } from '@/hooks/use-config'
import { ScheduleEntry, Professional, Config } from '@/lib/types'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Trash2, Download, Save } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface HistoryItem {
  id: number
  year: number
  month: number
  monthYear: string
  scheduleData: string // JSON string
  summaryData: string // JSON string
  companyName: string | null
  departmentName: string | null
  systemName: string | null
  savedAt: string // ISO string
}

export function HistoryDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { schedule, currentMonth, currentYear, setSchedule } = useSchedule()
  const { professionals } = useProfessionals()
  const { config } = useConfig()

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const response = await api.get('/history')
      setHistory(response.data)
    } catch (error) {
      console.error('Erro ao buscar histórico:', error)
      toast.error('Erro ao carregar histórico.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchHistory()
    }
  }, [isOpen])

  const handleSaveSchedule = async () => {
    setSaving(true)
    try {
      // Calcular o summaryData antes de salvar
      const summaryData = calculateSummary(schedule, professionals)

      const monthYear = format(new Date(currentYear, currentMonth - 1, 1), 'MMMM yyyy', { locale: ptBR })
      await api.post('/history', {
        year: currentYear,
        month: currentMonth,
        monthYear,
        scheduleData: schedule,
        summaryData: summaryData,
        companyName: config.companyName,
        departmentName: config.departmentName,
        systemName: config.systemName,
      })
      toast.success('Escala salva no histórico com sucesso!')
      fetchHistory() // Atualiza a lista de histórico
    } catch (error) {
      console.error('Erro ao salvar escala no histórico:', error)
      toast.error('Erro ao salvar escala no histórico.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteHistoryItem = async (id: number) => {
    try {
      await api.delete(`/history/${id}`)
      toast.success('Item do histórico deletado com sucesso!')
      fetchHistory() // Atualiza a lista de histórico
    } catch (error) {
      console.error('Erro ao deletar item do histórico:', error)
      toast.error('Erro ao deletar item do histórico.')
    }
  }

  const handleLoadSchedule = (item: HistoryItem) => {
    try {
      const loadedSchedule: ScheduleEntry[] = JSON.parse(item.scheduleData)
      setSchedule(loadedSchedule)
      // O MonthSelector já lida com a atualização do mês/ano global
      // Mas se quisermos que a UI reflita o mês/ano do histórico, precisaríamos de um contexto global para isso.
      // Por enquanto, apenas a schedule é carregada.
      toast.success(`Escala de ${item.monthYear} carregada com sucesso!`)
      setIsOpen(false) // Fecha o diálogo após carregar
    } catch (e) {
      console.error('Erro ao carregar dados da escala do histórico:', e)
      toast.error('Erro ao carregar dados da escala do histórico.')
    }
  }

  const calculateSummary = (schedule: ScheduleEntry[], professionals: Professional[]) => {
    const summary: { [key: number]: { totalHours: number; days: number[] } } = {}

    professionals.forEach(p => {
      summary[p.id] = { totalHours: 0, days: [] }
    })

    schedule.forEach(entry => {
      if (entry.professionalId !== null && entry.hours !== null && entry.hours > 0) {
        if (summary[entry.professionalId]) {
          summary[entry.professionalId].totalHours += entry.hours
          summary[entry.professionalId].days.push(entry.day)
        }
      }
    })

    return summary
  }

  const generatePdfContent = (item: HistoryItem) => {
    const loadedSchedule: ScheduleEntry[] = JSON.parse(item.scheduleData)
    const loadedSummary: { [key: number]: { totalHours: number; days: number[] } } = JSON.parse(item.summaryData)

    const monthYear = item.monthYear
    const companyName = item.companyName || 'N/A'
    const departmentName = item.departmentName || 'N/A'
    const systemName = item.systemName || 'N/A'
    const savedAt = format(new Date(item.savedAt), "dd/MM/yyyy HH:mm", { locale: ptBR })

    let content = `
      <h1>${systemName}</h1>
      <h2>Escala de Sobreaviso - ${monthYear}</h2>
      <p><strong>Empresa:</strong> ${companyName}</p>
      <p><strong>Departamento:</strong> ${departmentName}</p>
      <p><strong>Gerado em:</strong> ${savedAt}</p>
      <br/>
      <h3>Escala Detalhada:</h3>
      <table border="1" style="width:100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Dia</th>
            <th>Profissional</th>
            <th>Horas</th>
            <th>Observações</th>
          </tr>
        </thead>
        <tbody>
    `

    loadedSchedule.forEach(entry => {
      const professional = professionals.find(p => p.id === entry.professionalId)
      content += `
        <tr>
          <td>${entry.day}</td>
          <td>${professional ? professional.name : 'N/A'}</td>
          <td>${entry.hours !== null ? entry.hours : ''}</td>
          <td>${entry.notes || ''}</td>
        </tr>
      `
    })
    content += `
        </tbody>
      </table>
      <br/>
      <h3>Resumo de Horas:</h3>
      <table border="1" style="width:100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Profissional</th>
            <th>Total de Horas</th>
            <th>Dias de Sobreaviso</th>
          </tr>
        </thead>
        <tbody>
    `
    professionals.forEach(p => {
      const summaryEntry = loadedSummary[p.id]
      if (summaryEntry) {
        content += `
          <tr>
            <td>${p.name}</td>
            <td>${summaryEntry.totalHours}</td>
            <td>${summaryEntry.days.length > 0 ? summaryEntry.days.sort((a, b) => a - b).join(', ') : 'Nenhum'}</td>
          </tr>
        `
      }
    })
    content += `
        </tbody>
      </table>
    `
    return content
  }

  const handleDownloadPdf = (item: HistoryItem) => {
    const content = generatePdfContent(item)
    const filename = `Escala_Sobreaviso_${item.monthYear.replace(/ /g, '_')}.pdf`

    // Usando uma biblioteca de PDF no cliente (ex: html2pdf.js ou jspdf com html2canvas)
    // Para simplificar, vou simular o download de um HTML que pode ser salvo como PDF
    // Em um ambiente real, você usaria uma biblioteca como jsPDF ou html2pdf.js
    // Exemplo com html2pdf.js (precisaria ser importado no projeto):
    /*
    const element = document.createElement('div');
    element.innerHTML = content;
    html2pdf().from(element).save(filename);
    */

    // Para demonstração, vamos criar um blob HTML e fazer o download
    const blob = new Blob([content], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename.replace('.pdf', '.html') // Baixa como HTML para visualização
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.info('Arquivo HTML gerado. Para PDF, uma biblioteca de PDF seria necessária.')
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Save className="h-4 w-4" /> Histórico
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Histórico de Escalas Salvas</DialogTitle>
          <DialogDescription>
            Visualize, carregue ou delete escalas salvas anteriormente.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="col-span-1 md:col-span-2">
            <Label htmlFor="companyName">Nome da Empresa</Label>
            <Input id="companyName" value={config.companyName || ''} readOnly />
          </div>
          <div className="col-span-1">
            <Label htmlFor="departmentName">Departamento</Label>
            <Input id="departmentName" value={config.departmentName || ''} readOnly />
          </div>
        </div>

        <Button
          onClick={handleSaveSchedule}
          disabled={saving}
          className="mb-4 flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Salvar Escala Atual
            </>
          )}
        </Button>

        <ScrollArea className="flex-grow border rounded-md p-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Carregando histórico...</span>
            </div>
          ) : history.length === 0 ? (
            <p className="text-center text-muted-foreground">Nenhum histórico encontrado.</p>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <Card key={item.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-semibold">{item.monthYear}</p>
                    <p className="text-sm text-muted-foreground">
                      Salvo em: {format(new Date(item.savedAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </p>
                    {item.companyName && <p className="text-xs text-muted-foreground">Empresa: {item.companyName}</p>}
                    {item.departmentName && <p className="text-xs text-muted-foreground">Depto: {item.departmentName}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleLoadSchedule(item)}>
                      Carregar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownloadPdf(item)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso excluirá permanentemente este item do histórico.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteHistoryItem(item.id)}>
                            Deletar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
