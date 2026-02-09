// src/components/molecules/DropdownMenu.tsx
import React from 'react';
import { Icon } from '../atoms/Icon';
import { MoreVertical } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface DropdownMenuItem {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'danger';
  divider?: boolean; // Adiciona divisor ANTES deste item
}

interface DropdownMenuProps {
  id: string;
  items: DropdownMenuItem[];
  activeDropdown: string | null;
  onToggleDropdown: (id: string | null) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  triggerIcon?: LucideIcon; // Ícone customizado para o botão trigger
}

export function DropdownMenu({
  id,
  items,
  activeDropdown,
  onToggleDropdown,
  position = 'top-right',
  triggerIcon = MoreVertical // Padrão é MoreVertical se não for especificado
}: DropdownMenuProps) {
  
  const positionClasses = {
    'top-right': 'absolute top-6 right-6',
    'top-left': 'absolute top-6 left-6',
    'bottom-right': 'absolute bottom-6 right-6',
    'bottom-left': 'absolute bottom-6 left-6'
  };

  const dropdownPositionClasses = {
    'top-right': 'right-0 top-10',
    'top-left': 'left-0 top-10',
    'bottom-right': 'right-0 bottom-10',
    'bottom-left': 'left-0 bottom-10'
  };

  return (
    <div className={`${positionClasses[position]} z-20`}>
      <button
        onClick={() => onToggleDropdown(activeDropdown === id ? null : id)}
        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Menu de opções"
      >
        <Icon icon={triggerIcon} size={18} className="text-gray-700" />
      </button>
      
      {activeDropdown === id && (
        <>
          {/* Backdrop para fechar ao clicar fora */}
          <div 
            className="fixed inset-0 z-30"
            onClick={() => onToggleDropdown(null)}
          />
          
          {/* Menu Dropdown */}
          <div className={`absolute ${dropdownPositionClasses[position]} w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-40`}>
            {items.map((item, index) => (
              <React.Fragment key={index}>
                {/* Divisor antes do item, se necessário */}
                {item.divider && (
                  <div className="border-t border-gray-100 my-1"></div>
                )}
                
                {/* Item do menu */}
                <button
                  onClick={() => {
                    item.onClick();
                    onToggleDropdown(null);
                  }}
                  className={`
                    w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 transition-colors
                    ${item.variant === 'danger' 
                      ? 'text-red-600 hover:bg-red-50' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon 
                    icon={item.icon} 
                    size={16} 
                    className={item.variant === 'danger' ? 'text-red-600' : 'text-gray-600'} 
                  />
                  <span className={item.variant === 'danger' ? 'text-red-600' : 'text-gray-700'}>
                    {item.label}
                  </span>
                </button>
              </React.Fragment>
            ))}
          </div>
        </>
      )}
    </div>
  );
}