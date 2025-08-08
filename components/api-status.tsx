'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CircleCheck, CircleX, Loader2 } from 'lucide-react'
import { getApiStatus } from '@/lib/api'

export default function ApiStatus() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Verificando status da API...')

  useEffect(() => {
    checkStatus()
    const interval = setInterval(checkStatus, 10000) // Verifica a cada 10 segundos
    return () => clearInterval(interval)
  }, [])

  const checkStatus = async () => {
    setStatus('loading')
    setMessage('Verificando status da API...')
    try {
      const response = await getApiStatus()
      if (response.status === 'Backend is running!') {
        setStatus('success')
        setMessage('API do Backend está online e conectada ao banco de dados.')
      } else {
        setStatus('error')
        setMessage('API do Backend está offline ou com problemas de conexão.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Não foi possível conectar à API do Backend. Verifique a rede e o servidor.')
      console.error('Erro ao verificar status da API:', error)
    }
  }

  return (
    <Alert className="w-auto max-w-md">
      {status === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
      {status === 'success' && <CircleCheck className="h-4 w-4 text-green-500" />}
      {status === 'error' && <CircleX className="h-4 w-4 text-red-500" />}
      <AlertTitle>Status da API</AlertTitle>
      <AlertDescription>
        {message}
      </AlertDescription>
      <Button
        variant="ghost"
        size="sm"
        onClick={checkStatus}
        className="ml-auto"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Verificando...' : 'Tentar Novamente'}
      </Button>
    </Alert>
  )
}
