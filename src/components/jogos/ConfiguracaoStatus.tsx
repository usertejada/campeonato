// src/components/jogos/ConfiguracaoStatus.tsx

import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface ConfiguracaoStatusProps {
  isCompleto: boolean;
}

export function ConfiguracaoStatus({ isCompleto }: ConfiguracaoStatusProps) {
  return (
    <div
      className={`rounded-xl p-2 border-2 lg:min-w-[320px] ${
        isCompleto
          ? 'bg-green-50 border-green-200'
          : 'bg-yellow-50 border-yellow-200'
      }`}
    >
      <div className="flex items-center gap-3">
        {isCompleto ? (
          <CheckCircle className="w-6 h-6 text-green-600 flex-linear-0" />
        ) : (
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-linear-0" />
        )}
        <div>
          <p
            className={`font-semibold ${
              isCompleto ? 'text-green-900' : 'text-yellow-900'
            }`}
          >
            {isCompleto
              ? '✅ Configuração Completa!'
              : '⚠️ Configuração Incompleta'}
          </p>
          <p
            className={`text-sm ${
              isCompleto ? 'text-green-700' : 'text-yellow-700'
            }`}
          >
            {isCompleto
              ? 'Você já pode gerar jogos automaticamente'
              : 'Complete todos os campos abaixo para habilitar a geração automática'}
          </p>
        </div>
      </div>
    </div>
  );
}