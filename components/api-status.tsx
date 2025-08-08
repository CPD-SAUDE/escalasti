'use client'

import { useEffect, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CircleCheck, CircleX } from 'lucide-react'
import { getApiStatus } from '@/lib/api'

export function ApiStatus() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Verificando status da API...')

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await getApiStatus()
        if (response.status === 'Backend is running!') {
          setStatus('success')
          setMessage('API do Backend está online.')
        } else {
          setStatus('error')
          setMessage('API do Backend retornou um status inesperado.')
        }
      } catch (error) {
        console.error('Erro ao verificar status da API:', error)
        setStatus('error')
        setMessage('Não foi possível conectar à API do Backend. Verifique se o backend está rodando.')
      }
    }

    checkStatus()
    const interval = setInterval(checkStatus, 15000); // Verifica a cada 15 segundos
    return () => clearInterval(interval);
  }, [])

  return (
    <Alert variant={status === 'success' ? 'default' : 'destructive'} className="w-fit px-4 py-2">
      {status === 'success' ? (
        <CircleCheck className="h-4 w-4 text-green-500" />
      ) : (
        <CircleX className="h-4 w-4 text-red-500" />
      )}
      <AlertTitle className="text-sm font-medium">Status da API</AlertTitle>
      <AlertDescription className="text-xs">
        {message}
      </AlertDescription>
    </Alert>
  )
}
