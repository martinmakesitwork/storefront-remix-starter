"use client"
import * as React from "react" // Added React import
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn, formatCurrency } from "~/lib/utils" // Adjusted path

interface PriceRangeSliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> { // Made props more specific
  min: number
  max: number
  step?: number
  value: [number, number]
  onValueChange: (value: [number, number]) => void
  // className is already part of ComponentPropsWithoutRef
}

export function PriceRangeSlider({
  min,
  max,
  step = 100, // Default step from example
  value,
  onValueChange,
  className,
  ...props // Spread remaining props to SliderPrimitive.Root
}: PriceRangeSliderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <SliderPrimitive.Root
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={onValueChange}
        className={cn( // Ensure className from props is applied here too
          "relative flex w-full touch-none select-none items-center",
          className // This was missing in the example, added for consistency
        )}
        {...props} // Spread other props
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-gray-200">
          <SliderPrimitive.Range className="absolute h-full bg-gray-900" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-gray-200 bg-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950" />
        <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-gray-200 bg-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950" />
      </SliderPrimitive.Root>
      <div className="flex items-center justify-between">
        <span className="text-sm">{formatCurrency(value[0], "EUR")}</span>
        <span className="text-sm">{formatCurrency(value[1], "EUR")}</span>
      </div>
    </div>
  )
}