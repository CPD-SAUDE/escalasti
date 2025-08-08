'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { CircleCheck, CircleX, Loader2 } from 'lucide-react'

export function ApiStatus() {
  const [status, setStatus] = useState<'loading' | 'online' | 'offline'>('loading')
  const [message, setMessage] = useState('Verificando status da API...')

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
        const response = await fetch(`${apiUrl}/status`)
        if (response.ok) {
          const data = await response.json()
          setStatus('online')
          setMessage(data.message || 'API Online')
        } else {
          setStatus('offline')
          setMessage('API Offline: Erro ao conectar ou resposta inesperada.')
        }
      } catch (error) {
        setStatus('offline')
        setMessage('API Offline: Não foi possível conectar ao servidor.')
        console.error('Erro ao verificar status da API:', error)
      }
    }

    checkApiStatus()
    const interval = setInterval(checkApiStatus, 30000); // Verifica a cada 30 segundos

    return () => clearInterval(interval);
  }, [])

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin" />
      case 'online':
        return <CircleCheck className="h-4 w-4" />
      case 'offline':
        return <CircleX className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'bg-yellow-500 hover:bg-yellow-500/80'
      case 'online':
        return 'bg-green-500 hover:bg-green-500/80'
      case 'offline':
        return 'bg-red-500 hover:bg-red-500/80'
      default:
        return ''
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={`flex items-center gap-1 ${getStatusColor()}`}>
            {getStatusIcon()}
            {status === 'loading' ? 'Verificando...' : status === 'online' ? 'Online' : 'Offline'}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
