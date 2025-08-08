'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Professional } from '@/lib/types'
import ProfessionalColorPicker from './professional-color-picker'
import { Trash2, PlusCircle } from 'lucide-react'

interface ProfessionalManagementProps {
  professionals: Professional[]
  addProfessional: (name: string, color: string) => Promise<void>
  updateProfessional: (id: string, name: string, color: string) => Promise<void>
  deleteProfessional: (id: string) => Promise<void>
}

export default function ProfessionalManagement({
  professionals,
  addProfessional,
  updateProfessional,
  deleteProfessional,
}: ProfessionalManagementProps) {
  const [newProfessionalName, setNewProfessionalName] = useState('')
  const [newProfessionalColor, setNewProfessionalColor] = useState('#60A5FA') // Default blue color
  const [editingProfessionalId, setEditingProfessionalId] = useState<string | null>(null)
  const [editingProfessionalName, setEditingProfessionalName] = useState('')
  const [editingProfessionalColor, setEditingProfessionalColor] = useState('')

  const handleAddProfessional = async () => {
    if (newProfessionalName.trim()) {
      await addProfessional(newProfessionalName.trim(), newProfessionalColor)
      setNewProfessionalName('')
      setNewProfessionalColor('#60A5FA')
    }
  }

  const handleEditClick = (professional: Professional) => {
    setEditingProfessionalId(professional.id)
    setEditingProfessionalName(professional.name)
    setEditingProfessionalColor(professional.color)
  }

  const handleUpdateProfessional = async (id: string) => {
    if (editingProfessionalName.trim()) {
      await updateProfessional(id, editingProfessionalName.trim(), editingProfessionalColor)
      setEditingProfessionalId(null)
    }
  }

  const handleDeleteProfessional = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este profissional? Isso removerá ele da escala.')) {
      await deleteProfessional(id)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="new-professional-name">Novo Profissional</Label>
        <Input
          id="new-professional-name"
          placeholder="Nome do profissional"
          value={newProfessionalName}
          onChange={(e) => setNewProfessionalName(e.target.value)}
        />
        <ProfessionalColorPicker color={newProfessionalColor} onChange={setNewProfessionalColor} />
        <Button onClick={handleAddProfessional} className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Profissional
        </Button>
      </div>

      <h3 className="text-lg font-semibold mt-4">Profissionais Existentes</h3>
      <ScrollArea className="h-[200px] pr-4">
        <div className="space-y-3">
          {professionals.length === 0 ? (
            <p className="text-center text-muted-foreground">Nenhum profissional cadastrado.</p>
          ) : (
            professionals.map((professional) => (
              <div key={professional.id} className="flex items-center justify-between p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
                {editingProfessionalId === professional.id ? (
                  <div className="flex-1 grid grid-cols-1 gap-2">
                    <Input
                      value={editingProfessionalName}
                      onChange={(e) => setEditingProfessionalName(e.target.value)}
                      onBlur={() => handleUpdateProfessional(professional.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleUpdateProfessional(professional.id)
                        }
                      }}
                    />
                    <ProfessionalColorPicker
                      color={editingProfessionalColor}
                      onChange={setEditingProfessionalColor}
                    />
                    <Button size="sm" onClick={() => handleUpdateProfessional(professional.id)}>Salvar</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingProfessionalId(null)}>Cancelar</Button>
                  </div>
                ) : (
                  <div
                    className="flex items-center flex-1 cursor-pointer"
                    onClick={() => handleEditClick(professional)}
                  >
                    <div
                      className="w-4 h-4 rounded-full mr-2 border"
                      style={{ backgroundColor: professional.color }}
                    />
                    <span className="font-medium">{professional.name}</span>
                  </div>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDeleteProfessional(professional.id)}
                  className="ml-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
