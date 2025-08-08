'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Terminal, CheckCircle, XCircle } from 'lucide-react'

export function ApiStatus() {
  const [backendStatus, setBackendStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [backendMessage, setBackendMessage] = useState('Verificando status do backend...')
  const [backendUrl, setBackendUrl] = useState('')

  useEffect(() => {
    const checkBackendStatus = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      setBackendUrl(apiUrl);
      try {
        const response = await fetch(`${apiUrl}/status`);
        if (response.ok) {
          const data = await response.json();
          setBackendStatus('success');
          setBackendMessage(`Backend está online! ${data.database ? 'Banco de dados conectado.' : ''}`);
        } else {
          setBackendStatus('error');
          setBackendMessage(`Backend offline ou erro: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        setBackendStatus('error');
        setBackendMessage(`Não foi possível conectar ao backend. Verifique se o servidor está rodando em ${apiUrl}.`);
        console.error('Erro ao verificar status do backend:', error);
      }
    };

    checkBackendStatus();
    const interval = setInterval(checkBackendStatus, 10000); // Verifica a cada 10 segundos
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    if (backendStatus === 'loading') return <Terminal className="h-4 w-4" />;
    if (backendStatus === 'success') return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusColor = () => {
    if (backendStatus === 'loading') return 'text-yellow-500';
    if (backendStatus === 'success') return 'text-green-500';
    return 'text-red-500';
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className={`flex items-center gap-2 ${getStatusColor()}`}>
          {getStatusIcon()}
          Status da API
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Status da Conexão com a API</DialogTitle>
          <DialogDescription>
            Informações sobre a conectividade do frontend com o servidor backend.
          </DialogDescription>
        </DialogHeader>
        <Alert variant={backendStatus === 'error' ? 'destructive' : 'default'}>
          {getStatusIcon()}
          <AlertTitle>Status do Backend</AlertTitle>
          <AlertDescription>
            <p>{backendMessage}</p>
            <p className="text-xs text-muted-foreground mt-2">URL da API: {backendUrl}</p>
          </AlertDescription>
        </Alert>
      </DialogContent>
    </Dialog>
  );
}
