'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'

export function ApiStatus() {
  const [status, setStatus] = useState('Verificando...')
  const [variant, setVariant] = useState<'default' | 'secondary' | 'destructive' | 'outline' | 'success' | null | undefined>('secondary')

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
        const response = await fetch(`${apiUrl}/status`)
        if (response.ok) {
          const data = await response.json()
          setStatus(`Online: ${data.status}`)
          setVariant('success')
        } else {
          setStatus('Offline')
          setVariant('destructive')
        }
      } catch (error) {
        setStatus('Offline (Erro de conexão)')
        setVariant('destructive')
        console.error('Erro ao verificar status da API:', error)
      }
    }

    checkApiStatus()
    const interval = setInterval(checkApiStatus, 30000); // Verifica a cada 30 segundos

    return () => clearInterval(interval);
  }, [])

  return (
    <Badge variant={variant} className="text-sm">
      Status da API: {status}
    </Badge>
  )
}
