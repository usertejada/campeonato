// src/components/ui/Button.tsx

import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: (e?: React.MouseEvent) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'soft' | 'soft-blue'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ElementType
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
  mobileLabel?: string
  'aria-haspopup'?: React.AriaAttributes['aria-haspopup']
  'aria-expanded'?: boolean
}

export function Button({
  children,
  onClick,
  onKeyDown,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  type = 'button',
  className = '',
  mobileLabel,
  'aria-haspopup': ariaHasPopup,
  'aria-expanded': ariaExpanded,
}: ButtonProps) {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700',
    ghost: 'hover:bg-gray-100 text-gray-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    soft: 'bg-gray-50 hover:bg-gray-100 text-gray-700',
    'soft-blue': 'bg-blue-50 hover:bg-blue-100 text-blue-600'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      onKeyDown={onKeyDown}
      disabled={disabled}
      aria-haspopup={ariaHasPopup}
      aria-expanded={ariaExpanded}
      className={`
        flex items-center justify-center gap-2
        font-medium rounded-lg transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {Icon && iconPosition === 'left' && <Icon size={18} />}

      {mobileLabel ? (
        <>
          <span className="sm:hidden">{mobileLabel}</span>
          <span className="hidden sm:inline">{children}</span>
        </>
      ) : (
        children
      )}

      {Icon && iconPosition === 'right' && <Icon size={18} />}
    </button>
  )
}