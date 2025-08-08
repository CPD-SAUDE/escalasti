import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface ProfessionalColorPickerProps {
  selectedColor: string
  onSelectColor: (color: string) => void
}

const colors = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#FED766', // Yellow
  '#FFA07A', // Light Salmon
  '#98D8AA', // Green
  '#C7CEEA', // Lavender
  '#FFD1DC', // Pink
  '#B0E0E6', // Powder Blue
  '#FFDAB9', // Peach
]

export function ProfessionalColorPicker({
  selectedColor,
  onSelectColor,
}: ProfessionalColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start"
          style={{ backgroundColor: selectedColor, color: '#FFF' }}
        >
          <div
            className="mr-2 h-4 w-4 rounded-full border"
            style={{ backgroundColor: selectedColor }}
          />
          {selectedColor}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <div className="grid grid-cols-5 gap-2">
          {colors.map((color) => (
            <Button
              key={color}
              variant="outline"
              size="icon"
              className={cn(
                'h-8 w-8 rounded-full border-2',
                selectedColor === color && 'ring-2 ring-offset-2',
              )}
              style={{ backgroundColor: color }}
              onClick={() => {
                onSelectColor(color)
                setIsOpen(false)
              }}
            >
              {selectedColor === color && <Check className="h-4 w-4 text-white" />}
              <span className="sr-only">{color}</span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
