// src/components/ui/PhoneInput.tsx
'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { Phone } from 'lucide-react'
import { Input } from './Input'
import { Select, SelectOption } from './Select'

interface CountryCode {
  code: string
  flag: string
  mask: string
  placeholder: string
}

const COUNTRY_CODES: CountryCode[] = [
  { code: '+55', flag: '🇧🇷', placeholder: '(11) 98765-4321', mask: '(##) #####-####' },
  { code: '+51', flag: '🇵🇪', placeholder: '987 654 321',     mask: '### ### ###'    },
  { code: '+57', flag: '🇨🇴', placeholder: '321 456 7890',    mask: '### ### ####'   },
]

const COUNTRY_OPTIONS: SelectOption[] = COUNTRY_CODES.map((c) => ({
  value: c.code,
  label: `${c.flag} ${c.code}`,
}))

function applyMask(value: string, mask: string): string {
  const digits = value.replace(/\D/g, '')
  let result = ''
  let digitIndex = 0
  for (let i = 0; i < mask.length; i++) {
    if (digitIndex >= digits.length) break
    if (mask[i] === '#') result += digits[digitIndex++]
    else result += mask[i]
  }
  return result
}

function maxDigits(mask: string): number {
  return mask.split('').filter(c => c === '#').length
}

interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  error?: string
  hint?: string
  countryCode?: string
  onCountryCodeChange?: (code: string) => void
  onPhoneChange?: (phone: string) => void
  value?: string
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(({
  label,
  error,
  hint,
  countryCode = '+55',
  onCountryCodeChange,
  onPhoneChange,
  value = '',
  disabled,
  required,
  className = '',
}, ref) => {
  const country = COUNTRY_CODES.find((c) => c.code === countryCode) ?? COUNTRY_CODES[0]

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, maxDigits(country.mask))
    onPhoneChange?.(applyMask(digits, country.mask))
  }

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="flex gap-1 items-start">

        {/* Seletor de país usando Select */}
        <div className="w-24 shrink-0">
          <Select
            options={COUNTRY_OPTIONS}
            value={countryCode}
            onChange={(val) => {
              onCountryCodeChange?.(val)
              onPhoneChange?.('')
            }}
            disabled={disabled}
            fullWidth
            size="sm"
          />
        </div>

        {/* Input de telefone */}
        <Input
          ref={ref}
          type="tel"
          value={value}
          onChange={handlePhoneChange}
          placeholder={country.placeholder}
          disabled={disabled}
          required={required}
          error={error}
          icon={Phone}
        />
      </div>

      {hint && !error && <p className="mt-1.5 text-xs text-gray-400">{hint}</p>}
    </div>
  )
})

PhoneInput.displayName = 'PhoneInput'