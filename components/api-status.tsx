'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Terminal, CheckCircle, XCircle } from 'lucide-react'
import { getConfig, updateConfig } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ApiStatus() {
  const [apiStatus, setApiStatus] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [networkIp, setNetworkIp] = useState<string>('')
  const [configError, setConfigError] = useState<string | null>(null)
  const [configSuccess, setConfigSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const checkApiStatus = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/status`)
      if (response.ok) {
        const data = await response.json()
        setApiStatus(data.status)
        setApiError(null)
      } else {
        setApiStatus('Offline')
        setApiError(`Erro: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      setApiStatus('Offline')
      setApiError('Não foi possível conectar ao backend. Verifique a URL da API e a rede.')
      console.error('Erro ao verificar status da API:', error)
    }
  }

  const fetchConfig = async () => {
    setIsLoading(true)
    setConfigError(null)
    try {
      const data = await getConfig()
      setNetworkIp(data.networkIp)
    } catch (err) {
      setConfigError('Erro ao carregar configuração de rede.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateNetworkIp = async () => {
    setIsLoading(true)
    setConfigError(null)
    setConfigSuccess(null)
    try {
      await updateConfig({ networkIp })
      setConfigSuccess('Configuração de rede atualizada com sucesso!')
    } catch (err) {
      setConfigError('Erro ao salvar configuração de rede.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkApiStatus()
    fetchConfig()
  }, [])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {apiStatus === 'Backend is running' ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
          Status da API
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Status da API e Configuração</DialogTitle>
          <DialogDescription>
            Verifique o status do backend e configure o IP da rede.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Status do Backend:</AlertTitle>
            <AlertDescription>
              {apiStatus === 'Backend is running' ? (
                <span className="text-green-600 font-medium">Online</span>
              ) : (
                <span className="text-red-600 font-medium">Offline</span>
              )}
              {apiError && <p className="text-red-500 text-sm mt-1">{apiError}</p>}
              <p className="text-xs text-muted-foreground mt-2">
                URL da API: {process.env.NEXT_PUBLIC_API_URL}
              </p>
            </AlertDescription>
          </Alert>

          <div className="grid gap-2">
            <Label htmlFor="networkIp">IP da Rede (para comunicação interna)</Label>
            <Input
              id="networkIp"
              value={networkIp}
              onChange={(e) => setNetworkIp(e.target.value)}
              placeholder="Ex: 192.168.1.100"
              disabled={isLoading}
            />
            {configError && <p className="text-red-500 text-sm">{configError}</p>}
            {configSuccess && <p className="text-green-500 text-sm">{configSuccess}</p>}
            <Button onClick={handleUpdateNetworkIp} disabled={isLoading} className="mt-2">
              {isLoading ? 'Salvando...' : 'Salvar Configuração'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
