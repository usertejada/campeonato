// ========================================
// src/components/atoms/CustomSelect.tsx
// ========================================
import React, { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { Icon } from './Icon';
import { useClickOutside } from '../../hooks/common/useClickOutside';

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function CustomSelect({ 
  value, 
  onChange, 
  options, 
  placeholder,
  label,
  required = false,
  disabled = false,
  className = '' 
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false), isOpen);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const displayValue = value || placeholder || 'Selecione...';

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      {/* Label iOS Style */}
      {label && (
        <label className="block text-[12px] font-medium text-gray-500 mb-1 ml-0.5">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      {/* Select Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-3 py-2
          bg-gray-100/50 
          border border-gray-300
          focus:border-blue-400 focus:bg-white 
          rounded-xl 
          text-[14px] text-left
          outline-none transition-all
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-between gap-2
          ${!value ? 'text-gray-400' : 'text-gray-900'}
        `}
      >
        <span className="truncate">{displayValue}</span>
        <Icon
          icon={ChevronDown}
          size={16}
          className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menuu */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 py-1 max-h-60 overflow-y-auto">
          {options.map((option) => {
            const isSelected = option === value;
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className={`
                  w-full px-4 py-2.5 text-left text-[14px]
                  transition-colors
                  hover:bg-gray-50
                  ${isSelected 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-700'
                  }
                `}
              >
                {option}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}