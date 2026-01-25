// src/components/molecules/PageHeader.tsx
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Título e Subtítulo */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            {subtitle}
          </p>
        )}
      </div>

      {/* Ação (Botão) - Fica embaixo em mobile */}
      {action && (
        <div className="flex justify-start">
          {action}
        </div>
      )}
    </div>
  );
}