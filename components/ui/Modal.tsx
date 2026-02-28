// src/components/ui/Modal.tsx
'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { Icon } from './Icon'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  header?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  showCloseButton?: boolean
  mobileCenter?: boolean
}

export function Modal({
  isOpen,
  onClose,
  title = 'Formulário',
  header,
  children,
  footer,
  size = '2xl',
  showCloseButton = true,
  mobileCenter = false,
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
    } else {
      const scrollY = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, parseInt(scrollY || '0') * -1)
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses = {
    sm:    'sm:max-w-sm',
    md:    'sm:max-w-md',
    lg:    'sm:max-w-lg',
    xl:    'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
  }

  // mobileCenter: centralizado em todos os tamanhos de tela, com padding lateral
  // !mobileCenter: ancorado embaixo no mobile, centralizado no sm+
  return (
    <div
      className={[
        'fixed inset-0 z-50 flex justify-center',
        mobileCenter
          ? 'items-center p-4'
          : 'items-end sm:items-center sm:p-4',
      ].join(' ')}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={[
          'relative bg-white w-full flex flex-col',
          mobileCenter
            ? 'rounded-2xl'
            : 'sm:rounded-2xl',
          'shadow-2xl',
          'max-h-[92vh]',
          sizeClasses[size],
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle — só no mobile quando NÃO está centralizado */}
        {!mobileCenter && (
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full bg-gray-300" />
          </div>
        )}

        {/* Header */}
        {header ? (
          <div className="border-b border-gray-200">{header}</div>
        ) : (
          <div className="flex items-center justify-between px-5 py-1 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            {showCloseButton && (
              <Icon
                icon={X}
                size={18}
                className="text-gray-500 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={onClose}
              />
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6 py-5 sm:py-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}