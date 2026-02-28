// src/components/details/DetailIconRow.tsx
import { Icon } from '@/components/ui/Icon'
import { LucideIcon } from 'lucide-react'

interface DetailIconRowProps {
  icon: LucideIcon
  iconBg: string       // ex: 'bg-violet-100'
  iconColor: string    // ex: 'text-violet-700'
  value: string
  round?: boolean      // caixinha quadrada ou círculo
}

export function DetailIconRow({
  icon,
  iconBg,
  iconColor,
  value,
  round = false,
}: DetailIconRowProps) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5">
      <div className={`
        flex items-center justify-content shrink-0
        ${round
          ? 'w-8 h-8 sm:w-9 sm:h-9 rounded-full'
          : 'w-6 h-6 sm:w-7 sm:h-7 rounded-lg'
        }
        ${iconBg}
        flex items-center justify-center
      `}>
        <Icon
          icon={icon}
          size={round ? 16 : 12}
          className={`${iconColor} ${round ? '' : 'sm:w-3.5 sm:h-3.5'}`}
        />
      </div>
      <span className="text-[12px] sm:text-[13px] font-bold text-gray-900 leading-tight">
        {value}
      </span>
    </div>
  )
}