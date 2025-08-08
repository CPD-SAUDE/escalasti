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
import { History, Trash2 } from 'lucide-react'
import { HistoryEntry } from '@/lib/types'
import { DatePicker } from './date-picker'
import { Textarea } from './ui/textarea'

interface HistoryDialogProps {
  history: HistoryEntry[]
  addHistoryEntry: (date: string, description: string) => Promise<void>
  deleteHistoryEntry: (id: string) => Promise<void>
}

export default function HistoryDialog({ history, addHistoryEntry, deleteHistoryEntry }: HistoryDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newDate, setNewDate] = useState<Date | undefined>(new Date())
  const [newDescription, setNewDescription] = useState('')

  const handleAddEntry = async () => {
    if (newDate && newDescription.trim()) {
      await addHistoryEntry(format(newDate, 'yyyy-MM-dd'), newDescription.trim())
      setNewDate(new Date())
      setNewDescription('')
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
        <Button variant="outline" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Histórico
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Histórico de Eventos</DialogTitle>
          <DialogDescription>
            Visualize e gerencie os registros de eventos importantes.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 flex-shrink-0">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-date" className="text-right">
              Data
            </Label>
            <div className="col-span-3">
              <DatePicker date={newDate} setDate={setNewDate} />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-description" className="text-right">
              Descrição
            </Label>
            <Textarea
              id="new-description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="col-span-3"
              placeholder="Descreva o evento..."
            />
          </div>
          <Button onClick={handleAddEntry} className="col-span-4">Adicionar Registro</Button>
        </div>

        <h3 className="text-lg font-semibold mt-4 mb-2 flex-shrink-0">Registros Existentes</h3>
        <ScrollArea className="flex-grow pr-4">
          <div className="space-y-4">
            {history.length === 0 ? (
              <p className="text-center text-muted-foreground">Nenhum registro de histórico encontrado.</p>
            ) : (
              history.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                  <div>
                    <p className="text-sm font-medium">
                      {format(new Date(entry.date + 'T00:00:00'), 'PPP', { locale: ptBR })}
                    </p>
                    <p className="text-muted-foreground text-sm">{entry.description}</p>
                  </div>
                  <Button variant="destructive" size="icon" onClick={() => handleDeleteEntry(entry.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="flex-shrink-0 mt-4">
          <Button type="button" onClick={() => setIsDialogOpen(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
