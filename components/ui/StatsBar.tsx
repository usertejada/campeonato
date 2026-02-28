// src/components/ui/StatsBar.tsx
'use client'

import { LucideIcon } from 'lucide-react'

export interface StatItem {
  label:     string
  value:     number | string
  icon:      LucideIcon
  iconColor: string  // ex: 'text-blue-500'
  iconBg:    string  // ex: 'bg-blue-100'
}

interface StatsBarProps {
  stats: StatItem[]
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map(stat => {
        const Icon = stat.icon
        return (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
              <Icon size={18} className={stat.iconColor} strokeWidth={2} />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 leading-none">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}