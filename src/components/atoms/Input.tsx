// ========================================
// src/components/atoms/Input.tsx
// ========================================
import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Icon } from './Icon';

interface InputProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'tel' | 'url';
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  min?: number | string;
  max?: number | string;
  className?: string;
  error?: string;
}

export function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  leftIcon,
  rightIcon,
  min,
  max,
  className = '',
  error
}: InputProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* Label iOS Style */}
      {label && (
        <label className="block text-[12px] font-medium text-gray-500 mb-1 ml-0.5">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative flex items-center">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 text-gray-400">
            <Icon icon={leftIcon} size={16} />
          </div>
        )}

        {/* Input */}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          className={`
            w-full px-3 py-2
            ${leftIcon ? 'pl-9' : ''} 
            ${rightIcon ? 'pr-9' : ''}
            bg-gray-100/50 
            border border-gray-300
            focus:border-blue-400 focus:bg-white 
            rounded-xl 
            text-[14px] text-gray-900
            outline-none transition-all
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-400 focus:border-red-400' : ''}
            placeholder:text-gray-400
          `}
        />

        {/* Right Icon */}
        {rightIcon && (
          <div className="absolute right-3 text-gray-400">
            <Icon icon={rightIcon} size={16} />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-[11px] text-red-500 mt-1 ml-0.5">{error}</p>
      )}
    </div>
  );
}
