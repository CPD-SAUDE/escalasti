"use client";

import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScaleData } from "@/lib/types";
import { Loader2 } from 'lucide-react';

interface HistoryDialogProps {
  history: ScaleData[];
  onLoadHistory: (record: ScaleData) => void;
  loading?: boolean;
}

export function HistoryDialog({ history, onLoadHistory, loading = false }: HistoryDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Carregando...
            </>
          ) : (
            'Ver Histórico'
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Histórico de Escalas</DialogTitle>
          <DialogDescription>
            Visualize e carregue escalas salvas anteriormente.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="grid gap-4 py-4">
            {history.length === 0 ? (
              <p className="text-muted-foreground text-center">Nenhuma escala salva no histórico ainda.</p>
            ) : (
              history
                .sort((a, b) => parseISO(b.created_at).getTime() - parseISO(a.created_at).getTime())
                .map((record, index) => (
                  <div key={record.id || index} className="flex items-center justify-between p-3 border rounded-md bg-card">
                    <div>
                      <p className="font-medium">
                        Escala de {format(parseISO(record.month_year + "-01"), "MMMM 'de' yyyy", { locale: ptBR })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Salva em: {format(parseISO(record.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {record.schedule_data.length} entradas • {record.professionals_data.length} profissionais
                      </p>
                    </div>
                    <Button onClick={() => onLoadHistory(record)} size="sm">
                      Carregar
                    </Button>
                  </div>
                ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
