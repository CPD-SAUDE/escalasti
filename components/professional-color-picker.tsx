'use client'

import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ProfessionalColorPickerProps {
  selectedColor: string
  onSelectColor: (color: string) => void
}

const colors = [
  '#FF6B6B', // Red
  '#4CAF50', // Green
  '#2196F3', // Blue
  '#FFC107', // Amber
  '#9C27B0', // Purple
  '#00BCD4', // Cyan
  '#FF9800', // Orange
  '#E91E63', // Pink
  '#607D8B', // Blue Grey
  '#795548', // Brown
  '#F44336', // Deep Red
  '#8BC34A', // Light Green
  '#03A9F4', // Light Blue
  '#FFEB3B', // Yellow
  '#673AB7', // Deep Purple
  '#009688', // Teal
  '#FF5722', // Deep Orange
  '#CDDC39', // Lime
]

export function ProfessionalColorPicker({ selectedColor, onSelectColor }: ProfessionalColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <div
            className="w-4 h-4 rounded-full mr-2 border"
            style={{ backgroundColor: selectedColor }}
          />
          {selectedColor || 'Selecione uma cor'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2 grid grid-cols-6 gap-1">
        {colors.map((color) => (
          <div
            key={color}
            className={cn(
              'w-6 h-6 rounded-full cursor-pointer border-2 border-transparent hover:border-primary',
              selectedColor === color && 'border-primary'
            )}
            style={{ backgroundColor: color }}
            onClick={() => {
              onSelectColor(color)
              setIsOpen(false)
            }}
          />
        ))}
      </PopoverContent>
    </Popover>
  )
}
