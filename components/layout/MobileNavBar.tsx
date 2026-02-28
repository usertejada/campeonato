// src/components/layout/MobileNavBar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import {
  LayoutDashboard, Trophy, Users, UserCircle, Calendar,
  History, BarChart3, Target, Settings, Bell, Swords,
} from 'lucide-react'

const allNavItems = [
  { name: 'Dashboard',    href: '/dashboard',     icon: LayoutDashboard, roles: ['admin', 'tecnico', 'organizador'] },
  { name: 'Campeonatos',  href: '/campeonatos',   icon: Trophy,          roles: ['admin', 'organizador'] },
  { name: 'Times',        href: '/times',         icon: Users,           roles: ['admin', 'tecnico', 'organizador'] },
  { name: 'Jogadores',    href: '/jogadores',     icon: UserCircle,      roles: ['admin', 'organizador'] },
  { name: 'Jogos',        href: '/jogos',         icon: Calendar,        roles: ['admin', 'tecnico', 'organizador'] },
  { name: 'Histórico',    href: '/historico',     icon: History,         roles: ['admin', 'tecnico', 'organizador'] },
  { name: 'Classificação',href: '/classificacao', icon: BarChart3,       roles: ['admin', 'tecnico', 'organizador'] },
  { name: 'Mata-Mata',    href: '/mata-mata',     icon: Swords,          roles: ['admin', 'tecnico', 'organizador'] },
  { name: 'Artilharia',   href: '/artilharia',    icon: Target,          roles: ['admin', 'tecnico', 'organizador'] },
  { name: 'Config',       href: '/configuracoes', icon: Settings,        roles: ['admin', 'tecnico', 'organizador'] },
  { name: 'Notificações', href: '/notificacoes',  icon: Bell,            roles: ['admin', 'tecnico', 'organizador'] },
]

export function MobileNavBar() {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<string>('admin')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      if (profile?.role) setUserRole(profile.role)
    })
  }, [])

  const navItems = allNavItems.filter(item => item.roles.includes(userRole))

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div
        className="flex overflow-x-auto px-2 py-1 gap-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center gap-1 px-3 py-2 rounded-xl
                whitespace-nowrap shrink-0 transition-all relative
                ${isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}
              `}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-full" />
              )}
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}