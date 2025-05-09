"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "~/lib/utils" // Adjusted path

interface CustomSelectProps {
  label?: string
  value: string
  onChange: (value: string) => void
  options: {
    value: string
    label: string
  }[]
  className?: string
}

export function CustomSelect({ label, value, onChange, options, className }: CustomSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const selectRef = React.useRef<HTMLDivElement>(null)

  // Close the dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const selectedOption = options.find((option) => option.value === value)

  return (
    <div className={cn("relative", className)} ref={selectRef}>
      {label && <div className="text-sm text-gray-500 mb-1">{label}</div>}

      <button
        type="button"
        className="flex items-center justify-between w-full px-4 py-2 text-left bg-white rounded-full border border-gray-300 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption?.label || "Select an option"}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="py-2 px-4 text-gray-500 border-b">Ausgewählt</div>
          <ul className="max-h-60 overflow-auto">
            {options.map((option) => (
              <li
                key={option.value}
                className={cn(
                  "px-4 py-2 cursor-pointer hover:bg-gray-100",
                  option.value === value ? "bg-blue-500 text-white" : "",
                )}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}