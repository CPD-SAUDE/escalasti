'use client'

import { useState } from 'react'
import { useProfessionals } from '@/hooks/use-professionals'
import { Professional } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Trash2, PlusCircle, Save, Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { ProfessionalColorPicker } from './professional-color-picker'

export function ProfessionalManagement() {
  const { professionals, addProfessional, updateProfessional, deleteProfessional, loading, error } = useProfessionals()
  const [newProfessionalName, setNewProfessionalName] = useState('')
  const [newProfessionalHours, setNewProfessionalHours] = useState<number>(0)
  const [newProfessionalColor, setNewProfessionalColor] = useState('#000000')
  const [editingProfessionalId, setEditingProfessionalId] = useState<number | null>(null)
  const [editingProfessionalName, setEditingProfessionalName] = useState('')
  const [editingProfessionalHours, setEditingProfessionalHours] = useState<number>(0)
  const [editingProfessionalColor, setEditingProfessionalColor] = useState('#000000')

  const handleAddProfessional = async () => {
    if (newProfessionalName.trim()) {
      await addProfessional({
        name: newProfessionalName.trim(),
        defaultHours: newProfessionalHours,
        color: newProfessionalColor,
      })
      setNewProfessionalName('')
      setNewProfessionalHours(0)
      setNewProfessionalColor('#000000')
    }
  }

  const startEditing = (professional: Professional) => {
    setEditingProfessionalId(professional.id)
    setEditingProfessionalName(professional.name)
    setEditingProfessionalHours(professional.defaultHours)
    setEditingProfessionalColor(professional.color)
  }

  const cancelEditing = () => {
    setEditingProfessionalId(null)
    setEditingProfessionalName('')
    setEditingProfessionalHours(0)
    setEditingProfessionalColor('#000000')
  }

  const handleUpdateProfessional = async (id: number) => {
    if (editingProfessionalName.trim()) {
      await updateProfessional(id, {
        name: editingProfessionalName.trim(),
        defaultHours: editingProfessionalHours,
        color: editingProfessionalColor,
      })
      cancelEditing()
    }
  }

  const handleDeleteProfessional = async (id: number) => {
    await deleteProfessional(id)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando profissionais...</span>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 text-center">Erro ao carregar profissionais: {error}</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">Adicionar Novo Profissional</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="newProfessionalName">Nome</Label>
              <Input
                id="newProfessionalName"
                value={newProfessionalName}
                onChange={(e) => setNewProfessionalName(e.target.value)}
                placeholder="Nome do profissional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newProfessionalHours">Horas Padrão</Label>
              <Input
                id="newProfessionalHours"
                type="number"
                value={newProfessionalHours}
                onChange={(e) => setNewProfessionalHours(parseInt(e.target.value) || 0)}
                placeholder="Horas padrão"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newProfessionalColor">Cor</Label>
              <ProfessionalColorPicker
                color={newProfessionalColor}
                onChange={setNewProfessionalColor}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleAddProfessional} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" /> Adicionar
          </Button>
        </CardFooter>
      </Card>

      <h3 className="text-lg font-semibold">Profissionais Cadastrados</h3>
      {professionals.length === 0 ? (
        <p className="text-center text-muted-foreground">Nenhum profissional cadastrado.</p>
      ) : (
        <ScrollArea className="h-[400px] border rounded-md p-4">
          <div className="space-y-4">
            {professionals.map((professional) => (
              <Card key={professional.id} className="p-4">
                {editingProfessionalId === professional.id ? (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                      <Label htmlFor={`editName-${professional.id}`}>Nome</Label>
                      <Input
                        id={`editName-${professional.id}`}
                        value={editingProfessionalName}
                        onChange={(e) => setEditingProfessionalName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`editHours-${professional.id}`}>Horas Padrão</Label>
                      <Input
                        id={`editHours-${professional.id}`}
                        type="number"
                        value={editingProfessionalHours}
                        onChange={(e) => setEditingProfessionalHours(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`editColor-${professional.id}`}>Cor</Label>
                      <ProfessionalColorPicker
                        color={editingProfessionalColor}
                        onChange={setEditingProfessionalColor}
                        className="w-full"
                      />
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <Button size="sm" onClick={() => handleUpdateProfessional(professional.id)} className="flex items-center gap-1">
                        <Save className="h-4 w-4" /> Salvar
                      </Button>
                      <Button variant="outline" size="sm" onClick={cancelEditing}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: professional.color }}
                      />
                      <div>
                        <p className="font-medium">{professional.name}</p>
                        <p className="text-sm text-muted-foreground">{professional.defaultHours} horas padrão</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => startEditing(professional)}>
                        Editar
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. Isso excluirá permanentemente o profissional{' '}
                              <span className="font-bold">{professional.name}</span> e o removerá de todas as escalas.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteProfessional(professional.id)}>
                              Deletar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
