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
  
  // Variante gradient (com fundo colorido) - ESTILO CLASSIFICAÇÃO
  if (variant === 'gradient') {
    return (
      <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300`}>
        <div className="flex items-center gap-3">
          {/* Ícone com background branco semi-transparente */}
          <div className="shrink-0 w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Icon icon={icon} size={20} className="text-white" />
          </div>
          
          {/* Informações */}
          <div className="flex-1 min-w-0">
            <p className="text-white/90 text-[10px] font-bold uppercase tracking-widest mb-0.5">
              {title}
            </p>
            <p className="text-2xl font-black text-white leading-none">
              {value}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Variante compacta (horizontal)
  if (variant === 'compact') {
    // Se tiver gradiente, aplica fundo colorido
    const bgClass = gradientFrom && gradientTo 
      ? `bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white`
      : 'bg-white text-gray-900 border border-gray-200';
    
    const iconBgClass = gradientFrom && gradientTo
      ? 'bg-white/20 backdrop-blur-sm'
      : 'bg-blue-50';
    
    const iconColorClass = gradientFrom && gradientTo
      ? 'text-white'
      : iconColor;
    
    const titleColorClass = gradientFrom && gradientTo
      ? 'text-white/90'
      : 'text-gray-600';
    
    const valueColorClass = gradientFrom && gradientTo
      ? 'text-white'
      : 'text-gray-900';
    
    return (
      <div className={`rounded-2xl p-5 shadow-lg transition-all duration-300 hover:shadow-xl ${bgClass}`}>
        <div className="flex items-center gap-3">
          {/* Ícone */}
          <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${iconBgClass}`}>
            <Icon icon={icon} size={20} className={iconColorClass} />
          </div>
          
          {/* Informações */}
          <div className="flex-1 min-w-0">
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${titleColorClass}`}>
              {title}
            </p>
            <p className={`text-2xl font-black leading-none ${valueColorClass}`}>
              {value}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Variante padrão (vertical com trend)
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgColor}`}>
          <Icon icon={icon} size={24} className={iconColor} />
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${trend.isPositive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}
          </span>
        )}
      </div>
      <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest mb-2">{title}</p>
      <p className="text-3xl font-black text-gray-900">{value}</p>
    </div>
  );
}