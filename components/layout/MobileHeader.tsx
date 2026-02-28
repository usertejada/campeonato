// src/components/layout/MobileHeader.tsx
'use client'

import { Trophy, Plus, LogOut, ChevronDown } from 'lucide-react'
import { Icon } from '@/components/ui/Icon'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface MobileHeaderProps {
  onAdd?: () => void
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

function getRoleLabel(role: string) {
  if (role === 'admin') return 'Administrador'
  if (role === 'organizador') return 'Coordenador'
  return 'Técnico'
}

export function MobileHeader({ onAdd }: MobileHeaderProps) {
  const [user,        setUser]        = useState<{ nome: string; role: string } | null>(null)
  const [menuOpen,    setMenuOpen]    = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router  = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data: profile } = await supabase
        .from('profiles')
        .select('nome, role')
        .eq('id', user.id)
        .single()
      if (profile) setUser(profile)
    })
  }, [])

  // Fecha o menu ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header
      className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 flex items-center justify-between px-4"
      style={{ height: '56px' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Icon icon={Trophy} size={16} className="text-white" />
        </div>
        <span className="text-base font-bold text-gray-900">ChampionSystem</span>
      </div>

      {/* Direita: botão add + avatar */}
      <div className="flex items-center gap-2">
        {onAdd && (
          <button
            onClick={onAdd}
            className="w-9 h-9 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors shadow-sm shadow-blue-500/40 active:scale-95"
          >
            <Plus size={20} className="text-white" />
          </button>
        )}

        {/* Avatar com dropdown */}
        {user && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-100 transition-colors active:scale-95"
            >
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                {getInitials(user.nome)}
              </div>
              <ChevronDown
                size={14}
                className={`text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-50">
                {/* Info do usuário */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {getInitials(user.nome)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.nome.split(' ')[0]}</p>
                    <p className="text-xs text-gray-400">{getRoleLabel(user.role)}</p>
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={15} />
                  Sair
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}