// src/components/atoms/CustomSelect.tsx
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

  // Usa hook genéric para fechar ao clicar fora
  useClickOutside(dropdownRef, () => setIsOpen(false), isOpen);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const displayValue = value || placeholder || 'Selecione...';

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Button/Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-5 py-2
          bg-white border border-gray-300 rounded-lg 
          text-sm font-medium text-left
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          hover:border-gray-400
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
          flex items-center justify-between gap-15
          ${!value ? 'text-gray-400' : 'text-gray-700'}
        `}
      >
        <span className="truncate">{displayValue}</span>
        <Icon
          icon={ChevronDown}
          size={16}
          className={`flex-shrink-0 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-1 max-h-60 overflow-y-auto">
          {options.map((option) => {
            const isSelected = option === value;
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className={`
                  w-full px-4 py-2.5 text-left text-sm
                  transition-colors duration-150
                  hover:bg-gray-50
                  ${isSelected 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-gray-700'
                  }
                `}
              >
                <span className="truncate block">{option}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}