// src/components/details/DetailDarkCard.tsx
import { Icon } from '@/components/ui/Icon'
import { LucideIcon } from 'lucide-react'

interface DetailDarkCardProps {
  icon: LucideIcon
  label: string
  value: string
}

export function DetailDarkCard({ icon, label, value }: DetailDarkCardProps) {
  return (
    <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 flex items-center gap-3">
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
        <Icon icon={icon} size={16} className="text-white sm:w-5 sm:h-5" />
      </div>
      <div>
        <span className="block text-[9px] sm:text-[10px] font-semibold text-white/45 uppercase tracking-widest">
          {label}
        </span>
        <span className="block text-[12px] sm:text-[14px] font-extrabold text-white uppercase tracking-wide mt-0.5">
          {value}
        </span>
      </div>
    </div>
  )
}