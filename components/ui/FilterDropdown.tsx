// src/components/ui/FilterDropdown.tsx

'use client'

import { Filter, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface FilterOption {
  label: string
  value: string
}

interface FilterDropdownProps {
  options: FilterOption[]
  onSelect: (value: string) => void
  placeholder?: string
  className?: string
}

export function FilterDropdown({ 
  options, 
  onSelect, 
  placeholder = 'Filtros',
  className = '' 
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<string>('')

  const handleSelect = (value: string) => {
    setSelected(value)
    onSelect(value)
    setIsOpen(false)
  }

  const selectedLabel = options.find(opt => opt.value === selected)?.label || placeholder

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        icon={Filter as React.ElementType}
        iconPosition="left"
        onClick={() => setIsOpen(!isOpen)}
        className="w-40 justify-between"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex-1 text-left truncate text-sm">{selectedLabel}</span>
        <ChevronDown
          size={16}
          className={`text-gray-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`
                  w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition
                  ${selected === option.value ? 'text-blue-600 font-medium' : 'text-gray-700'}
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}