// src/components/details/DetailDateChip.tsx
import { Icon } from '@/components/ui/Icon'
import { Calendar } from 'lucide-react'

interface DetailDateChipProps {
  date: string       // já formatada (ex: '15/01/2026')
  iconSide?: 'left' | 'right'
}

export function DetailDateChip({ date, iconSide = 'left' }: DetailDateChipProps) {
  return (
    <div className="mt-1.5 inline-flex items-center gap-1 sm:gap-1.5 bg-gray-100 rounded-lg px-2 py-1 sm:px-2.5 sm:py-1.5 self-start">
      {iconSide === 'left' && (
        <Icon icon={Calendar} size={10} className="text-gray-500 sm:w-3 sm:h-3" />
      )}
      <span className="text-[11px] sm:text-[12px] font-bold text-gray-900">
        {date}
      </span>
      {iconSide === 'right' && (
        <Icon icon={Calendar} size={10} className="text-gray-500 sm:w-3 sm:h-3" />
      )}
    </div>
  )
}