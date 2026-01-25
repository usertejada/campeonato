// src/components/organisms/Sidebar.tsx

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Trophy, Plus } from 'lucide-react';
import { Icon } from '../atoms/Icon';
import { Button } from '../molecules/Button';
import { UserDropdown } from '../molecules/UserDropdown';
import { useAuth } from '../../contexts/AuthContext';
import { useModal } from '../../contexts/ModalContext';
import { navigationSections } from '../../config/navigation';
import { MODAL_IDS } from '../../constants/modalIds';
import type { NavigationItem } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { openModal } = useModal();

  const filterNavigationByRole = (items: NavigationItem[]) => {
    if (!user) return [];
    return items.filter(item => !item.roles || item.roles.includes(user.role));
  };

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    router.push(path);
    onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 flex flex-col`}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <Icon icon={Trophy} size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">ChampionSystem</h1>
              <p className="text-[11px] text-gray-500">Gestão de Campeonatos</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin scrollbar-thumb-gray-300">
          {navigationSections.map((section, idx) => (
            <div key={section.title} className={idx > 0 ? 'mt-6' : ''}>
              <h2 className="px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                {section.title}
              </h2>
              <div className="space-y-1">
                {filterNavigationByRole(section.items).map(item => {
                  const isActive = router.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      href={item.path}
                      onClick={(e) => handleNavClick(e, item.path)}
                      className={`relative flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 w-1 h-8 bg-blue-600 rounded-r-full" />
                      )}
                      <div className="flex items-center space-x-3">
                        <Icon icon={item.icon} size={18} strokeWidth={2} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick Actions Section */}
          <div className="mt-6">
            <h2 className="px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              AÇÕES RÁPIDAS
            </h2>
            <Button
              variant="primary"
              fullWidth
              leftIcon={Plus}
              onClick={() => {
                openModal(MODAL_IDS.NEW_CHAMPIONSHIP);
              }}
            >
              Novo Campeonato
            </Button>
          </div>
        </nav>

        {/* Footer - User */}
        <div className="border-t border-gray-200">
          <UserDropdown />
        </div>
      </aside>
    </>
  );
}