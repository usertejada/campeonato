// src/components/organisms/Layout.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Menu, X } from 'lucide-react';
import { Icon } from '../atoms/Icon';
import { Breadcrumb } from '../molecules/Breadcrumb';
import { Sidebar } from './Sidebar';
import type { MaxWidth } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  showBreadcrumb?: boolean;
  maxWidth?: MaxWidth;
}

export function Layout({ 
  children, 
  showBreadcrumb = true, 
  maxWidth = '7xl' 
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  // Fecha sidebar ao mudar de rota
  useEffect(() => {
    setSidebarOpen(false);
  }, [router.pathname]);

  const maxWidthClasses: Record<MaxWidth, string> = {
    full: '',
    '7xl': 'max-w-7xl mx-auto',
    '6xl': 'max-w-6xl mx-auto',
    '5xl': 'max-w-5xl mx-auto',
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 right-4 z-50 lg:hidden p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Toggle menu"
      >
        <Icon icon={sidebarOpen ? X : Menu} size={24} />
      </button>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6 lg:p-8">
          {/* Breadcrumb */}
          {showBreadcrumb && (
            <div className="mb-6">
              <Breadcrumb pathname={router.pathname} />
            </div>
          )}

          {/* Conteúdo principal */}
          <div className={maxWidthClasses[maxWidth]}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}