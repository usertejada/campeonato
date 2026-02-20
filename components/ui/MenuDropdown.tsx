// src/components/ui/MenuDropdown.tsx
'use client'

import { useState } from 'react'
import { Eye, Edit, Lock, Unlock, Trash2, LucideIcon } from 'lucide-react'

export interface MenuAction {
  label: string
  icon: LucideIcon
  onClick: () => void
  variant?: 'default' | 'danger'
  separator?: boolean
}

interface MenuDropdownProps {
  trigger: React.ReactNode
  actions: MenuAction[]
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

export function MenuDropdown({
  trigger,
  actions,
  position = 'bottom-right'
}: MenuDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const positions = {
    'bottom-right': 'top-full right-0 mt-2',
    'bottom-left':  'top-full left-0 mt-2',
    'top-right':    'bottom-full right-0 mb-2',
    'top-left':     'bottom-full left-0 mb-2',
  }

  const handleAction = (action: MenuAction) => {
    action.onClick()
    setIsOpen(false)
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(v => !v)
  }

  return (
    <div className="relative">
      <div onClick={handleToggle}>{trigger}</div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className={`
            absolute ${positions[position]}
            w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 overflow-hidden
          `}>
            {actions.map((action, index) => {
              const Icon = action.icon
              const isDanger = action.variant === 'danger'
              return (
                <div key={index}>
                  {action.separator && <div className="my-1 border-t border-gray-100" />}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAction(action) }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2.5 text-sm transition
                      ${isDanger
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon size={16} className={isDanger ? '' : 'text-gray-500'} />
                    {action.label}
                  </button>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

// ✅ Agora recebe o status pra alternar Bloquear/Desbloquear
export const createCardActions = (
  status: string,
  onDetalhes?: () => void,
  onEditar?: () => void,
  onBloquear?: () => void,
  onExcluir?: () => void
): MenuAction[] => {
  const bloqueado = status === 'inativo'

  const actions: MenuAction[] = []
  if (onDetalhes) actions.push({ label: 'Detalhes', icon: Eye,  onClick: onDetalhes })
  if (onEditar)   actions.push({ label: 'Editar',   icon: Edit, onClick: onEditar })
  if (onBloquear) actions.push({
    label:   bloqueado ? 'Desbloquear' : 'Bloquear',
    icon:    bloqueado ? Unlock : Lock,
    onClick: onBloquear,
  })
  if (onExcluir)  actions.push({ label: 'Excluir', icon: Trash2, onClick: onExcluir, variant: 'danger', separator: true })
  return actions
}