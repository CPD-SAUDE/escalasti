import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { HistoryEntry } from '@/lib/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface HistoryDialogProps {
  isOpen: boolean
  onClose: () => void
  history: HistoryEntry[]
  isLoading: boolean
  error: Error | null
}

export default function HistoryDialog({
  isOpen,
  onClose,
  history,
  isLoading,
  error,
}: HistoryDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Histórico de Alterações</DialogTitle>
          <DialogDescription>
            Visualize as últimas alterações realizadas no sistema.
          </DialogDescription>
        </DialogHeader>
        {isLoading && <div className="text-center">Carregando histórico...</div>}
        {error && (
          <div className="text-center text-red-500">
            Erro ao carregar histórico: {error.message}
          </div>
        )}
        {!isLoading && !error && (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {history.length === 0 ? (
                <p className="text-center text-gray-500">Nenhum histórico encontrado.</p>
              ) : (
                history.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-md border p-3 text-sm shadow-sm"
                  >
                    <p className="font-medium">Ação: {entry.action}</p>
                    <p className="text-gray-600">
                      Detalhes:{' '}
                      <span className="font-mono text-xs">
                        {JSON.stringify(entry.details, null, 2)}
                      </span>
                    </p>
                    <p className="text-right text-xs text-gray-500">
                      {format(
                        new Date(entry.timestamp),
                        "dd/MM/yyyy HH:mm:ss",
                        { locale: ptBR }
                      )}
                    </p>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}
