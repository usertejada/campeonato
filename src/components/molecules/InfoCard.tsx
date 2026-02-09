// src/components/molecules/InfoCard.tsx
import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Icon } from '../atoms/Icon';

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  variant?: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
}

const variantStyles = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-900',
    descColor: 'text-blue-700',
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    iconColor: 'text-green-600',
    titleColor: 'text-green-900',
    descColor: 'text-green-700',
  },
  yellow: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    iconColor: 'text-yellow-600',
    titleColor: 'text-yellow-900',
    descColor: 'text-yellow-700',
  },
  red: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    iconColor: 'text-red-600',
    titleColor: 'text-red-900',
    descColor: 'text-red-700',
  },
  gray: {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    iconColor: 'text-gray-600',
    titleColor: 'text-gray-900',
    descColor: 'text-gray-700',
  },
};

export function InfoCard({ 
  icon, 
  title, 
  description,
  variant = 'blue' 
}: InfoCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className={`${styles.bg} border-2 ${styles.border} rounded-xl p-4`}>
      <div className="flex items-start gap-3">
        <Icon icon={icon} size={20} className={`${styles.iconColor} mt-0.5`} />
        <div className="flex-1">
          <p className={`font-semibold ${styles.titleColor}`}>{title}</p>
          {description && (
            <p className={`text-sm ${styles.descColor} mt-1`}>{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}