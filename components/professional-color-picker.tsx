'use client'

import { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface ProfessionalColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export function ProfessionalColorPicker({ color, onChange }: ProfessionalColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <div
            className={cn("mr-2 h-4 w-4 rounded-full border")}
            style={{ backgroundColor: color }}
          />
          {color}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <HexColorPicker color={color} onChange={onChange} />
      </PopoverContent>
    </Popover>
  )
}
