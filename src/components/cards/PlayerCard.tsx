// src/components/cards/PlayerCard.tsx
import React from 'react';
import { Shield, ChevronRight, Settings, Eye, Edit, Power, Trash2, Award } from 'lucide-react';
import { Icon } from '../atoms/Icon';
import type { DropdownMenuItem } from '../molecules/DropdownMenu';

interface PlayerCardProps {
  id: string;
  name: string;
  photo: string;
  teamName: string;
  position: string;
  phone?: string;
  nationality: string;
  birthDate: string;
  shirtNumber: number;
  isActive?: boolean;
  activeDropdown: string | null;
  onToggleDropdown: (id: string | null) => void;
  onViewDetails: (id: string) => void;
  onEdit: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PlayerCard({
  id,
  name,
  photo,
  teamName,
  position,
  phone,
  nationality,
  birthDate,
  shirtNumber,
  isActive = true,
  activeDropdown,
  onToggleDropdown,
  onViewDetails,
  onEdit,
  onToggleStatus,
  onDelete,
}: PlayerCardProps) {
  
  // Verifica se é URL de imagem, base64 ou iniciais
  const isImageUrl = photo.startsWith('http') || photo.startsWith('/') || photo.startsWith('data:image');

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

  // Dados fictícios de cartões (você pode adicionar isso no Player type depois)
  const yellowCards = 4;
  const redCards = 0;

  return (
    <div className="w-full max-w-95 bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-200">
      
      {/* Topo - Nome do Time Compacto */}
      <div className="bg-sky-500 p-2 flex justify-between items-center relative">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-white" />
          <span className="text-white font-black uppercase text-[10px] tracking-widest">
            {teamName}
          </span>
        </div>
        
        {/* Engrenagem */}
        <button
          onClick={() => onToggleDropdown(activeDropdown === id ? null : id)}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          aria-label="Menu de opções"
        >
          <Settings className="w-4 h-4 text-white/70 cursor-pointer" />
        </button>
        
        {activeDropdown === id && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-30"
              onClick={() => onToggleDropdown(null)}
            />
            
            {/* Dropdown */}
            <div className="absolute right-4 top-14 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-40">
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

      {/* Perfil Arredondado */}
      <div className="pt-2 flex flex-col items-center bg-linear-to-b from-sky-50 to-white">
        <div className="relative">
          {/* Foto Circular */}
          {isImageUrl ? (
            <div className="w-25 h-25  rounded-full overflow-hidden border-[5px] border-white shadow-xl">
              <img 
                src={photo} 
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-23 h-23 rounded-full overflow-hidden border-3 border-white shadow-xl bg-linear-to-br from-gray-300 to-gray-400 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">{photo}</span>
            </div>
          )}
          
          {/* Badge de Número */}
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-zinc-900 rounded-full flex items-center justify-center border-2 border-white shadow-md">
            <span className="text-white font-bold text-xs">{shirtNumber}</span>
          </div>
        </div>

        <div className="mt-4 text-center px-1">
          <h1 className="text-lg font-black text-zinc-900 tracking-tight leading-tight line-clamp-1">
            {name}
          </h1>
          <p className="text-sky-600 text-[9px] font-bold uppercase tracking-[0.2em] mt-1">
            {position}
          </p>
        </div>
      </div>

      {/* Seção de Cartões Compacta */}
      <div className="px-5 pb-3">
        <div className="bg-zinc-50 rounded-2xl p-2">
          <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-3 text-center">
            Contagem de Cartões
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Amarelo */}
            <div className="flex items-center justify-center gap-3 bg-white p-2 rounded-xl border border-zinc-100 shadow-sm">
              <div className="w-4 h-6 bg-yellow-400 rounded-sm shadow-sm"></div>
              <span className="text-lg font-black text-zinc-800">{yellowCards}</span>
            </div>

            {/* Vermelho */}
            <div className="flex items-center justify-center gap-3 bg-white p-2 rounded-xl border border-zinc-100 shadow-sm">
              <div className="w-4 h-6 bg-red-500 rounded-sm shadow-sm"></div>
              <span className="text-lg font-black text-zinc-800">{redCards}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => onViewDetails(id)}
          className="w-full mt-2 bg-zinc-900 hover:bg-zinc-800 text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center transition-all group"
        >
          Perfil Completo
          <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}