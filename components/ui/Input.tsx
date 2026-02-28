// src/components/ui/Input.tsx

'use client'

import { forwardRef, useState } from 'react'
import { LucideIcon } from 'lucide-react'
import { Label } from './Label'

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'tel'
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  label?: string
  error?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  min?: number
  max?: number
  className?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  type = 'text',
  placeholder,
  value,
  onChange,
  icon: Icon,
  iconPosition = 'left',
  label,
  error,
  hint,
  required = false,
  disabled = false,
  min,
  max,
  className = ''
}, ref) => {
  const [focused, setFocused] = useState(false)

  const isDate = type === 'date'
  const resolvedType = isDate && !focused && !value ? 'text' : type

  return (
    <div className="w-full">
      {label && (
        <Label text={label} required={required} error={error} hint={hint} className="mb-2" />
      )}

      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        )}

        <input
          ref={ref}
          type={resolvedType}
          value={value}
          onChange={onChange}
          placeholder={isDate && !focused ? (placeholder ?? 'dd/mm/aaaa') : placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          onFocus={(e) => {
            setFocused(true)
            if (isDate) e.target.type = 'date'
          }}
          onBlur={() => setFocused(false)}
          className={`
            w-full px-4 py-2 text-sm
            border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            outline-none transition
            text-gray-900
            placeholder:text-gray-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${Icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${Icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
        />

        {Icon && iconPosition === 'right' && (
          <Icon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        )}
      </div>

      {/* erro/hint fora do Label quando não tem label text */}
      {!label && error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {!label && hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  )
})

Input.displayName = 'Input'