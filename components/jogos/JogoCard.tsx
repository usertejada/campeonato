// src/components/jogos/JogoCard.tsx
'use client'

import { Calendar, Clock, MapPin, Settings2, Pencil, CheckCircle, XCircle } from 'lucide-react'
import { MenuDropdown } from '@/components/ui/MenuDropdown'
import { Badge } from '@/components/ui/Badge'

export interface Jogo {
  id: string
  campeonato_id: string
  time_casa_id: string
  time_fora_id: string
  data_hora: string | null
  local: string | null
  rodada: number | null
  placar_casa: number
  placar_fora: number
  finalizado: boolean
  wo: boolean
  observacoes: string | null
  status: string
  tempo_primeiro: number
  tempo_segundo: number
  intervalo: number
  cartoes_amarelos_casa: number
  cartoes_amarelos_fora: number
  cartoes_vermelhos_casa: number
  cartoes_vermelhos_fora: number
  time_casa?: { nome: string; logo_url: string | null } | null
  time_fora?: { nome: string; logo_url: string | null } | null
  campeonato?: { nome: string } | null
}

interface JogoCardProps {
  jogo: Jogo
  onFinalizar?: (jogo: Jogo) => void
  onEditar?: (jogo: Jogo) => void
  onCancelar?: (jogo: Jogo) => void
  canManage?: boolean
}

function TeamLogo({ logo_url, nome }: { logo_url: string | null; nome: string }) {
  if (logo_url) {
    return <img src={logo_url} alt={nome} className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow" />
  }
  return (
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center ring-2 ring-white shadow">
      <span className="text-white text-xs font-bold">{nome.slice(0, 2).toUpperCase()}</span>
    </div>
  )
}

// Mapeamento status → variante do Badge
const statusBadge: Record<string, { label: string; variant: 'info' | 'danger' | 'gray' | 'orange'; dot?: boolean; animateDot?: boolean }> = {
  agendado:     { label: 'Agendado',   variant: 'info',   dot: true },
  em_andamento: { label: 'Ao Vivo',    variant: 'danger', dot: true, animateDot: true },
  finalizado:   { label: 'Finalizado', variant: 'gray',   dot: true },
  cancelado:    { label: 'Cancelado',  variant: 'orange', dot: true },
}

export function JogoCard({ jogo, onFinalizar, onEditar, onCancelar, canManage }: JogoCardProps) {
  const statusInfo = statusBadge[jogo.status] ?? statusBadge.agendado
  const finalizado = jogo.status === 'finalizado' || jogo.wo

  const dataHora      = jogo.data_hora ? new Date(jogo.data_hora) : null
  const dataFormatada = dataHora ? dataHora.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
  const horaFormatada = dataHora ? dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '—'

  const actions = []
  if (canManage) {
    if (!finalizado) {
      actions.push({ label: 'Editar',    icon: Pencil,       onClick: () => onEditar?.(jogo) })
      actions.push({ label: 'Finalizar', icon: CheckCircle,  onClick: () => onFinalizar?.(jogo) })
    }
    if (jogo.status !== 'cancelado' && !finalizado) {
      actions.push({ label: 'Cancelar', icon: XCircle, onClick: () => onCancelar?.(jogo), variant: 'danger' as const, separator: true })
    }
  }

  return (
    <div className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden
      ${finalizado ? 'border-gray-200' : 'border-gray-200 hover:border-emerald-200'}`}>

      {/* Barra topo */}
      <div className={`h-1 w-full ${finalizado ? 'bg-gray-200' : 'bg-gradient-to-r from-emerald-400 to-emerald-600'}`} />

      <div className="p-4">
        {/* Header: rodada + WO + status badge + menu */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            {jogo.rodada && (
              <Badge label={`Rodada ${jogo.rodada}`} variant="gray" size="sm" model="soft" />
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Badge de status — com dot animado se ao vivo */}
            <span className="relative inline-flex items-center">
              {statusInfo.animateDot && (
                <span className="absolute -left-0.5 -top-0.5 w-2 h-2 rounded-full bg-red-400 animate-ping opacity-75" />
              )}
              <Badge
                label={statusInfo.label}
                variant={statusInfo.variant}
                size="sm"
                model="soft"
                dot={statusInfo.dot}
              />
            </span>

            {actions.length > 0 && (
              <MenuDropdown
                position="bottom-left"
                trigger={
                  <button className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings2 size={14} />
                  </button>
                }
                actions={actions}
              />
            )}
          </div>
        </div>

        {/* Placar principal */}
        <div className="flex items-center justify-between gap-2 mb-4">
          {/* Time Casa */}
          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            <TeamLogo logo_url={jogo.time_casa?.logo_url ?? null} nome={jogo.time_casa?.nome ?? 'Casa'} />
            <span className="text-xs font-semibold text-gray-700 text-center leading-tight truncate w-full text-center">
              {jogo.time_casa?.nome ?? 'Time Casa'}
            </span>
          </div>

          {/* Placar */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            {finalizado ? (
              <div className="flex items-center gap-1">
                <span className="text-3xl font-black text-gray-900 tabular-nums">{jogo.placar_casa}</span>
                <span className="text-xl font-light text-gray-300 mx-1">×</span>
                <span className="text-3xl font-black text-gray-900 tabular-nums">{jogo.placar_fora}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <span className="text-3xl font-black text-gray-200 tabular-nums">—</span>
                <span className="text-xl font-light text-gray-200 mx-1">×</span>
                <span className="text-3xl font-black text-gray-200 tabular-nums">—</span>
              </div>
            )}
            <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest">
              {finalizado ? 'Placar Final' : `${jogo.tempo_primeiro}'·${jogo.intervalo}'·${jogo.tempo_segundo}'`}
            </span>
          </div>

          {/* Time Fora */}
          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            <TeamLogo logo_url={jogo.time_fora?.logo_url ?? null} nome={jogo.time_fora?.nome ?? 'Fora'} />
            <span className="text-xs font-semibold text-gray-700 text-center leading-tight truncate w-full text-center">
              {jogo.time_fora?.nome ?? 'Time Fora'}
            </span>
          </div>
        </div>

        {/* W.O. banner — abaixo do placar */}
        {jogo.wo && (
          <div className="flex items-center justify-center gap-1.5 py-1.5 mb-2 bg-orange-50 border border-orange-100 rounded-xl">
            <span className="text-orange-400 text-xs">⚠️</span>
            <span className="text-xs font-semibold text-orange-600">W.O. — Jogo não realizado</span>
          </div>
        )}

        {/* Cartões — só se finalizado e houver cartões */}
        {finalizado && (
          jogo.cartoes_amarelos_casa > 0 || jogo.cartoes_vermelhos_casa > 0 ||
          jogo.cartoes_amarelos_fora > 0 || jogo.cartoes_vermelhos_fora > 0
        ) && (
          <div className="flex items-center justify-between mb-3 px-1">
            {/* Cartões casa */}
            <div className="flex items-center gap-1.5">
              {jogo.cartoes_amarelos_casa > 0 && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-yellow-700">
                  <span className="w-2.5 h-3 bg-yellow-400 rounded-[2px] inline-block shadow-sm" />
                  {jogo.cartoes_amarelos_casa}
                </span>
              )}
              {jogo.cartoes_vermelhos_casa > 0 && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-red-700">
                  <span className="w-2.5 h-3 bg-red-500 rounded-[2px] inline-block shadow-sm" />
                  {jogo.cartoes_vermelhos_casa}
                </span>
              )}
            </div>
            {/* Cartões fora */}
            <div className="flex items-center gap-1.5">
              {jogo.cartoes_amarelos_fora > 0 && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-yellow-700">
                  <span className="w-2.5 h-3 bg-yellow-400 rounded-[2px] inline-block shadow-sm" />
                  {jogo.cartoes_amarelos_fora}
                </span>
              )}
              {jogo.cartoes_vermelhos_fora > 0 && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-red-700">
                  <span className="w-2.5 h-3 bg-red-500 rounded-[2px] inline-block shadow-sm" />
                  {jogo.cartoes_vermelhos_fora}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Rodapé: data, hora, local */}
        <div className="flex items-center gap-3 pt-3 border-t border-gray-50 flex-wrap">
          <span className="flex items-center gap-1 text-[11px] text-gray-500">
            <Calendar size={11} />
            {dataFormatada}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-gray-500">
            <Clock size={11} />
            {horaFormatada}
          </span>
          {jogo.local && (
            <span className="flex items-center gap-1 text-[11px] text-gray-500 min-w-0">
              <MapPin size={11} className="shrink-0" />
              <span className="truncate">{jogo.local}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}