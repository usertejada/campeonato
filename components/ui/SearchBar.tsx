// src/components/ui/SearchBar.tsx
'use client'

import { Search, X } from 'lucide-react'
import { useState } from 'react'
import { Input } from './Input'
import { Icon } from './Icon'

interface SearchBarProps {
  placeholder?: string
  onSearch: (value: string) => void
  size?: 'sm' | 'md' | 'lg' | 'full'
  className?: string
}

export function SearchBar({
  placeholder = 'Buscar...',
  onSearch,
  size = 'md',
  className = ''
}: SearchBarProps) {
  const [value, setValue] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    onSearch(e.target.value)
  }

  const handleClear = () => {
    setValue('')
    onSearch('')
  }

  const sizes = {
    sm:   'w-48',
    md:   'w-72',
    lg:   'w-96',
    full: 'w-full',
  }

  return (
    <div className={`relative ${sizes[size]} ${className}`}>
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        icon={Search}
        iconPosition="left"
        className={`w-full${value ? ' pr-9' : ''}`}
      />
      {value && (
        <Icon
          icon={X}
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          onClick={handleClear}
        />
      )}
    </div>
  )
}