// src/components/atoms/Badge.tsx
import React from 'react';

type BadgeVariant = 'dot' | 'text' | 'filled';
type BadgeColor = 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray' | 'orange';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  color?: BadgeColor;
  className?: string;
}

const colorClasses: Record<BadgeColor, { dot: string; text: string; filled: string }> = {
  blue: {
    dot: 'text-blue-600',
    text: 'text-blue-600',
    filled: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  green: {
    dot: 'text-green-600',
    text: 'text-green-600',
    filled: 'bg-green-100 text-green-700 border-green-200'
  },
  yellow: {
    dot: 'text-yellow-600',
    text: 'text-yellow-600',
    filled: 'bg-yellow-100 text-yellow-700 border-yellow-200'
  },
  red: {
    dot: 'text-red-600',
    text: 'text-red-600',
    filled: 'bg-red-100 text-red-700 border-red-200'
  },
  purple: {
    dot: 'text-purple-600',
    text: 'text-purple-600',
    filled: 'bg-purple-100 text-purple-700 border-purple-200'
  },
  gray: {
    dot: 'text-gray-600',
    text: 'text-gray-600',
    filled: 'bg-gray-100 text-gray-700 border-gray-200'
  },
  orange: {
    dot: 'text-orange-600',
    text: 'text-orange-600',
    filled: 'bg-orange-100 text-orange-700 border-orange-200'
  }
};

export function Badge({ 
  children, 
  variant = 'filled', 
  color = 'blue',
  className = '' 
}: BadgeProps) {
  const baseClasses = 'text-[11px] font-bold py-1 px-3 rounded-lg inline-flex items-center gap-1.5';
  
  // Variante com bolinha (dot)
  if (variant === 'dot') {
    return (
      <span className={`${baseClasses} ${colorClasses[color].dot} ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
        {children}
      </span>
    );
  }
  
  // Variante só texto colorido
  if (variant === 'text') {
    return (
      <span className={`${baseClasses} ${colorClasses[color].text} ${className}`}>
        {children}
      </span>
    );
  }
  
  // Variante com fundo (filled)
  return (
    <span className={`${baseClasses} ${colorClasses[color].filled} border ${className}`}>
      {children}
    </span>
  );
}