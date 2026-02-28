// src/components/layout/Breadcrumb.tsx

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ChevronRight } from 'lucide-react'

const routeNameMap: Record<string, string> = {
  'dashboard':    'Dashboard',
  'campeonatos':  'Campeonatos',
  'times':        'Times',
  'jogadores':    'Jogadores',
  'jogos':        'Jogos',
  'historico':    'Histórico de Jogos',
  'classificacao':'Classificação',
  'mata-mata':    'Mata-Mata',
  'artilharia':   'Artilharia',
  'configuracoes':'Configurações',
  'notificacoes': 'Notificações',
}

export function Breadcrumb() {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(segment => segment && isNaN(Number(segment)))

  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      <Link
        href="/dashboard"
        className="flex items-center text-gray-500 hover:text-blue-600 transition-colors"
      >
        <Home size={16} />
      </Link>

      {pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1
        const displayName = routeNameMap[segment] || segment
        const href = '/' + pathSegments.slice(0, index + 1).join('/')

        return (
          <div key={segment} className="flex items-center gap-2">
            <ChevronRight size={16} className="text-gray-400" />
            {isLast ? (
              <span className="font-medium text-gray-900">{displayName}</span>
            ) : (
              <Link
                href={href}
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                {displayName}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}