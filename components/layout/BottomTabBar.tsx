// src/components/layout/BottomTabBar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Trophy, Users, UserCircle, Calendar } from 'lucide-react'

const tabs = [
  { name: 'Campeonatos', href: '/campeonatos', icon: Trophy    },
  { name: 'Times',       href: '/times',       icon: Users     },
  { name: 'Jogadores',   href: '/jogadores',   icon: UserCircle},
  { name: 'Jogos',       href: '/jogos',       icon: Calendar  },
]

export function BottomTabBar() {
  const pathname = usePathname()

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/')
          const Icon = tab.icon

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`
                flex-1 flex flex-col items-center justify-center gap-1 py-3
                transition-colors relative
                ${isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}
              `}
            >
              {/* Indicador ativo no topo */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full" />
              )}

              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className={`text-[10px] font-medium ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                {tab.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}