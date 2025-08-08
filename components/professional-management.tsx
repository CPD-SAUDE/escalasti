'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Professional } from '@/lib/types'
import { ProfessionalColorPicker } from './professional-color-picker'
import { Trash2, Edit } from 'lucide-react'
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
} from "@/components/ui/alert-dialog"

interface ProfessionalManagementProps {
  professionals: Professional[];
  addProfessional: (name: string, color: string) => Promise<void>;
  updateProfessional: (id: string, name: string, color: string) => Promise<void>;
  deleteProfessional: (id: string) => Promise<void>;
}

export function ProfessionalManagement({
  professionals,
  addProfessional,
  updateProfessional,
  deleteProfessional,
}: ProfessionalManagementProps) {
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState('#000000')
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null)

  const handleAddOrUpdateProfessional = async () => {
    if (editingProfessional) {
      await updateProfessional(editingProfessional.id, newName, newColor)
      setEditingProfessional(null)
    } else {
      await addProfessional(newName, newColor)
    }
    setNewName('')
    setNewColor('#000000')
  }

  const handleEditClick = (professional: Professional) => {
    setEditingProfessional(professional)
    setNewName(professional.name)
    setNewColor(professional.color)
  }

  const handleCancelEdit = () => {
    setEditingProfessional(null)
    setNewName('')
    setNewColor('#000000')
  }

  const handleDeleteClick = async (id: string) => {
    await deleteProfessional(id)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Profissionais</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="professionalName">Nome do Profissional</Label>
              <Input
                id="professionalName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex: João Silva"
              />
            </div>
            <div>
              <Label htmlFor="professionalColor">Cor</Label>
              <ProfessionalColorPicker color={newColor} onChange={setNewColor} />
            </div>
          </div>
          <Button onClick={handleAddOrUpdateProfessional}>
            {editingProfessional ? 'Atualizar Profissional' : 'Adicionar Profissional'}
          </Button>
          {editingProfessional && (
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancelar Edição
            </Button>
          )}
        </div>

        <h3 className="text-lg font-semibold mb-3">Profissionais Cadastrados:</h3>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          {professionals.length === 0 ? (
            <p className="text-center text-muted-foreground">Nenhum profissional cadastrado.</p>
          ) : (
            <div className="space-y-2">
              {professionals.map((professional) => (
                <div key={professional.id} className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center">
                    <div
                      className="h-5 w-5 rounded-full mr-3 border"
                      style={{ backgroundColor: professional.color }}
                    />
                    <span>{professional.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEditClick(professional)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso excluirá permanentemente o profissional
                            <span className="font-bold"> {professional.name} </span>
                            e removerá todas as suas atribuições na escala.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteClick(professional.id)}>
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
