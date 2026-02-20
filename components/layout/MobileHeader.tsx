// src/components/layout/MobileHeader.tsx
'use client'

import { Trophy, Plus } from 'lucide-react'
import { Icon } from '@/components/ui/Icon'

interface MobileHeaderProps {
  onAdd?: () => void
}

export function MobileHeader({ onAdd }: MobileHeaderProps) {
  return (
    <header
      className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 flex items-center justify-between px-4"
      style={{ height: '56px' }}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Icon icon={Trophy} size={16} className="text-white" />
        </div>
        <span className="text-base font-bold text-gray-900">ChampionSystem</span>
      </div>

      {onAdd && (
        <button
          onClick={onAdd}
          className="w-9 h-9 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors shadow-sm shadow-blue-500/40 active:scale-95"
        >
          <Plus size={20} className="text-white" />
        </button>
      )}
    </header>
  )
}