// src/components/jogadores/JogadorDetailsModal.tsx
'use client'

import { Modal }         from '@/components/ui/Modal'
import {
  DetailHeader,
  DetailCard,
  DetailIconRow,
  DetailDateChip,
  DetailDarkCard,
} from '@/components/details'
import { User, Shirt, Phone, FileText, Flag } from 'lucide-react'
import type { Jogador } from '@/types/jogadores'
import { useEstatisticasJogadores } from '@/hooks/useEstatisticasJogadores'

interface JogadorDetailsModalProps {
  jogador: Jogador
  isOpen: boolean
  onClose: () => void
  campeonatoId?: string
}

const POSICAO_CONFIG: Record<string, { bg: string; color: string }> = {
  Goleiro:  { bg: 'bg-yellow-100', color: 'text-yellow-700' },
  Zagueiro: { bg: 'bg-blue-100',   color: 'text-blue-700'   },
  Lateral:  { bg: 'bg-cyan-100',   color: 'text-cyan-700'   },
  Volante:  { bg: 'bg-violet-100', color: 'text-violet-700' },
  Meia:     { bg: 'bg-pink-100',   color: 'text-pink-600'   },
  Atacante: { bg: 'bg-red-100',    color: 'text-red-600'    },
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return null
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR')
}

export function JogadorDetailsModal({ jogador, isOpen, onClose, campeonatoId }: JogadorDetailsModalProps) {
  const posConfig = POSICAO_CONFIG[jogador.posicao ?? ''] ?? {
    bg: 'bg-gray-100',
    color: 'text-gray-600',
  }

  // Busca estatísticas do jogador
  const { stats } = useEstatisticasJogadores({
    jogadorIds: [jogador.id],
    campeonatoId,
  })
  const stat      = stats.get(jogador.id)
  const gols      = stat?.gols      ?? 0
  const amarelos  = stat?.amarelos  ?? 0
  const vermelhos = stat?.vermelhos ?? 0

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      showCloseButton={false}
      mobileCenter
      header={
        <DetailHeader
          title={jogador.nome}
          subtitle={jogador.time?.nome}
          subtitleLogo={jogador.time?.logo_url ?? null}
          logo={jogador.foto_url ?? null}
          fallbackIcon={User}
          badgeLabel={jogador.posicao ?? 'Sem posição'}
          badgeVariant="info"
          badgeGlow="#60a5fa"
          gradient="bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500"
          onClose={onClose}
        />
      }
    >
      <div className="
        -mx-5 -mt-5 -mb-5
        sm:mx-0 sm:mt-0 sm:mb-0
        px-4 pt-3 pb-4
        sm:px-0 sm:pt-1 sm:pb-0
        bg-gray-50 sm:bg-transparent
        flex flex-col gap-2 sm:gap-2.5
      ">

        {/* Posição + Número da Camisa */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
          <DetailCard label="Posição">
            <DetailIconRow
              icon={User}
              iconBg={posConfig.bg}
              iconColor={posConfig.color}
              value={jogador.posicao ?? '—'}
            />
          </DetailCard>

          <DetailCard label="Camisa">
            <DetailIconRow
              icon={Shirt}
              iconBg="bg-emerald-100"
              iconColor="text-emerald-700"
              value={jogador.numero_camisa ? `#${jogador.numero_camisa}` : '—'}
            />
          </DetailCard>
        </div>

        {/* Estatísticas: Gols · Amarelos · Vermelhos */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
          {/* Gols */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-2 gap-0.5">
            <span className={`text-base font-extrabold leading-none ${gols > 0 ? 'text-emerald-600' : 'text-gray-300'}`}>
              {gols}
            </span>
            <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide mt-0.5">Gols</span>
          </div>

          {/* Cartões Amarelos */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-2 gap-0.5">
            <div className="flex items-center gap-0.5">
              <span className="text-xs">🟡</span>
              <span className={`text-base font-extrabold leading-none ${amarelos > 0 ? 'text-yellow-500' : 'text-gray-300'}`}>
                {amarelos}
              </span>
            </div>
            <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide mt-0.5">Amarelos</span>
          </div>

          {/* Cartões Vermelhos */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-2 gap-0.5">
            <div className="flex items-center gap-0.5">
              <span className="text-xs">🔴</span>
              <span className={`text-base font-extrabold leading-none ${vermelhos > 0 ? 'text-red-500' : 'text-gray-300'}`}>
                {vermelhos}
              </span>
            </div>
            <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide mt-0.5">Vermelhos</span>
          </div>
        </div>

        {/* Data de Nascimento + Nacionalidade */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
          {jogador.data_nascimento && (
            <DetailCard label="Nascimento">
              <DetailDateChip date={formatDate(jogador.data_nascimento)!} iconSide="left" />
            </DetailCard>
          )}

          {jogador.nacionalidade && (
            <DetailCard label="Nacionalidade">
              <DetailIconRow
                icon={Flag}
                iconBg="bg-blue-100"
                iconColor="text-blue-600"
                value={jogador.nacionalidade}
              />
            </DetailCard>
          )}
        </div>

        {/* Documento */}
        {jogador.doc_numero && (
          <DetailDarkCard
            icon={FileText}
            label={jogador.doc_tipo?.toUpperCase() ?? 'Documento'}
            value={jogador.doc_numero}
          />
        )}

        {/* Telefone */}
        {jogador.telefone && (
          <DetailCard label="Telefone" row>
            <DetailIconRow
              icon={Phone}
              iconBg="bg-gray-100"
              iconColor="text-gray-500"
              value={jogador.telefone}
            />
          </DetailCard>
        )}

      </div>
    </Modal>
  )
}