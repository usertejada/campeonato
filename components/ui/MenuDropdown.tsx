// src/components/ui/MenuDropdown.tsx
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
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

interface DropdownCoords {
  top: number
  left: number
}

export function MenuDropdown({
  trigger,
  actions,
  position = 'bottom-right'
}: MenuDropdownProps) {
  const [isOpen, setIsOpen]   = useState(false)
  const [coords, setCoords]   = useState<DropdownCoords>({ top: 0, left: 0 })
  const [mounted, setMounted] = useState(false)
  const triggerRef            = useRef<HTMLDivElement>(null)

  // Garante que o portal só renderiza no cliente (evita erro de SSR)
  useEffect(() => { setMounted(true) }, [])

  const calcularPosicao = useCallback(() => {
    if (!triggerRef.current) return
    const rect    = triggerRef.current.getBoundingClientRect()
    const LARGURA = 176 // w-44 = 11rem = 176px
    const GAP     = 4   // espaço entre trigger e menu

    let top: number
    let left: number

    if (position.startsWith('bottom')) {
      top = rect.bottom + GAP + window.scrollY
    } else {
      top = rect.top - GAP + window.scrollY - 130
    }

    if (position.endsWith('left')) {
      // abre para a esquerda: borda direita do menu = borda direita do botão
      left = rect.right - LARGURA + window.scrollX
    } else {
      // abre para a direita: borda esquerda do menu = borda esquerda do botão
      left = rect.left + window.scrollX
    }

    setCoords({ top, left })
  }, [position])

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    calcularPosicao()
    setIsOpen(v => !v)
  }

  const handleAction = (action: MenuAction) => {
    action.onClick()
    setIsOpen(false)
  }

  // Fecha ao rolar ou redimensionar
  useEffect(() => {
    if (!isOpen) return
    const fechar = () => setIsOpen(false)
    window.addEventListener('scroll', fechar, true)
    window.addEventListener('resize', fechar)
    return () => {
      window.removeEventListener('scroll', fechar, true)
      window.removeEventListener('resize', fechar)
    }
  }, [isOpen])

  return (
    <div ref={triggerRef} className="relative inline-block">
      <div onClick={handleToggle}>{trigger}</div>

      {isOpen && mounted && createPortal(
        <>
          {/* Overlay invisível para fechar ao clicar fora */}
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu renderizado direto no body — escapa de qualquer overflow */}
          <div
            style={{ position: 'absolute', top: coords.top, left: coords.left }}
            className="z-[9999] w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1 overflow-hidden"
          >
            {actions.map((action, index) => {
              const Icon     = action.icon
              const isDanger = action.variant === 'danger'
              return (
                <div key={index}>
                  {action.separator && (
                    <div className="my-1 border-t border-gray-100" />
                  )}
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
        </>,
        document.body
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