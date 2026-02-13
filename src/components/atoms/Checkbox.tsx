// ========================================
// src/components/atoms/Checkbox.tsx
// ========================================
import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
  size = 'md'
}: CheckboxProps) {
  
  // Tamanhos do checkbox
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  // Tamanhos do ícone
  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  // Tamanhos do texto
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <label 
      className={`
        flex items-center gap-2 cursor-pointer select-none
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {/* Checkbox Container */}
      <div className="relative flex items-center justify-center">
        {/* Input Hidden */}
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        
        {/* Custom Checkbox */}
        <div 
          className={`
            ${sizeClasses[size]}
            rounded-md
            border-2
            transition-all duration-200
            flex items-center justify-center
            ${checked 
              ? 'bg-blue-600 border-blue-600' 
              : 'bg-white border-gray-300 hover:border-blue-400'
            }
            ${disabled ? '' : 'cursor-pointer'}
          `}
        >
          {/* Check Icon */}
          {checked && (
            <Check 
              size={iconSizes[size]} 
              className="text-white"
              strokeWidth={3}
            />
          )}
        </div>
      </div>

      {/* Label */}
      {label && (
        <span className={`
          ${textSizes[size]}
          text-gray-700 font-medium
          ${disabled ? '' : 'cursor-pointer'}
        `}>
          {label}
        </span>
      )}
    </label>
  );
}
