// src/components/molecules/PageHeader.tsx
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  titleClassName?: string;
}

export function PageHeader({ title, subtitle, action, titleClassName = '' }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Título e Subtítulo */}
      <div className="flex-1">
        <h1 className={`text-2xl sm:text-3xl font-bold text-gray-900 ${titleClassName}`}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            {subtitle}
          </p>
        )}
      </div>

      {/* Ação (Botão) */}
      {action && (
        <div className="md:shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}