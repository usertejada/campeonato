// src/components/times/TabelaTimesTecnico.tsx
'use client'

import { useState, useEffect } from 'react'
import { Users, Settings, Eye, Edit, UserPlus, MapPin, Trophy, Pencil, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { Badge } from '@/components/ui/Badge'
import { MenuDropdown } from '@/components/ui/MenuDropdown'
import type { Time } from '@/types/time'

interface Jogador {
  id: string
  nome: string
  foto_url: string | null
  posicao: string | null
  numero_camisa: number | null
  gols?: number
  cartao_amarelo?: number
  cartao_vermelho?: number
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

// ─── Card de um time ──────────────────────────────────────────────────────────

interface CardTimeTecnicoProps {
  time: Time
  onDetalhes: (t: Time) => void
  onEditar: (t: Time) => void
  onExcluir: (t: Time) => void
  onAdicionarJogador: (t: Time) => void
  onEditarJogador: (j: Jogador, t: Time) => void
  onExcluirJogador: (j: Jogador, t: Time) => void
  jogadores: Jogador[]
  loadingJogadores: boolean
}

function CardTimeTecnico({
  time, onDetalhes, onEditar, onAdicionarJogador,
  onEditarJogador, onExcluirJogador, jogadores, loadingJogadores
}: CardTimeTecnicoProps) {
  const isAprovado = time.aprovado

  const menuActions = [
    { label: 'Detalhes',   icon: Eye,  onClick: () => onDetalhes(time) },
    { label: 'Editar Time', icon: Edit, onClick: () => onEditar(time) },
    ...(isAprovado
      ? [{ label: 'Adicionar Jogador', icon: UserPlus, onClick: () => onAdicionarJogador(time) }]
      : []
    ),
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="bg-linear-to-br from-emerald-500 to-teal-600 px-5 py-4 rounded-t-xl">
        <div className="flex items-center gap-4">

          {/* Logo */}
          {time.logo_url ? (
            <img src={time.logo_url} alt={time.nome} className="w-14 h-14 rounded-full object-cover border-2 border-white/50 shrink-0" />
          ) : (
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center shrink-0 border-2 border-white/30">
              <span className="text-white font-bold text-lg">{getInitials(time.nome)}</span>
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <h3 className="text-white font-bold text-base leading-tight truncate">{time.nome}</h3>
              <Badge
                label={isAprovado ? 'Aprovado' : 'Pendente'}
                variant={isAprovado ? 'success' : 'warning'}
                size="sm"
                model="soft"
                dot
              />
            </div>
            {time.cidade && (
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={11} className="text-white/70 shrink-0" />
                <span className="text-white/70 text-xs truncate">{time.cidade}</span>
              </div>
            )}
            {time.campeonato?.nome && (
              <div className="flex items-center gap-1 mt-0.5">
                <Trophy size={11} className="text-white/70 shrink-0" />
                <span className="text-white/70 text-xs truncate">{time.campeonato.nome}</span>
              </div>
            )}
          </div>

          {/* Engrenagem com MenuDropdown */}
          <div className="shrink-0">
            <MenuDropdown
              trigger={
                <button className="p-2 rounded-lg hover:bg-white/20 transition text-white">
                  <Settings size={18} />
                </button>
              }
              actions={menuActions}
              position="bottom-right"
            />
            {/* Se pendente, mostra aviso abaixo do menu */}
            {!isAprovado && (
              <div className="absolute right-5 mt-1 text-[9px] bg-amber-100 text-amber-500 px-1.5 py-0.5 rounded-full whitespace-nowrap pointer-events-none hidden">
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Tabela de jogadores ─────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Jogador</th>
              <th className="text-center px-3 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Pos</th>
              <th className="text-center px-3 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Gols</th>
              <th className="text-center px-3 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                <span className="inline-block w-3 h-3 bg-yellow-400 rounded-sm" title="Cartão Amarelo" />
              </th>
              <th className="text-center px-3 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                <span className="inline-block w-3 h-3 bg-red-500 rounded-sm" title="Cartão Vermelho" />
              </th>
              <th className="text-center px-3 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">

            {loadingJogadores && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-xs text-gray-400">Carregando jogadores...</td>
              </tr>
            )}

            {!loadingJogadores && jogadores.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  <Users size={20} className="text-gray-200 mx-auto mb-1" />
                  <p className="text-xs text-gray-400 mb-2">Nenhum jogador cadastrado</p>
                  {isAprovado && (
                    <button
                      onClick={() => onAdicionarJogador(time)}
                      className="text-xs text-emerald-600 font-medium hover:underline flex items-center gap-1 mx-auto"
                    >
                      <UserPlus size={12} /> Adicionar jogador
                    </button>
                  )}
                </td>
              </tr>
            )}

            {!loadingJogadores && jogadores.map((jogador) => {
              const cartaoAmarelo  = jogador.cartao_amarelo  ?? 0
              const cartaoVermelho = jogador.cartao_vermelho ?? 0
              const suspenso = cartaoVermelho > 0

              return (
                <tr key={jogador.id} className="hover:bg-gray-50 transition-colors">

                  {/* Jogador */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {jogador.foto_url ? (
                        <img src={jogador.foto_url} alt={jogador.nome} className="w-8 h-8 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-emerald-700 text-[10px] font-bold">{getInitials(jogador.nome)}</span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{jogador.nome}</p>
                        {jogador.numero_camisa && (
                          <p className="text-[10px] text-gray-400">#{jogador.numero_camisa}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Posição */}
                  <td className="px-3 py-3 text-center">
                    {jogador.posicao ? (
                      <span className="inline-block bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded uppercase">
                        {jogador.posicao.substring(0, 3)}
                      </span>
                    ) : <span className="text-gray-300 text-xs">—</span>}
                  </td>

                  {/* Gols */}
                  <td className="px-3 py-3 text-center">
                    <span className="text-sm font-semibold text-gray-700">{jogador.gols ?? 0}</span>
                  </td>

                  {/* Cartão amarelo */}
                  <td className="px-3 py-3 text-center">
                    <span className={`text-sm font-semibold ${cartaoAmarelo > 0 ? 'text-yellow-500' : 'text-gray-300'}`}>
                      {cartaoAmarelo}
                    </span>
                  </td>

                  {/* Cartão vermelho */}
                  <td className="px-3 py-3 text-center">
                    <span className={`text-sm font-semibold ${cartaoVermelho > 0 ? 'text-red-500' : 'text-gray-300'}`}>
                      {cartaoVermelho}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-3 py-3 text-center">
                    <Badge
                      label={suspenso ? 'Suspenso' : 'Ativo'}
                      variant={suspenso ? 'danger' : 'success'}
                      size="sm"
                      model="soft"
                      dot
                    />
                  </td>

                  {/* Ações */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEditarJogador(jogador, time)}
                        className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
                        title="Editar"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => onExcluirJogador(jogador, time)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Excluir"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Footer */}
        {!loadingJogadores && jogadores.length > 0 && (
          <div className="px-5 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between rounded-b-xl">
            <span className="text-xs text-gray-400">{jogadores.length} jogador{jogadores.length !== 1 ? 'es' : ''}</span>
            {isAprovado && (
              <button
                onClick={() => onAdicionarJogador(time)}
                className="text-xs text-emerald-600 font-medium hover:underline flex items-center gap-1"
              >
                <UserPlus size={11} /> Adicionar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

interface TabelaTimesTecnicoProps {
  times: Time[]
  onDetalhes: (t: Time) => void
  onEditar: (t: Time) => void
  onExcluir: (t: Time) => void
  onAdicionarJogador: (t: Time) => void
  onEditarJogador: (j: Jogador, t: Time) => void
  onExcluirJogador: (j: Jogador, t: Time) => void
}

export type { Jogador }

export function TabelaTimesTecnico({
  times, onDetalhes, onEditar, onExcluir, onAdicionarJogador,
  onEditarJogador, onExcluirJogador
}: TabelaTimesTecnicoProps) {
  const [jogadoresPorTime, setJogadoresPorTime] = useState<Record<string, Jogador[]>>({})
  const [loadingIds, setLoadingIds]             = useState<string[]>([])

  const carregarJogadores = (ids: string[]) => {
    if (ids.length === 0) return
    const supabase = createClient()
    setLoadingIds(ids)
    supabase
      .from('jogadores')
      .select('id, nome, foto_url, posicao, numero_camisa, time_id')
      .in('time_id', ids)
      .order('numero_camisa', { ascending: true })
      .then(({ data }) => {
        const agrupado: Record<string, Jogador[]> = {}
        ids.forEach(id => { agrupado[id] = [] })
        ;(data ?? []).forEach((j: any) => {
          if (!agrupado[j.time_id]) agrupado[j.time_id] = []
          agrupado[j.time_id].push(j)
        })
        setJogadoresPorTime(prev => ({ ...prev, ...agrupado }))
        setLoadingIds([])
      })
  }

  useEffect(() => {
    if (times.length === 0) return
    carregarJogadores(times.map(t => t.id))
  }, [times])

  return (
    <div className="space-y-6">
      {times.map(time => (
        <CardTimeTecnico
          key={time.id}
          time={time}
          onDetalhes={onDetalhes}
          onEditar={onEditar}
          onExcluir={onExcluir}
          onAdicionarJogador={onAdicionarJogador}
          onEditarJogador={onEditarJogador}
          onExcluirJogador={onExcluirJogador}
          jogadores={jogadoresPorTime[time.id] ?? []}
          loadingJogadores={loadingIds.includes(time.id)}
        />
      ))}
    </div>
  )
}