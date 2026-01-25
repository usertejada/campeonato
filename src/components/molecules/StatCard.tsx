// src/components/molecules/StatCard.tsx
import React from 'react';
import { Icon } from '../atoms/Icon';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: 'default' | 'compact';
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  iconColor = 'text-blue-600',
  iconBgColor = 'bg-blue-50',
  trend,
  variant = 'default'
}: StatCardProps) {
  
  // Variante compacta (horizontal)
  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 transition-all duration-200 hover:border-blue-400 flex items-center gap-4">
        {/* Ícone menor e lateral */}
        <div className={`flex-shrink-0 p-3 rounded-lg ${iconBgColor} bg-opacity-10`}>
          <Icon icon={icon} size={20} className={iconColor} />
        </div>
        
        {/* Informações alinhadas verticalmente */}
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-tight">
            {title}
          </span>
          <span className="text-xl font-bold text-gray-900 leading-tight">
            {value}
          </span>
        </div>
      </div>
    );
  }

  // Variante padrão (vertical com trend)
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBgColor}`}>
          <Icon icon={icon} size={24} className={iconColor} />
        </div>
        {trend && (
          <span className={`text-sm font-semibold ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}
          </span>
        )}
      </div>
      <p className="text-gray-500 text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}