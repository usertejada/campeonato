// src/components/ui/Icon.tsx

import { LucideIcon } from 'lucide-react'

interface IconProps {
  icon: LucideIcon
  size?: number
  className?: string
  onClick?: (e: React.MouseEvent) => void
}

export function Icon({ 
  icon: IconComponent, 
  size = 20, 
  className = '',
  onClick 
}: IconProps) {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`inline-flex items-center justify-center ${className}`}
      >
        <IconComponent size={size} />
      </button>
    )
  }

  return <IconComponent size={size} className={className} />
}