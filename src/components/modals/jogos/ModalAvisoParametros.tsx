// src/components/modals/parametros/ModalAvisoParametros.tsx

import React from 'react';
import { Modal } from '@/components/molecules/Modal';
import { Button } from '@/components/molecules/Button';
import { Settings, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/router';

interface ModalAvisoParametrosProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalAvisoParametros({
  isOpen,
  onClose,
}: ModalAvisoParametrosProps) {
  const router = useRouter();

  const handleIrParaParametros = () => {
    router.push('/parametros-jogos');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configuração Necessária"
      size="md"
    >
      <div className="space-y-6">
        {/* Ícone de Alerta */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        {/* Mensagem */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Configure os Parâmetros dos Jogos
          </h3>
          <p className="text-sm text-gray-600">
            Antes de gerar jogos automaticamente, você precisa configurar os parâmetros como:
          </p>
        </div>

        {/* Lista de Parâmetros */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span className="text-gray-700"><strong>Locais/Campos:</strong> Onde os jogos acontecerão</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span className="text-gray-700"><strong>Tempo de Jogo:</strong> Duração dos tempos (15, 30 ou 45 min)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span className="text-gray-700"><strong>Horário e Partidas:</strong> Início e quantidade de jogos</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span className="text-gray-700"><strong>Dias da Semana:</strong> Quais dias terão jogos</span>
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-3">
          <Button
            variant="cancel"
            fullWidth
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            fullWidth
            leftIcon={Settings}
            onClick={handleIrParaParametros}
          >
            Configurar Agora
          </Button>
        </div>
      </div>
    </Modal>
  );
}