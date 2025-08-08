'use client'

import { useState } from 'react'
import { Professional } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ProfessionalColorPicker } from './professional-color-picker'
import { Trash2, Edit, PlusCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'

interface ProfessionalManagementProps {
  professionals: Professional[]
  addProfessional: (name: string, color: string) => Promise<void>
  updateProfessional: (id: number, name: string, color: string) => Promise<void>
  deleteProfessional: (id: number) => Promise<void>
}

export default function ProfessionalManagement({
  professionals,
  addProfessional,
  updateProfessional,
  deleteProfessional,
}: ProfessionalManagementProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentProfessional, setCurrentProfessional] = useState<Professional | null>(null)
  const [name, setName] = useState('')
  const [color, setColor] = useState('#4ECDC4') // Default color
  const [error, setError] = useState<string | null>(null)

  const handleOpenDialog = (professional?: Professional) => {
    setError(null)
    if (professional) {
      setCurrentProfessional(professional)
      setName(professional.name)
      setColor(professional.color)
    } else {
      setCurrentProfessional(null)
      setName('')
      setColor('#4ECDC4') // Reset to default for new
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async () => {
    setError(null)
    if (!name.trim()) {
      setError('O nome do profissional é obrigatório.')
      return
    }
    if (!color) {
      setError('A cor do profissional é obrigatória.')
      return
    }

    try {
      if (currentProfessional) {
        await updateProfessional(currentProfessional.id, name, color)
      } else {
        await addProfessional(name, color)
      }
      setIsDialogOpen(false)
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao salvar o profissional.')
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este profissional?')) {
      try {
        await deleteProfessional(id)
      } catch (err: any) {
        setError(err.message || 'Ocorreu um erro ao excluir o profissional.')
      }
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Profissionais</CardTitle>
        <Button onClick={() => handleOpenDialog()} size="sm">
          <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Profissional
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="grid gap-4">
          {professionals.length === 0 ? (
            <p className="text-center text-gray-500">Nenhum profissional cadastrado.</p>
          ) : (
            professionals.map((professional) => (
              <div
                key={professional.id}
                className="flex items-center justify-between rounded-md border p-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-6 w-6 rounded-full border"
                    style={{ backgroundColor: professional.color }}
                  />
                  <span className="font-medium">{professional.name}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleOpenDialog(professional)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(professional.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Excluir</span>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {currentProfessional ? 'Editar Profissional' : 'Adicionar Profissional'}
              </DialogTitle>
              <DialogDescription>
                {currentProfessional
                  ? 'Faça alterações no profissional existente aqui.'
                  : 'Adicione um novo profissional à sua lista.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color" className="text-right">
                  Cor
                </Label>
                <div className="col-span-3">
                  <ProfessionalColorPicker selectedColor={color} onSelectColor={setColor} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSubmit}>
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
