// src/components/cards/TeamCard.tsx
import React from 'react';
import { Phone, Calendar, Mail, Settings, Eye, Edit, Power, Trash2 } from 'lucide-react';
import { Icon } from '../atoms/Icon';
import { Button } from '../molecules/Button';
import type { DropdownMenuItem } from '../molecules/DropdownMenu';

interface TeamCardProps {
  id: string;
  name: string;
  logo: string;
  coach: string;
  championshipName: string;
  email: string;
  phone?: string;
  foundedYear: number;
  isActive?: boolean;
  activeDropdown: string | null;
  onToggleDropdown: (id: string | null) => void;
  onViewDetails: (id: string) => void;
  onEdit: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TeamCard({
  id,
  name,
  logo,
  coach,
  championshipName,
  email,
  phone,
  foundedYear,
  isActive = true,
  activeDropdown,
  onToggleDropdown,
  onViewDetails,
  onEdit,
  onToggleStatus,
  onDelete,
}: TeamCardProps) {
  
  // Verifica se é URL de imagem ou iniciais
  const isImageUrl = logo.startsWith('http') || logo.startsWith('/');

  // Itens do menu dropdown
  const dropdownItems: DropdownMenuItem[] = [
    {
      label: 'Editar',
      icon: Edit,
      onClick: () => onEdit(id),
    },
    {
      label: 'Ver Detalhes',
      icon: Eye,
      onClick: () => onViewDetails(id),
    },
    {
      label: isActive ? 'Desativar' : 'Ativar',
      icon: Power,
      onClick: () => onToggleStatus(id),
      divider: true,
    },
    {
      label: 'Excluir',
      icon: Trash2,
      onClick: () => onDelete(id),
      variant: 'danger',
    },
  ];

  return (
    <div className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200">
      
      {/* Engrenagem (posição absoluta no topo) */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => onToggleDropdown(activeDropdown === id ? null : id)}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Menu de opções"
        >
          <Icon icon={Settings} size={18} className="text-gray-600" />
        </button>
        
        {activeDropdown === id && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-30"
              onClick={() => onToggleDropdown(null)}
            />
            
            {/* Dropdown */}
            <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-40">
              {dropdownItems.map((item, index) => (
                <React.Fragment key={index}>
                  {item.divider && (
                    <div className="border-t border-gray-100 my-1"></div>
                  )}
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
                    <span>{item.label}</span>
                  </button>
                </React.Fragment>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Logo + Nome + Técnico */}
      <div className="flex items-start gap-3 mb-4">
        {/* Logo */}
        <div className="shrink-0 relative">
          {isImageUrl ? (
            <img 
              src={logo} 
              alt={name} 
              className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">{logo}</span>
            </div>
          )}
          {/* Bolinha verde de status */}
          {isActive && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>

        {/* Nome + Técnico */}
        <div className="flex-1 min-w-0 pr-8">
          <h3 className="text-lg font-bold text-gray-900 truncate">{name}</h3>
          <p className="text-sm text-blue-600 truncate">Téc. {coach}</p>
        </div>
      </div>

      {/* Badge do Campeonato */}
      <div className="mb-4">
        <h4 className="text-base font-bold text-gray-900 truncate">{championshipName}</h4>
      </div>

      {/* Informações: Email + Telefone + Fundado */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2 text-gray-600">
          <Icon icon={Mail} size={16} className="text-gray-400 shrink-0" />
          <span className="text-sm truncate">{email}</span>
        </div>
        {phone && (
          <div className="flex items-center gap-2 text-gray-600">
            <Icon icon={Phone} size={16} className="text-gray-400 shrink-0" />
            <span className="text-sm truncate">{phone}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-gray-600">
          <Icon icon={Calendar} size={16} className="text-gray-400 shrink-0" />
          <span className="text-sm">Fundado em {foundedYear}</span>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-3">
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={() => onViewDetails(id)}
          className="bg-gray-900 hover:bg-gray-800 text-white"
        >
          Detalhes
        </Button>
        <Button
          variant="outline"
          size="md"
          fullWidth
          onClick={() => console.log('Mensagem - implementar depois')}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Mensagem
        </Button>
      </div>
    </div>
  );
}