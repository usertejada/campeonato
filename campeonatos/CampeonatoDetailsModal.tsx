// src/components/campeonatos/CampeonatoDetailsModal.tsx
'use client'

import { Modal }          from '@/components/ui/Modal'
import {
  DetailHeader,
  DetailCard,
  DetailIconRow,
  DetailDateChip,
  DetailDarkCard,
} from '@/components/details'
import { Users, LayoutGrid, MapPin, Trophy } from 'lucide-react'

interface CampeonatoDetailsModalProps {
  campeonato: {
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
    anoCriacao?: string
  }
  isOpen: boolean
  onClose: () => void
}

// Mapeia status → props do DetailHeader badge
const statusConfig: Record<string, {
  label: string
  variant: 'success' | 'warning' | 'danger' | 'info' | 'gray'
  glow: string
}> = {
  'agendado':     { label: 'Agendado',     variant: 'info',    glow: '#60a5fa' },
  'em-andamento': { label: 'Em Andamento', variant: 'success', glow: '#34d399' },
  'finalizado':   { label: 'Finalizado',   variant: 'gray',    glow: '#9ca3af' },
  'inativo':      { label: 'Inativo',      variant: 'warning', glow: '#fbbf24' },
  'bloqueado':    { label: 'Bloqueado',    variant: 'danger',  glow: '#f87171' },
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR')
}

export function CampeonatoDetailsModal({
  campeonato,
  isOpen,
  onClose,
}: CampeonatoDetailsModalProps) {
  const status = statusConfig[campeonato.status] ?? {
    label: campeonato.status,
    variant: 'gray' as const,
    glow: '#9ca3af',
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      showCloseButton={false}
      mobileCenter
      header={
        <DetailHeader
          title={campeonato.nome}
          subtitle={campeonato.organizador}
          logo={campeonato.logo}
          fallbackIcon={Trophy}
          badgeLabel={status.label}
          badgeVariant={status.variant}
          badgeGlow={status.glow}
          onClose={onClose}
        />
      }
    >
      {/* Cancela padding do Modal body no mobile */}
      <div className="
        -mx-5 -mt-5 -mb-5
        sm:mx-0 sm:mt-0 sm:mb-0
        px-4 pt-3 pb-4
        sm:px-0 sm:pt-1 sm:pb-0
        bg-gray-50 sm:bg-transparent
        flex flex-col gap-2 sm:gap-2.5
      ">

        {/* Categoria + Equipes */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
          <DetailCard label="Categoria">
            <DetailIconRow
              icon={Users}
              iconBg="bg-violet-100"
              iconColor="text-violet-700"
              value={campeonato.categoria}
            />
          </DetailCard>

          <DetailCard label="Equipes">
            <DetailIconRow
              icon={LayoutGrid}
              iconBg="bg-pink-100"
              iconColor="text-pink-500"
              value={`${campeonato.numeroTimes} equipes`}
            />
          </DetailCard>
        </div>

        {/* Localização */}
        <DetailCard label="Localização">
          <DetailIconRow
            icon={MapPin}
            iconBg="bg-red-100"
            iconColor="text-red-500"
            value={campeonato.local}
            round
          />
        </DetailCard>

        {/* Datas */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
          <DetailCard label="Início">
            <DetailDateChip date={formatDate(campeonato.dataInicio)} iconSide="left" />
          </DetailCard>

          <DetailCard label="Término">
            <DetailDateChip date={formatDate(campeonato.dataTermino)} iconSide="right" />
          </DetailCard>
        </div>

        {/* Formato */}
        <DetailDarkCard
          icon={Trophy}
          label="Formato"
          value={campeonato.formato}
        />

        {/* Ano de fundação */}
        {campeonato.anoCriacao && (
          <DetailCard label="Ano de Fundação" row>
            <span className="text-[13px] sm:text-[14px] font-bold text-violet-700">
              {campeonato.anoCriacao}
            </span>
          </DetailCard>
        )}

      </div>
    </Modal>
  )
}