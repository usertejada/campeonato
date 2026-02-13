// src/components/molecules/Modal.tsx
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Icon } from '../atoms/Icon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showCloseButton?: boolean;
}

export function Modal({ 
  isOpen, 
  onClose, 
  title = 'Formulário',
  children,
  size = '2xl',
  showCloseButton = true
}: ModalProps) {
  
  // Fecha o modal ao pressionar ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Previne scroll do body quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Tamanhos do modal (ajustados para serem mais estreitos)
  const sizeClasses = {
    sm: 'max-w-sm',      // ~384px
    md: 'max-w-md',      // ~448px
    lg: 'max-w-lg',      // ~512px
    xl: 'max-w-xl',      // ~576px
    '2xl': 'max-w-2xl'   // ~672pxx
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 py-6 sm:p-4">
      {/* Backdrop com blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[92vh] flex flex-col animate-in fade-in zoom-in duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 sm:px-5 sm:py-3 border-b border-gray-200">
          <h2 className="text-base sm:text-[19px] font-semibold text-gray-900 tracking-tight">{title}</h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Fechar modal"
            >
              <Icon icon={X} size={18} className="sm:w-5 sm:h-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
          {children}
        </div>
      </div>
    </div>
  );
}