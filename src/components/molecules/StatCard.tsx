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
  variant?: 'default' | 'compact' | 'gradient';
  gradientFrom?: string;
  gradientTo?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  iconColor = 'text-blue-600',
  iconBgColor = 'bg-blue-50',
  trend,
  variant = 'default',
  gradientFrom = 'from-blue-500',
  gradientTo = 'to-blue-600'
}: StatCardProps) {
  
  // Variante gradient (com fundo colorido)
  if (variant === 'gradient') {
    return (
      <div className={`bg-linear-to-br ${gradientFrom} ${gradientTo} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow`}>
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
            <Icon icon={icon} size={24} className="text-white" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-3xl font-black">
            {value}
          </div>
          <div className="text-white/90 text-sm font-medium">
            {title}
          </div>
        </div>
      </div>
    );
  }
  
  // Variante compacta (horizontal)
  if (variant === 'compact') {
    // Se tiver gradiente, aplica fundo colorido
    const bgClass = gradientFrom && gradientTo 
      ? `bg-gradient-to-br ${gradientFrom} ${gradientTo} text-white border-transparent`
      : 'bg-white text-gray-900 border-gray-100';
    
    const iconBgClass = gradientFrom && gradientTo
      ? 'bg-white/20 backdrop-blur-sm'
      : `${iconBgColor} bg-opacity-10`;
    
    const iconColorClass = gradientFrom && gradientTo
      ? 'text-white'
      : iconColor;
    
    const titleColorClass = gradientFrom && gradientTo
      ? 'text-white/80'
      : 'text-gray-500';
    
    const valueColorClass = gradientFrom && gradientTo
      ? 'text-white'
      : 'text-gray-900';
    
    return (
      <div className={`rounded-xl p-4 shadow-sm border transition-all duration-200 hover:shadow-lg flex items-center gap-4 ${bgClass}`}>
        {/* Ícone menor e lateral */}
        <div className={`shrink-0 p-3 rounded-lg ${iconBgClass}`}>
          <Icon icon={icon} size={20} className={iconColorClass} />
        </div>
        
        {/* Informações alinhadas verticalmente */}
        <div className="flex flex-col">
          <span className={`text-xs font-semibold uppercase tracking-tight ${titleColorClass}`}>
            {title}
          </span>
          <span className={`text-xl font-bold leading-tight ${valueColorClass}`}>
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