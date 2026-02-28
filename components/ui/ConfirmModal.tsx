// src/components/ui/ConfirmModal.tsx
'use client'

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Trash2, ShieldOff, ShieldCheck } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  type?: 'excluir' | 'bloquear' | 'desbloquear'
  titulo?: string
  descricao?: string
  loading?: boolean
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  type = 'excluir',
  titulo,
  descricao,
  loading = false,
}: ConfirmModalProps) {
  const config = {
    excluir: {
      titulo:    titulo    ?? 'Excluir campeonato',
      descricao: descricao ?? 'Essa ação é permanente e não pode ser desfeita.',
      icon:      Trash2,
      iconBg:    'bg-red-100',
      iconColor: 'text-red-600',
      btnVariant: 'danger' as const,
      btnLabel:  'Excluir',
    },
    bloquear: {
      titulo:    titulo    ?? 'Bloquear campeonato',
      descricao: descricao ?? 'O campeonato será marcado como inativo.',
      icon:      ShieldOff,
      iconBg:    'bg-yellow-100',
      iconColor: 'text-yellow-600',
      btnVariant: 'outline' as const,
      btnLabel:  'Bloquear',
    },
    desbloquear: {
      titulo:    titulo    ?? 'Desbloquear campeonato',
      descricao: descricao ?? 'O campeonato voltará a ficar ativo.',
      icon:      ShieldCheck,
      iconBg:    'bg-green-100',
      iconColor: 'text-green-600',
      btnVariant: 'outline' as const,
      btnLabel:  'Desbloquear',
    },
  }

  const c = config[type]
  const Icon = c.icon

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center gap-4 py-2">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${c.iconBg}`}>
          <Icon className={`w-7 h-7 ${c.iconColor}`} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{c.titulo}</h3>
          <p className="text-sm text-gray-500">{c.descricao}</p>
        </div>
        <div className="flex gap-3 w-full mt-2">
          <Button variant="ghost" size="md" fullWidth onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant={c.btnVariant} size="md" fullWidth onClick={onConfirm} disabled={loading}>
            {loading ? 'Aguarde...' : c.btnLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}