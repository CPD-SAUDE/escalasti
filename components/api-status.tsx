'use client'

import { useState, useEffect } from 'react'
import { CircleCheck, CircleX } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export function ApiStatus() {
  const [isOnline, setIsOnline] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [lastCheck, setLastCheck] = useState<string | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

  useEffect(() => {
    const checkApiStatus = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${API_URL}/status`, { signal: AbortSignal.timeout(5000) }) // 5 second timeout
        if (response.ok) {
          setIsOnline(true)
        } else {
          setIsOnline(false)
        }
      } catch (error) {
        console.error('Erro ao verificar status da API:', error)
        setIsOnline(false)
      } finally {
        setIsLoading(false)
        setLastCheck(new Date().toLocaleTimeString())
      }
    }

    checkApiStatus()
    const interval = setInterval(checkApiStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [API_URL])

  const statusText = isLoading
    ? 'Verificando API...'
    : isOnline
      ? 'API Online'
      : 'API Offline'

  const statusIcon = isOnline ? (
    <CircleCheck className="h-5 w-5 text-green-500" />
  ) : (
    <CircleX className="h-5 w-5 text-red-500" />
  )

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 text-sm">
            {statusIcon}
            <span className="hidden sm:inline">{statusText}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{statusText}</p>
          {lastCheck && <p>Última verificação: {lastCheck}</p>}
          {!isOnline && <p>Verifique se o backend está rodando em {API_URL}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
