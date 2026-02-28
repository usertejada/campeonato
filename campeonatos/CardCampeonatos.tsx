// src/components/campeonatos/CardCampeonatos.tsx
'use client'

import { MapPin, Users, Calendar, Settings } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { HeaderCard } from '@/components/ui/HeaderCard'
import { MenuDropdown, createCardActions } from '@/components/ui/MenuDropdown'

interface CardCampeonatosProps {
  id: string
  nome: string
  organizador: string
  local: string
  logo?: string | null
  categoria: string
  status: string
  formato: string
  numeroTimes: number
  dataInicio: string
  dataTermino: string
  onClick?: () => void
  onEditar?: () => void
  onDetalhes?: () => void
  onBloquear?: () => void
  onExcluir?: () => void
}

export default function CardCampeonatos({
  nome,
  organizador,
  local,
  logo,
  status,
  numeroTimes,
  dataInicio,
  dataTermino,
  onClick,
  onEditar,
  onDetalhes,
  onBloquear,
  onExcluir,
}: CardCampeonatosProps) {

  const statusBadge: Record<string, { variant: any; label: string }> = {
    'agendado':   { variant: 'info',    label: 'Agendado'   },
    'ativo':      { variant: 'success', label: 'Ativo'      },
    'finalizado': { variant: 'gray',    label: 'Finalizado' },
    'inativo':    { variant: 'warning', label: 'Inativo'    },
    'bloqueado':  { variant: 'danger',  label: 'Bloqueado'  },
  }

  const badge = statusBadge[status.toLowerCase()] || { variant: 'gray', label: status }

  // ✅ Passa o status pra alternar Bloquear/Desbloquear no menu
  const menuActions = createCardActions(status, onDetalhes, onEditar, onBloquear, onExcluir)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">

      <HeaderCard
        title={nome}
        subtitle={organizador}
        logo={logo}
        onClick={onClick}
        action={
          <MenuDropdown
            trigger={
              <button className="p-1.5 rounded-lg hover:bg-white/20 transition text-white">
                <Settings size={18} />
              </button>
            }
            actions={menuActions}
            position="bottom-left"
          />
        }
      />

      <div className="p-4">
        <div className="flex justify-end mb-3">
          <Badge label={badge.label} variant={badge.variant} size="sm" model="soft" dot />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-gray-700">{numeroTimes} times</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-gray-700 truncate">{local}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-gray-700">
              {new Date(dataInicio + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
              {' - '}
              {new Date(dataTermino + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            variant="soft-blue"
            size="md"
            fullWidth
            onClick={(e) => { e?.stopPropagation(); onDetalhes?.() }}
          >
            Detalhes
          </Button>
          <Button
            variant="soft"
            size="md"
            fullWidth
            onClick={(e) => { e?.stopPropagation(); onEditar?.() }}
          >
            Editar
          </Button>
        </div>
      </div>
    </div>
  )
}