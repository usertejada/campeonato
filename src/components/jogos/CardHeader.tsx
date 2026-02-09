// src/components/jogos/CardHeader.tsx

import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface CardHeaderProps {
  icon: LucideIcon;
  iconColor: 'blue' | 'purple' | 'green' | 'pink' | 'orange';
  title: string;
  subtitle: string;
}

const iconColorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600',
  green: 'bg-green-100 text-green-600',
  pink: 'bg-pink-100 text-pink-600',
  orange: 'bg-orange-100 text-orange-600',
};

export function CardHeader({ icon: Icon, iconColor, title, subtitle }: CardHeaderProps) {
  return (
    <div className="flex items-center gap-3 flex-linear-0 mb-2">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconColorClasses[iconColor]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}