'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Professional } from '@/lib/types'
import { ProfessionalColorPicker } from './professional-color-picker'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Trash2, Edit, PlusCircle } from 'lucide-react'

interface ProfessionalManagementProps {
  professionals: Professional[]
  addProfessional: (name: string, defaultHours: number, color: string) => Promise<void>
  updateProfessional: (id: number, name: string, defaultHours: number, color: string) => Promise<void>
  deleteProfessional: (id: number) => Promise<void>
  loading: boolean
}

export function ProfessionalManagement({
  professionals,
  addProfessional,
  updateProfessional,
  deleteProfessional,
  loading
}: ProfessionalManagementProps) {
  const [newProfessionalName, setNewProfessionalName] = useState('')
  const [newProfessionalHours, setNewProfessionalHours] = useState(8)
  const [newProfessionalColor, setNewProfessionalColor] = useState('#4ECDC4')

  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null)
  const [editName, setEditName] = useState('')
  const [editHours, setEditHours] = useState(0)
  const [editColor, setEditColor] = useState('')

  const handleAddProfessional = async () => {
    if (newProfessionalName.trim()) {
      await addProfessional(newProfessionalName.trim(), newProfessionalHours, newProfessionalColor)
      setNewProfessionalName('')
      setNewProfessionalHours(8)
      setNewProfessionalColor('#4ECDC4')
    }
  }

  const handleEditProfessional = (professional: Professional) => {
    setEditingProfessional(professional)
    setEditName(professional.name)
    setEditHours(professional.defaultHours || 0)
    setEditColor(professional.color || '#000000')
  }

  const handleUpdateProfessional = async () => {
    if (editingProfessional && editName.trim()) {
      await updateProfessional(editingProfessional.id, editName.trim(), editHours, editColor)
      setEditingProfessional(null)
    }
  }

  const handleDeleteProfessional = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este profissional?')) {
      await deleteProfessional(id)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Profissionais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Adicionar Profissional */}
        <div className="grid gap-4 border p-4 rounded-md">
          <h3 className="text-lg font-semibold">Adicionar Novo Profissional</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="newProfessionalName">Nome</Label>
              <Input
                id="newProfessionalName"
                value={newProfessionalName}
                onChange={(e) => setNewProfessionalName(e.target.value)}
                placeholder="Nome do profissional"
              />
            </div>
            <div>
              <Label htmlFor="newProfessionalHours">Horas Padrão</Label>
              <Input
                id="newProfessionalHours"
                type="number"
                value={newProfessionalHours}
                onChange={(e) => setNewProfessionalHours(parseInt(e.target.value))}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="newProfessionalColor">Cor</Label>
              <ProfessionalColorPicker color={newProfessionalColor} setColor={setNewProfessionalColor} />
            </div>
          </div>
          <Button onClick={handleAddProfessional} disabled={loading}>
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Profissional
          </Button>
        </div>

        {/* Lista de Profissionais */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Profissionais Cadastrados</h3>
          {loading ? (
            <p>Carregando profissionais...</p>
          ) : (
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              {professionals.length === 0 ? (
                <p className="text-center text-gray-500">Nenhum profissional cadastrado.</p>
              ) : (
                <div className="grid gap-4">
                  {professionals.map((professional) => (
                    <div
                      key={professional.id}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: professional.color || '#cccccc' }}
                        />
                        <div>
                          <p className="font-medium">{professional.name}</p>
                          <p className="text-sm text-gray-500">
                            {professional.defaultHours || 0}h padrão
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProfessional(professional)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProfessional(professional.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          )}
        </div>

        {/* Dialog de Edição */}
        {editingProfessional && (
          <Dialog open={!!editingProfessional} onOpenChange={() => setEditingProfessional(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Profissional</DialogTitle>
                <DialogDescription>
                  Altere os detalhes do profissional selecionado.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="editName" className="text-right">
                    Nome
                  </Label>
                  <Input
                    id="editName"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="editHours" className="text-right">
                    Horas Padrão
                  </Label>
                  <Input
                    id="editHours"
                    type="number"
                    value={editHours}
                    onChange={(e) => setEditHours(parseInt(e.target.value))}
                    className="col-span-3"
                    min="0"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="editColor" className="text-right">
                    Cor
                  </Label>
                  <div className="col-span-3">
                    <ProfessionalColorPicker color={editColor} setColor={setEditColor} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingProfessional(null)}>Cancelar</Button>
                <Button onClick={handleUpdateProfessional}>Salvar Alterações</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  )
}
