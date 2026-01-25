// src/components/molecules/UserDropdown.tsx
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { User, Settings, HelpCircle, LogOut, ChevronDown } from 'lucide-react';
import { Icon } from '../atoms/Icon';
import { useAuth } from '../../contexts/AuthContext';
import { useClickOutside } from '../../hooks/common/useClickOutside';

export function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Usa hook genérico para fechar ao clicar fora
  useClickOutside(dropdownRef, () => setIsOpen(false), isOpen);

  if (!user) return null;

  return (
    <div ref={dropdownRef} className="relative">
      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          
          <div className="py-1">
            <Link
              href="/perfil"
              className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Icon icon={User} size={18} />
              <span>Meu Perfil</span>
            </Link>
            <Link
              href="/configuracoes"
              className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Icon icon={Settings} size={18} />
              <span>Configurações</span>
            </Link>
          </div>

          <div className="border-t border-gray-100 py-1">
            <Link
              href="/ajuda"
              className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Icon icon={HelpCircle} size={18} />
              <span>Ajuda</span>
            </Link>
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <Icon icon={LogOut} size={18} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors rounded-lg"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
          {user.initials}
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500">Administrador</p>
        </div>
        <Icon
          icon={ChevronDown}
          size={18}
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
    </div>
  );
}