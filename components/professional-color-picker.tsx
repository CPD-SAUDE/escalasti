'use client'

import * as React from 'react'
import { SketchPicker, ColorResult } from 'react-color'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface ProfessionalColorPickerProps {
  color: string
  onChange: (color: string) => void
  className?: string
}

export function ProfessionalColorPicker({ color, onChange, className }: ProfessionalColorPickerProps) {
  const [displayColorPicker, setDisplayColorPicker] = React.useState(false)

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker)
  }

  const handleClose = () => {
    setDisplayColorPicker(false)
  }

  const handleChange = (newColor: ColorResult) => {
    onChange(newColor.hex)
  }

  return (
    <Popover open={displayColorPicker} onOpenChange={setDisplayColorPicker}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('w-full justify-start text-left font-normal', className)}
          onClick={handleClick}
        >
          <div
            className="w-6 h-6 rounded-full mr-2 border"
            style={{ backgroundColor: color }}
          />
          {color}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <SketchPicker color={color} onChange={handleChange} />
      </PopoverContent>
    </Popover>
  )
}
