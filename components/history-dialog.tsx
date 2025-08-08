'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/date-picker'
import { addHistoryEntry, getAllHistory } from '@/lib/api'
import { HistoryEntry } from '@/lib/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Trash2 } from 'lucide-react' // Importe o ícone de lixeira

export function HistoryDialog() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [newEntryDate, setNewEntryDate] = useState<Date | undefined>(new Date())
  const [newEntryDescription, setNewEntryDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHistory = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getAllHistory()
      setHistory(data)
    } catch (err) {
      setError('Erro ao carregar histórico.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const handleAddEntry = async () => {
    if (!newEntryDate || !newEntryDescription.trim()) {
      setError('Por favor, preencha a data e a descrição.')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const formattedDate = format(newEntryDate, 'yyyy-MM-dd')
      await addHistoryEntry({ date: formattedDate, description: newEntryDescription })
      setNewEntryDescription('')
      setNewEntryDate(new Date()) // Resetar para a data atual
      await fetchHistory() // Recarregar o histórico
    } catch (err) {
      setError('Erro ao adicionar entrada de histórico.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Função para formatar a data para exibição
  const formatDateForDisplay = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // Mês é 0-indexado no Date
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Ver Histórico</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Histórico de Escalas</DialogTitle>
          <DialogDescription>
            Visualize e adicione entradas ao histórico de eventos importantes relacionados às escalas.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Adicionar Nova Entrada</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="newEntryDate">Data</Label>
                <DatePicker date={newEntryDate} setDate={setNewEntryDate} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newEntryDescription">Descrição</Label>
                <Textarea
                  id="newEntryDescription"
                  placeholder="Descreva o evento..."
                  value={newEntryDescription}
                  onChange={(e) => setNewEntryDescription(e.target.value)}
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button onClick={handleAddEntry} disabled={isLoading}>
                {isLoading ? 'Adicionando...' : 'Adicionar Entrada'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Entradas Existentes</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && <p>Carregando histórico...</p>}
              {!isLoading && history.length === 0 && <p>Nenhuma entrada de histórico encontrada.</p>}
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                <div className="space-y-4">
                  {history.map((entry) => (
                    <div key={entry.id} className="flex items-start justify-between border-b pb-2 last:border-b-0">
                      <div>
                        <p className="text-sm font-medium">{formatDateForDisplay(entry.date)}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{entry.description}</p>
                      </div>
                      {/* <Button variant="ghost" size="icon" className="ml-4">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button> */}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
