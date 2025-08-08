'use client'

import { HexColorPicker } from 'react-colorful'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ProfessionalColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export default function ProfessionalColorPicker({ color, onChange }: ProfessionalColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !color && 'text-muted-foreground'
          )}
        >
          <div
            className="w-4 h-4 rounded-full mr-2 border"
            style={{ backgroundColor: color }}
          />
          {color || 'Selecione uma cor'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <HexColorPicker color={color} onChange={onChange} />
      </PopoverContent>
    </Popover>
  )
}
