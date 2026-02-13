// src/components/atoms/PhoneInput.tsx
import React, { useState } from 'react';
import { Phone, ChevronDown, Check } from 'lucide-react';
import { Icon } from './Icon';
import { PHONE_COUNTRIES, getCountryByCode } from '@/config/countryConfig';

interface PhoneInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  phoneCode: string;
  onPhoneCodeChange: (code: string) => void;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

export function PhoneInput({
  label,
  value,
  onChange,
  phoneCode,
  onPhoneCodeChange,
  required = false,
  error,
  disabled = false
}: PhoneInputProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const country = getCountryByCode(phoneCode);

  const handleCountrySelect = (code: string) => {
    onPhoneCodeChange(code);
    setIsDropdownOpen(false);
  };

  return (
    <div className="w-full">
      {/* Label */}
      <label className="block text-[12px] font-medium text-gray-500 mb-1 ml-0.5">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {/* Ícone de telefone */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
          <Icon icon={Phone} size={16} />
        </div>

        {/* Seletor de país com dropdown */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 z-20">
          <button
            type="button"
            onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
            disabled={disabled}
            className={`
              flex items-center gap-1.5 bg-gray-100/50 rounded-lg border-r border-gray-300
              transition-colors
              ${disabled ? 'cursor-not-allowed opacity-60' : 'hover:bg-gray-200/50 cursor-pointer'}
            `}
          >
            <span className="text-lg leading-none">{country?.flag || '🌍'}</span>
            <span className="text-[13px] font-medium text-gray-700">
              {country?.code || '+00'}
            </span>
            <Icon 
              icon={ChevronDown} 
              size={14} 
              className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
            />
          </button>

          {/* Dropdown de países */}
          {isDropdownOpen && (
            <>
              {/* Backdrop transparente */}
              <div 
                className="fixed inset-0 z-30"
                onClick={() => setIsDropdownOpen(false)}
              />
              
              {/* Menu dropdown */}
              <div className="absolute top-full left-0 mt-1 w-50 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-40 max-h-64 overflow-y-auto">
                {PHONE_COUNTRIES.map((countryOption) => {
                  const isSelected = countryOption.code === phoneCode;
                  
                  return (
                    <button
                      key={countryOption.code}
                      type="button"
                      onClick={() => handleCountrySelect(countryOption.code)}
                      className={`
                        w-full px-3 py-2.5 text-left flex items-center gap-3 transition-colors
                        ${isSelected 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <span className="text-xl shrink-0">{countryOption.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium truncate">{countryOption.name}</div>
                        <div className="text-[11px] text-gray-500">{countryOption.code}</div>
                      </div>
                      {isSelected && (
                        <Icon icon={Check} size={16} className="text-blue-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Input */}
        <input
          type="tel"
          value={value}
          onChange={onChange}
          placeholder={country?.placeholder || '(99) 99999-9999'}
          required={required}
          disabled={disabled}
          className={`
            w-full px-3 py-2 pl-29 pr-1
            bg-gray-100/50 
            border border-gray-300
            focus:border-blue-400 focus:bg-white 
            rounded-xl 
            text-[14px] text-gray-900
            placeholder:text-gray-400
            outline-none transition-all
            ${error 
              ? 'border-red-400 focus:border-red-400' 
              : ''
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
      </div>

      {/* Mensagem de erro */}
      {error && (
        <p className="text-[11px] text-red-500 mt-1 ml-0.5">{error}</p>
      )}
    </div>
  );
}