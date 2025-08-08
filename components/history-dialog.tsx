'use client'

import { useState } from 'react'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { HistoryEntry } from '@/lib/types'
import { DatePicker } from './date-picker'
import { Textarea } from './ui/textarea'
import { Trash2 } from 'lucide-react'

interface HistoryDialogProps {
  history: HistoryEntry[];
  addHistoryEntry: (date: string, description: string) => Promise<void>;
  deleteHistoryEntry: (id: string) => Promise<void>;
}

export function HistoryDialog({ history, addHistoryEntry, deleteHistoryEntry }: HistoryDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newDate, setNewDate] = useState<Date | undefined>(new Date())
  const [newDescription, setNewDescription] = useState('')

  const handleAddEntry = async () => {
    if (newDate && newDescription) {
      await addHistoryEntry(format(newDate, 'yyyy-MM-dd'), newDescription)
      setNewDescription('')
      setNewDate(new Date())
      setIsDialogOpen(false) // Fecha o diálogo após adicionar
    }
  }

  const handleDeleteEntry = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro de histórico?')) {
      await deleteHistoryEntry(id)
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Ver Histórico</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Histórico de Eventos</DialogTitle>
          <DialogDescription>
            Visualize e gerencie os registros de eventos importantes da escala.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 flex-grow overflow-hidden">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="newDate" className="text-right">
              Data
            </Label>
            <div className="col-span-3">
              <DatePicker selectedDate={newDate} onSelectDate={setNewDate} />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="newDescription" className="text-right">
              Descrição
            </Label>
            <div className="col-span-3">
              <Textarea
                id="newDescription"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Descreva o evento..."
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleAddEntry} className="w-full">Adicionar Registro</Button>

          <h3 className="text-lg font-semibold mt-4">Registros Existentes:</h3>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            {history.length === 0 ? (
              <p className="text-center text-muted-foreground">Nenhum registro de histórico encontrado.</p>
            ) : (
              <div className="space-y-2">
                {history.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <p className="font-medium">{format(new Date(entry.date), 'PPP', { locale: ptBR })}</p>
                      <p className="text-sm text-muted-foreground">{entry.description}</p>
                    </div>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteEntry(entry.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => setIsDialogOpen(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
