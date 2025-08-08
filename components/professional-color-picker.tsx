"use client"

import * as React from "react"
import { Check, Palette } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ProfessionalColorPickerProps {
  color: string
  setColor: (color: string) => void
}

const colors = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8AA",
  "#FFD700", "#DA70D6", "#87CEEB", "#F08080", "#ADD8E6",
  "#FFB6C1", "#90EE90", "#DDA0DD", "#AFEEEE", "#FFC0CB",
  "#7B68EE", "#EE82EE", "#6A5ACD", "#BA55D3", "#4682B4"
]

export function ProfessionalColorPicker({ color, setColor }: ProfessionalColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <div
            className="w-4 h-4 rounded-full mr-2 border"
            style={{ backgroundColor: color }}
          />
          <span>{color}</span>
          <Palette className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="grid grid-cols-5 gap-2 p-2">
          {colors.map((c) => (
            <div
              key={c}
              className={cn(
                "w-8 h-8 rounded-full cursor-pointer flex items-center justify-center border",
                color === c && "ring-2 ring-offset-2 ring-primary"
              )}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            >
              {color === c && <Check className="h-4 w-4 text-white" />}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
