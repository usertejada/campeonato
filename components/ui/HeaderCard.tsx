// src/components/ui/HeaderCard.tsx

'use client'

import { Trophy } from 'lucide-react'
import { Icon } from './Icon'

interface HeaderCardProps {
  title: string
  subtitle?: string
  logo?: string | null
  gradient?: string
  action?: React.ReactNode
  onClick?: () => void
}

export function HeaderCard({
  title,
  subtitle,
  logo,
  gradient = 'from-blue-500 to-purple-600',
  action,
  onClick
}: HeaderCardProps) {
  return (
    <div className={`bg-linear-to-br ${gradient} p-4`}>
      <div className="flex items-center justify-between gap-2">
        {/* Logo + Título clicável */}
        <div
          onClick={onClick}
          className={`flex items-center gap-3 min-w-0 flex-1 ${onClick ? 'cursor-pointer' : ''}`}
        >
          {logo ? (
            <img
              src={logo}
              alt={title}
              className="w-12 h-12 object-cover rounded-full border-2 border-white shrink-0"
            />
          ) : (
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0">
              <Icon icon={Trophy} size={24} className="text-blue-600" />
            </div>
          )}

          <div className="min-w-0">
            <h3 className="font-bold text-white text-sm leading-tight truncate">
              {title}
            </h3>
            {subtitle && (
              <p className="text-white/75 text-xs truncate">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Ação (ex: menu) */}
        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  )
}