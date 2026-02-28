// src/components/ui/FileUpload.tsx
'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { Camera, X, Upload, Image as ImageIcon } from 'lucide-react'
import { Icon } from './Icon'
import { Label } from './Label'

interface FileUploadProps {
  label?: string
  value?: string | null
  onChange?: (base64: string | null) => void
  accept?: string
  maxSizeMB?: number
  shape?: 'square' | 'circle'
  size?: 'sm' | 'md' | 'lg'
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  fullWidthOnMobile?: boolean
}

const sizeDimensions = {
  sm: 'w-20 h-20',
  md: 'w-28 h-28',
  lg: 'w-36 h-36',
}

const iconSize = {
  sm: 16,
  md: 20,
  lg: 24,
}

export function FileUpload({
  label,
  value,
  onChange,
  accept = 'image/*',
  maxSizeMB = 5,
  shape = 'square',
  size = 'md',
  placeholder = 'Adicionar foto',
  error,
  hint,
  disabled = false,
  fullWidthOnMobile = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [sizeError, setSizeError]   = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-xl'
  const displayError = error || sizeError

  const processFile = (file: File) => {
    setSizeError(null)
    if (file.size > maxSizeMB * 1024 * 1024) {
      setSizeError(`Arquivo muito grande. Máximo: ${maxSizeMB}MB`)
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => onChange?.(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) processFile(file)
  }

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onChange?.(null)
    setSizeError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex flex-col items-start gap-1.5 w-full sm:w-auto">
      {label && (
        <Label text={label} error={displayError ?? undefined} hint={hint} />
      )}

      <div className="relative group w-full sm:w-auto">
        <label
          className={[
            fullWidthOnMobile ? 'w-full h-28 sm:w-28 sm:h-28' : sizeDimensions[size],
            shapeClass,
            'relative flex flex-col items-center justify-center overflow-hidden',
            'border-2 border-dashed transition-all duration-200',
            disabled
              ? 'cursor-not-allowed opacity-60 border-gray-200 bg-gray-50'
              : value
                ? 'border-transparent cursor-pointer'
                : isDragging
                  ? 'border-blue-500 bg-blue-50 cursor-copy scale-105'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer',
            displayError ? 'border-red-400' : '',
          ].join(' ')}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragging(false)}
        >
          {value ? (
            <>
              <img src={value} alt="Preview" className={`w-full h-full object-cover ${shapeClass}`} />
              {!disabled && (
                <div className={[
                  'absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100',
                  'flex flex-col items-center justify-center gap-1 transition-opacity',
                  shapeClass,
                ].join(' ')}>
                  <Icon icon={Camera} size={20} className="text-white" />
                  <span className="text-white text-xs font-medium">Alterar</span>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1.5 p-2 text-center">
              {isDragging ? (
                <>
                  <Icon icon={Upload} size={iconSize[size]} className="text-blue-500" />
                  <span className="text-xs text-blue-500 font-medium">Soltar aqui</span>
                </>
              ) : (
                <>
                  <div className={[
                    'flex items-center justify-center rounded-lg transition-colors',
                    size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-10 h-10' : 'w-12 h-12',
                    'bg-gray-100 group-hover:bg-blue-100',
                  ].join(' ')}>
                    <Icon icon={ImageIcon} size={iconSize[size]} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  {size !== 'sm' && (
                    <span className="text-xs text-gray-400 group-hover:text-blue-500 transition-colors leading-tight">
                      {placeholder}
                    </span>
                  )}
                </>
              )}
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            disabled={disabled}
            className="hidden"
          />
        </label>

        {value && !disabled && (
          <button
            type="button"
            onClick={handleRemove}
            className={[
              'absolute -top-1.5 -right-1.5 z-10',
              'w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full',
              'flex items-center justify-center transition-colors shadow-md',
              'opacity-0 group-hover:opacity-100',
            ].join(' ')}
            title="Remover imagem"
          >
            <Icon icon={X} size={12} className="text-white" />
          </button>
        )}
      </div>

      {/* erro/hint fora do Label quando não tem label text */}
      {!label && displayError && <p className="text-xs text-red-500">{displayError}</p>}
      {!label && hint && !displayError && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  )
}