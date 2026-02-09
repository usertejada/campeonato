// src/components/modals/ModalMensagem.tsx

import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Modal } from '@/components/molecules/Modal';
import { Button } from '@/components/molecules/Button';
import { Icon } from '@/components/atoms/Icon';

interface ModalMensagemProps {
  isOpen: boolean;
  onClose: () => void;
  tipo: 'sucesso' | 'erro';
  titulo?: string;
  mensagem: string;
}

export function ModalMensagem({
  isOpen,
  onClose,
  tipo,
  titulo,
  mensagem,
}: ModalMensagemProps) {
  const isSucesso = tipo === 'sucesso';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={titulo || (isSucesso ? 'Sucesso!' : 'Erro')}
      size="md"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Ícone */}
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center ${
            isSucesso ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          <Icon
            icon={isSucesso ? CheckCircle : AlertCircle}
            size={48}
            className={isSucesso ? 'text-green-600' : 'text-red-600'}
          />
        </div>

        {/* Mensagem */}
        <p
          className={`text-base ${
            isSucesso ? 'text-green-700' : 'text-red-700'
          }`}
        >
          {mensagem}
        </p>

        {/* Botão */}
        <div className="w-full pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={onClose}
            fullWidth
            className={
              isSucesso
                ? 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                : 'bg-red-600 hover:bg-red-700 active:bg-red-800'
            }
          >
            OK
          </Button>
        </div>
      </div>
    </Modal>
  );
}