// src/components/details/DetailHeader.tsx
'use client'

import { Badge }  from '@/components/ui/Badge'
import { Icon }   from '@/components/ui/Icon'
import { Trophy, X, LucideIcon } from 'lucide-react'

interface DetailHeaderProps {
  title: string
  subtitle?: string
  subtitleLogo?: string | null
  logo?: string | null
  fallbackIcon?: LucideIcon
  badgeLabel: string
  badgeVariant: 'success' | 'warning' | 'danger' | 'info' | 'gray'
  badgeGlow: string
  gradient?: string // classe Tailwind de gradiente
  onClose: () => void
}

export function DetailHeader({
  title,
  subtitle,
  subtitleLogo,
  logo,
  fallbackIcon = Trophy,
  badgeLabel,
  badgeVariant,
  badgeGlow,
  gradient = 'bg-gradient-to-br from-violet-700 via-purple-500 to-pink-500',
  onClose,
}: DetailHeaderProps) {
  return (
    <div className={`
      relative flex flex-col items-center
      ${gradient}
      rounded-t-2xl
      px-5 pt-5 pb-6
      gap-2
    `}>
      {/* Botão fechar */}
      <div className="absolute top-3 right-3">
        <Icon
          icon={X}
          size={15}
          onClick={onClose}
          className="
            w-8 h-8 rounded-full
            text-white
            bg-white/20 hover:bg-white/35
            backdrop-blur-sm
            transition-colors duration-200
          "
        />
      </div>

      {/* Logo / ícone */}
      <div className="
        w-14 h-14 sm:w-16 sm:h-16
        rounded-full bg-white/20 backdrop-blur-md
        flex items-center justify-center
        shadow-lg shrink-0
      ">
        {logo ? (
          <img
            src={logo}
            alt={title}
            className="w-9 h-9 sm:w-10 sm:h-10 object-cover rounded-full"
          />
        ) : (
          <Icon icon={fallbackIcon} size={28} className="text-white" />
        )}
      </div>

      {/* Título + subtítulo */}
      <div className="text-center">
        <h2 className="
          m-0 text-white font-extrabold italic uppercase tracking-wide
          text-[16px] sm:text-[20px] drop-shadow-md
        ">
          {title}
        </h2>
        {subtitle && (
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            {subtitleLogo && (
              <img
                src={subtitleLogo}
                alt={subtitle}
                className="w-6 h-6 rounded-full object-cover"
              />
            )}
            <p className="text-white/80 text-[13px] sm:text-[15px] font-semibold">
              {subtitle}
            </p>
          </div>
        )}
      </div>

      {/* Badge de status */}
      <div className="relative">
        <Badge
          label={badgeLabel}
          variant={badgeVariant}
          model="soft"
          size="md"
          dot
          className="
            bg-white/18! text-white!
            border border-white/35!
            backdrop-blur-md
            tracking-widest uppercase text-[10px] sm:text-[11px]
          "
        />
        {/* Glow dinâmico sobre o dot */}
        <span
          className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full pointer-events-none"
          style={{ boxShadow: `0 0 6px 2px ${badgeGlow}` }}
        />
      </div>
    </div>
  )
}