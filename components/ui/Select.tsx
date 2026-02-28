// src/components/ui/Select.tsx
'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { ChevronDown, LucideIcon } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  label?: string
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  error?: string
  hint?: string
  icon?: LucideIcon
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  required?: boolean
  disabled?: boolean
  className?: string
  name?: string
}

const sizeClasses = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-4 py-4 text-base',
}

export function Select({
  label,
  options,
  value,
  onChange,
  placeholder,
  error,
  hint,
  icon: Icon,
  size = 'md',
  fullWidth = true,
  required,
  disabled,
  className = '',
  name,
}: SelectProps) {
  const [open, setOpen]               = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef      = useRef<HTMLUListElement>(null)

  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false)
        setFocusedIndex(-1)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (open && focusedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[focusedIndex] as HTMLElement
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [focusedIndex, open])

  const handleSelect = (opt: SelectOption) => {
    onChange?.(opt.value)
    setOpen(false)
    setFocusedIndex(-1)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (open && focusedIndex >= 0) handleSelect(options[focusedIndex])
        else setOpen((v) => !v)
        break
      case 'ArrowDown':
        e.preventDefault()
        if (!open) setOpen(true)
        setFocusedIndex((i) => Math.min(i + 1, options.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex((i) => Math.max(i - 1, 0))
        break
      case 'Escape':
        setOpen(false)
        setFocusedIndex(-1)
        break
    }
  }

  const triggerBorder = error
    ? 'border-red-400 ring-2 ring-red-100'
    : open
      ? 'border-blue-500 ring-2 ring-blue-100'
      : 'border-gray-300 hover:border-gray-400'

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`} ref={containerRef}>
      {name && <input type="hidden" name={name} value={value ?? ''} />}

      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((v) => !v)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={[
            'w-full flex items-center gap-2 text-left border rounded-lg transition-all duration-150 bg-white outline-none',
            sizeClasses[size],
            triggerBorder,
            disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : 'cursor-pointer',
          ].join(' ')}
        >
          {Icon && <Icon className="w-4 h-4 text-gray-400 shrink-0" />}
          <span className={`flex-1 truncate ${selected ? 'text-gray-900' : 'text-gray-400'}`}>
            {selected ? selected.label : (placeholder ?? 'Selecionar...')}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open && (
          <div className="absolute z-50 mt-1.5 w-full">
            <ul
              ref={listRef}
              role="listbox"
              className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-auto max-h-56 py-1"
            >
              {options.map((opt, i) => {
                const isSelected = opt.value === value
                const isFocused  = i === focusedIndex
                return (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setFocusedIndex(i)}
                    onMouseLeave={() => setFocusedIndex(-1)}
                    onClick={() => handleSelect(opt)}
                    className={[
                      'flex items-center justify-between gap-2 px-3 py-2 mx-1 rounded-lg cursor-pointer text-sm transition-colors duration-100',
                      isSelected
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : isFocused
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-700',
                    ].join(' ')}
                  >
                    <span className="truncate">{opt.label}</span>
                  </li>
                )
              })}

              {options.length === 0 && (
                <li className="px-4 py-3 text-sm text-gray-400 text-center">
                  Nenhuma opção disponível
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-gray-400">{hint}</p>}
    </div>
  )
}