// src/components/layout/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Trophy, LayoutDashboard, Users, UserCircle, Calendar,
  History, BarChart3, Target, Settings, Bell, Plus, LogOut, ChevronDown, Swords,
} from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

interface SidebarProps {
  user: {
    nome: string
    email: string
    role: 'admin' | 'tecnico' | 'organizador'
  }
}

const NAV_SECTION    = 'NAVEGAÇÃO'
const MANAGE_SECTION = 'GERENCIAMENTO'
const SYSTEM_SECTION = 'SISTEMA'

const navigation = [
  { name: 'Dashboard',          href: '/dashboard',     icon: LayoutDashboard, section: NAV_SECTION,    roles: ['admin', 'tecnico', 'organizador'] },
  { name: 'Campeonatos',        href: '/campeonatos',   icon: Trophy,          section: NAV_SECTION,    roles: ['admin', 'organizador'] },
  { name: 'Times',              href: '/times',         icon: Users,           section: NAV_SECTION,    roles: ['admin', 'tecnico', 'organizador'] },
  { name: 'Jogadores',          href: '/jogadores',     icon: UserCircle,      section: NAV_SECTION,    roles: ['admin', 'organizador'] },
  { name: 'Jogos',              href: '/jogos',         icon: Calendar,        section: NAV_SECTION,    roles: ['admin', 'tecnico', 'organizador'] },
  { name: 'Histórico de Jogos', href: '/historico',     icon: History,         section: MANAGE_SECTION, roles: ['admin', 'tecnico', 'organizador'] },
  { name: 'Classificação',      href: '/classificacao', icon: BarChart3,       section: MANAGE_SECTION, roles: ['admin', 'tecnico', 'organizador'] },
  { name: 'Mata-Mata',          href: '/mata-mata',     icon: Swords,          section: MANAGE_SECTION, roles: ['admin', 'tecnico', 'organizador'] },
  { name: 'Artilharia',         href: '/artilharia',    icon: Target,          section: MANAGE_SECTION, roles: ['admin', 'tecnico', 'organizador'] },
  { name: 'Configurações',      href: '/configuracoes', icon: Settings,        section: SYSTEM_SECTION, roles: ['admin', 'tecnico', 'organizador'] },
  { name: 'Usuários',          href: '/usuarios',      icon: UserCircle,      section: SYSTEM_SECTION, roles: ['admin', 'organizador'] },
  { name: 'Notificações',       href: '/notificacoes',  icon: Bell,            section: SYSTEM_SECTION, roles: ['admin', 'tecnico', 'organizador'] },
]

const sections = Array.from(new Set(navigation.map(item => item.section)))

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

function getRoleLabel(role: string) {
  if (role === 'admin') return 'Administrador'
  if (role === 'organizador') return 'Coordenador'
  return 'Técnico'
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const isTecnico = user.role === 'tecnico'

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r border-gray-200" style={{ height: '100dvh', position: 'sticky', top: 0 }}>

      {/* Logo */}
      <div className="p-5 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Icon icon={Trophy} size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900">ChampionSystem</h1>
            <p className="text-xs text-gray-500">Gestão de Campeonatos</p>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 overflow-y-auto overscroll-contain py-4 px-3">
        {sections.map((section, idx) => {
          const items = navigation.filter(
            item => item.section === section && item.roles.includes(user.role)
          )
          if (items.length === 0) return null
          return (
            <div key={section} className={idx > 0 ? 'mt-6' : ''}>
              <h2 className="px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                {section}
              </h2>
              <div className="space-y-1">
                {items.map(item => {
                  const isActive = pathname === item.href
                  const NavIcon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                        ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}
                      `}
                    >
                      {isActive && <div className="absolute left-0 w-1 h-8 bg-blue-600 rounded-r-full" />}
                      <Icon icon={NavIcon} size={18} className={isActive ? 'text-blue-600' : 'text-gray-500'} />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Ação rápida — diferente por role */}
        <div className="mt-6">
          <h2 className="px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">AÇÕES RÁPIDAS</h2>
          {isTecnico ? (
            <Link
              href="/times"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              <Icon icon={Plus} size={18} className="text-white" />
              Novo Time
            </Link>
          ) : (
            <Link
              href="/campeonatos/novo"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              <Icon icon={Plus} size={18} className="text-white" />
              Novo Campeonato
            </Link>
          )}
        </div>
      </nav>

      {/* Usuário */}
      <div className="border-t border-gray-200 p-3 shrink-0">
        <Button variant="ghost" size="sm" fullWidth onClick={() => setUserMenuOpen(!userMenuOpen)} className="justify-start! gap-3 px-2!">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold shrink-0 text-sm">
            {getInitials(user.nome)}
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user.nome.split(' ')[0]}</p>
            <p className="text-xs text-gray-500">{getRoleLabel(user.role)}</p>
          </div>
          <Icon icon={ChevronDown} size={16} className={`text-gray-400 transition-transform shrink-0 ${userMenuOpen ? 'rotate-180' : ''}`} />
        </Button>
        {userMenuOpen && (
          <div className="mt-2 py-1">
            <Button variant="ghost" size="sm" fullWidth icon={LogOut} onClick={handleLogout} className="justify-start! text-red-600! hover:bg-red-50!">
              Sair
            </Button>
          </div>
        )}
      </div>
    </aside>
  )
}