'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ProfessionalColorPicker } from '@/components/professional-color-picker'
import { addProfessional, deleteProfessional, getAllProfessionals, updateProfessional } from '@/lib/api'
import { Professional } from '@/lib/types'
import { Trash2, Edit, Save, XCircle } from 'lucide-react'

export function ProfessionalManagement() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [newProfessionalName, setNewProfessionalName] = useState('')
  const [newProfessionalColor, setNewProfessionalColor] = useState('#FF6B6B') // Default color
  const [editingProfessionalId, setEditingProfessionalId] = useState<number | null>(null)
  const [editingProfessionalName, setEditingProfessionalName] = useState('')
  const [editingProfessionalColor, setEditingProfessionalColor] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfessionals = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getAllProfessionals()
      setProfessionals(data)
    } catch (err) {
      setError('Erro ao carregar profissionais.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProfessionals()
  }, [])

  const handleAddProfessional = async () => {
    if (!newProfessionalName.trim()) {
      setError('O nome do profissional não pode ser vazio.')
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      await addProfessional({ name: newProfessionalName, color: newProfessionalColor })
      setNewProfessionalName('')
      setNewProfessionalColor('#FF6B6B') // Reset to default
      await fetchProfessionals()
    } catch (err) {
      setError('Erro ao adicionar profissional.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProfessional = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja remover este profissional?')) {
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      await deleteProfessional(id)
      await fetchProfessionals()
    } catch (err) {
      setError('Erro ao remover profissional.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditClick = (professional: Professional) => {
    setEditingProfessionalId(professional.id)
    setEditingProfessionalName(professional.name)
    setEditingProfessionalColor(professional.color)
  }

  const handleSaveEdit = async (id: number) => {
    if (!editingProfessionalName.trim()) {
      setError('O nome do profissional não pode ser vazio.')
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      await updateProfessional(id, { name: editingProfessionalName, color: editingProfessionalColor })
      setEditingProfessionalId(null)
      setEditingProfessionalName('')
      setEditingProfessionalColor('')
      await fetchProfessionals()
    } catch (err) {
      setError('Erro ao atualizar profissional.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingProfessionalId(null)
    setEditingProfessionalName('')
    setEditingProfessionalColor('')
    setError(null) // Clear any edit-related errors
  }

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Gerenciar Profissionais</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="newProfessionalName">Nome do Profissional</Label>
          <Input
            id="newProfessionalName"
            placeholder="Nome completo"
            value={newProfessionalName}
            onChange={(e) => setNewProfessionalName(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="newProfessionalColor">Cor</Label>
          <ProfessionalColorPicker
            selectedColor={newProfessionalColor}
            onSelectColor={setNewProfessionalColor}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button onClick={handleAddProfessional} disabled={isLoading}>
          {isLoading ? 'Adicionando...' : 'Adicionar Profissional'}
        </Button>

        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          <div className="space-y-4">
            {professionals.length === 0 && !isLoading && <p className="text-center text-muted-foreground">Nenhum profissional cadastrado.</p>}
            {professionals.map((professional) => (
              <div key={professional.id} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                {editingProfessionalId === professional.id ? (
                  <div className="flex-1 grid gap-2 pr-2">
                    <Input
                      value={editingProfessionalName}
                      onChange={(e) => setEditingProfessionalName(e.target.value)}
                      disabled={isLoading}
                    />
                    <ProfessionalColorPicker
                      selectedColor={editingProfessionalColor}
                      onSelectColor={setEditingProfessionalColor}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: professional.color }}
                    />
                    <span className="font-medium">{professional.name}</span>
                  </div>
                )}
                <div className="flex gap-1">
                  {editingProfessionalId === professional.id ? (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => handleSaveEdit(professional.id)} disabled={isLoading}>
                        <Save className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handleCancelEdit} disabled={isLoading}>
                        <XCircle className="h-4 w-4 text-gray-500" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(professional)} disabled={isLoading}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteProfessional(professional.id)} disabled={isLoading}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
