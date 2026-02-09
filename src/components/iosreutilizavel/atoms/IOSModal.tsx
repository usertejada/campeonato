// ====================================
// src/components/atoms/IOSModal.tsx
// ====================================
import React, { useEffect } from 'react';

interface IOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function IOSModal({ isOpen, onClose, children }: IOSModalProps) {
  // Fecha ao pressionar ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Previne scroll do body
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

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white/95 backdrop-blur-2xl rounded-[40px] w-full max-w-[380px] p-7 shadow-2xl border border-white/80 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
      >
        {children}
        
        {/* Rodapé Minimalista */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={onClose}
            className="w-16 h-1 bg-black/5 rounded-full hover:bg-black/10 transition-colors cursor-pointer"
            aria-label="Fechar modal"
          />
        </div>
      </div>
    </div>
  );
}