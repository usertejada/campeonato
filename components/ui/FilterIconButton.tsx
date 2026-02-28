// src/components/ui/FilterIconButton.tsx
'use client'

import { Filter } from 'lucide-react'
import { useState } from 'react'

interface FilterOption {
  label: string
  value: string
}

interface FilterIconButtonProps {
  options: FilterOption[]
  onSelect: (value: string) => void
}

export function FilterIconButton({ options, onSelect }: FilterIconButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState('')

  const handleSelect = (value: string) => {
    setSelected(value)
    onSelect(value)
    setIsOpen(false)
  }

  const isFiltered = selected !== '' && selected !== 'all'

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-10 h-10 rounded-lg border flex items-center justify-center transition-colors
          ${isFiltered
            ? 'border-blue-500 bg-blue-50 text-blue-600'
            : 'border-gray-300 bg-white text-gray-500 hover:border-gray-400'
          }
        `}
      >
        <Filter size={18} />
        {/* Bolinha indicando filtro ativo */}
        {isFiltered && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`
                  w-full px-4 py-2.5 text-left text-sm transition hover:bg-gray-50
                  ${selected === option.value ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'}
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