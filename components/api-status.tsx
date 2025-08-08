'use client'

import { useEffect, useState } from 'react'
import { CircleCheck, CircleX, Loader2 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

export default function ApiStatus() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Verificando status da API...')

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
        const response = await fetch(apiUrl.replace('/api', '/')) // Acessa a rota raiz do backend
        if (response.ok) {
          setStatus('success')
          setMessage('API online')
        } else {
          setStatus('error')
          setMessage(`API offline: ${response.status} ${response.statusText}`)
        }
      } catch (error: any) {
        setStatus('error')
        setMessage(`API offline: ${error.message}`)
      }
    }

    checkApiStatus()
    const interval = setInterval(checkApiStatus, 10000) // Verifica a cada 10 segundos

    return () => clearInterval(interval)
  }, [])

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
      case 'success':
        return <CircleCheck className="h-4 w-4 text-green-500" />
      case 'error':
        return <CircleX className="h-4 w-4 text-red-500" />
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            {getIcon()}
            <span className="sr-only">{message}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
