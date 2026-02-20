// src/components/ui/Badge.tsx

interface BadgeProps {
  label: string
  variant?: 
    | 'success' 
    | 'warning' 
    | 'danger' 
    | 'info' 
    | 'purple' 
    | 'orange' 
    | 'gray'
    | 'blue'
  size?: 'sm' | 'md'
  model?: 'filled' | 'outline' | 'soft' | 'standard'
  dot?: boolean
  className?: string
}

export function Badge({
  label,
  variant = 'info',
  size = 'md',
  model = 'soft',
  dot = false,
  className = ''
}: BadgeProps) {

  // CORES por variant
  const variants = {
    filled: {
      success: 'bg-green-600 text-white',
      warning: 'bg-yellow-500 text-white',
      danger:  'bg-red-600 text-white',
      info:    'bg-blue-600 text-white',
      purple:  'bg-purple-600 text-white',
      orange:  'bg-orange-500 text-white',
      gray:    'bg-gray-600 text-white',
      blue:    'bg-blue-500 text-white',
    },
    soft: {
      success: 'bg-green-100 text-green-700',
      warning: 'bg-yellow-100 text-yellow-700',
      danger:  'bg-red-100 text-red-700',
      info:    'bg-blue-100 text-blue-700',
      purple:  'bg-purple-100 text-purple-700',
      orange:  'bg-orange-100 text-orange-700',
      gray:    'bg-gray-100 text-gray-600',
      blue:    'bg-blue-50 text-blue-600',
    },
    outline: {
      success: 'border border-green-500 text-green-600',
      warning: 'border border-yellow-500 text-yellow-600',
      danger:  'border border-red-500 text-red-600',
      info:    'border border-blue-500 text-blue-600',
      purple:  'border border-purple-500 text-purple-600',
      orange:  'border border-orange-500 text-orange-600',
      gray:    'border border-gray-400 text-gray-600',
      blue:    'border border-blue-400 text-blue-500',
    },
    standard: {
      success: 'text-green-600',
      warning: 'text-yellow-600',
      danger:  'text-red-600',
      info:    'text-blue-600',
      purple:  'text-purple-600',
      orange:  'text-orange-600',
      gray:    'text-gray-600',
      blue:    'text-blue-500',
    }
  }

  // TAMANHOS
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }

  // COR DO DOT
  const dotColors = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger:  'bg-red-500',
    info:    'bg-blue-500',
    purple:  'bg-purple-500',
    orange:  'bg-orange-500',
    gray:    'bg-gray-500',
    blue:    'bg-blue-400',
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 
        font-medium rounded-full
        ${variants[model][variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`} />
      )}
      {label}
    </span>
  )
}