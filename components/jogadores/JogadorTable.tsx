// src/components/jogadores/JogadorTable.tsx
'use client'

import { Button } from '@/components/ui/Button'
import { MenuDropdown } from '@/components/ui/MenuDropdown'
import { Settings2, Pencil, ArrowRightLeft, Trash2, UserPlus, Eye } from 'lucide-react'
import type { Jogador } from '@/types/jogadores'
import { useEstatisticasJogadores } from '@/hooks/useEstatisticasJogadores'

// ── Helpers ───────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

// ── Props ─────────────────────────────────────────────────────

interface JogadoresTableProps {
  paginado:      Jogador[]
  filtrado:      Jogador[]
  isTecnico:     boolean
  page:          number
  totalPages:    number
  PAGE_SIZE:     number
  campeonatoId?: string   // opcional: filtra estatísticas por campeonato
  onAdicionar:   () => void
  onEditar:      (jogador: Jogador) => void
  onExcluir:     (jogador: Jogador) => void
  onTransferir:  (jogador: Jogador) => void
  onDetalhes:    (jogador: Jogador) => void
  onPageChange:  (fn: (p: number) => number) => void
}

// ── Component ─────────────────────────────────────────────────

export function JogadoresTable({
  paginado,
  filtrado,
  isTecnico,
  page,
  totalPages,
  PAGE_SIZE,
  campeonatoId,
  onAdicionar,
  onEditar,
  onExcluir,
  onTransferir,
  onDetalhes,
  onPageChange,
}: JogadoresTableProps) {
  const gridCols = isTecnico
    ? 'grid-cols-[2fr_80px_70px_50px_50px_90px_80px]'
    : 'grid-cols-[2fr_1.5fr_80px_70px_50px_50px_90px_80px]'

  // Busca estatísticas reais de todos os jogadores da página atual
  const jogadorIds = paginado.map(j => j.id)
  const { stats } = useEstatisticasJogadores({ jogadorIds, campeonatoId })

  const getActions = (jogador: Jogador) => [
    { label: 'Detalhes',   icon: Eye,            onClick: () => onDetalhes(jogador) },
    { label: 'Editar',     icon: Pencil,         onClick: () => onEditar(jogador) },
    { label: 'Transferir', icon: ArrowRightLeft, onClick: () => onTransferir(jogador) },
    { label: 'Excluir',    icon: Trash2,         onClick: () => onExcluir(jogador), variant: 'danger' as const, separator: true },
  ]

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        {/* ── Header desktop ─────────────────────────────────────── */}
        <div className={`hidden md:grid ${gridCols} gap-2 px-4 py-3.5 bg-linear-to-r from-indigo-500 via-violet-500 to-purple-500`}>
          <span className="text-[12px] font-extrabold tracking-widest text-white/80 uppercase">Jogador</span>
          {!isTecnico && <span className="text-[12px] font-extrabold tracking-widest text-white/80 uppercase">Time</span>}
          <span className="text-[12px] font-extrabold tracking-widest text-white/80 uppercase text-center">Pos</span>
          <span className="text-[12px] font-extrabold tracking-widest text-white/80 uppercase text-center">Gols</span>
          <span className="text-[12px] font-extrabold tracking-widest text-white/80 text-center">🟡</span>
          <span className="text-[12px] font-extrabold tracking-widest text-white/80 text-center">🔴</span>
          <span className="text-[12px] font-extrabold tracking-widest text-white/80 uppercase text-center">Status</span>
          <span className="text-[12px] font-extrabold tracking-widest text-white/80 uppercase text-center">Ações</span>
        </div>

        {/* ── Header mobile ──────────────────────────────────────── */}
        <div className="md:hidden px-4 py-3 bg-linear-to-r from-indigo-500 via-violet-500 to-purple-500">
          <span className="text-[11px] font-extrabold tracking-widest text-white/80 uppercase">
            {isTecnico ? 'Jogadores' : 'Jogadores · Time'}
          </span>
        </div>

        {/* ── Rows ───────────────────────────────────────────────── */}
        <div className="divide-y divide-gray-50">
          {paginado.map(jogador => {
            const stat = stats.get(jogador.id)
            const gols      = stat?.gols      ?? 0
            const amarelos  = stat?.amarelos  ?? 0
            const vermelhos = stat?.vermelhos ?? 0

            return (
              <div key={jogador.id}>

                {/* ── Desktop row ─────────────────────────────────── */}
                <div className={`hidden md:grid ${gridCols} gap-2 px-4 py-3 hover:bg-gray-50 transition-colors items-center`}>

                  {/* Jogador */}
                  <div className="flex items-center gap-3 min-w-0">
                    {jogador.foto_url ? (
                      <img src={jogador.foto_url} alt={jogador.nome} className="w-11 h-11 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-11 h-11 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-emerald-700 text-xs font-bold">{getInitials(jogador.nome)}</span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-gray-900 truncate">{jogador.nome}</p>
                      {jogador.numero_camisa && (
                        <p className="text-xs text-gray-400">Número do Uniforme {jogador.numero_camisa}</p>
                      )}
                    </div>
                  </div>

                  {/* Time */}
                  {!isTecnico && (
                    <div className="flex items-center gap-2 min-w-0">
                      {jogador.time?.logo_url ? (
                        <img src={jogador.time.logo_url} alt={jogador.time.nome} className="w-7 h-7 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-7 h-7 bg-gray-200 rounded-full shrink-0" />
                      )}
                      <span className="text-sm font-medium text-gray-700 truncate">{jogador.time?.nome ?? '—'}</span>
                    </div>
                  )}

                  {/* Posição */}
                  <div className="text-center">
                    {jogador.posicao
                      ? <span className="inline-block bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded uppercase">{jogador.posicao.substring(0, 3)}</span>
                      : <span className="text-gray-300 text-xs">—</span>}
                  </div>

                  {/* Gols — real */}
                  <div className="text-center">
                    <span className={`text-sm font-bold ${gols > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {gols}
                    </span>
                  </div>

                  {/* Cartões amarelos — real */}
                  <div className="text-center">
                    <span className={`text-sm font-bold ${amarelos > 0 ? 'text-yellow-500' : 'text-gray-400'}`}>
                      {amarelos}
                    </span>
                  </div>

                  {/* Cartões vermelhos — real */}
                  <div className="text-center">
                    <span className={`text-sm font-bold ${vermelhos > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                      {vermelhos}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="flex justify-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Ativo
                    </span>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center justify-center">
                    <MenuDropdown position="bottom-left" trigger={
                      <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <Settings2 size={16} />
                      </button>
                    } actions={getActions(jogador)} />
                  </div>
                </div>

                {/* ── Mobile row ──────────────────────────────────── */}
                <div className="md:hidden flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">

                  <div className="shrink-0">
                    {jogador.foto_url ? (
                      <img src={jogador.foto_url} alt={jogador.nome} className="w-9 h-9 rounded-full object-cover" />
                    ) : (
                      <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-700 text-[10px] font-bold">{getInitials(jogador.nome)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{jogador.nome}</p>
                  </div>

                  {!isTecnico && (
                    <div className="shrink-0 w-28 flex items-center gap-1.5 overflow-hidden">
                      {jogador.time?.logo_url ? (
                        <img src={jogador.time.logo_url} alt={jogador.time.nome} className="w-5 h-5 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-5 h-5 bg-gray-200 rounded-full shrink-0" />
                      )}
                      <span className="text-xs text-gray-500 truncate">{jogador.time?.nome ?? '—'}</span>
                    </div>
                  )}

                  <div className="shrink-0">
                    <MenuDropdown position="bottom-left" trigger={
                      <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <Settings2 size={16} />
                      </button>
                    } actions={getActions(jogador)} />
                  </div>
                </div>

              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50">
          <span className="text-xs text-gray-500">
            {filtrado.length} jogador{filtrado.length !== 1 ? 'es' : ''}
          </span>
          <button
            onClick={onAdicionar}
            className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <UserPlus size={14} />
            Adicionar
          </button>
        </div>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <span className="text-xs text-gray-500">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtrado.length)} de {filtrado.length} jogadores
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => onPageChange(p => p - 1)}>Anterior</Button>
            <span className="text-xs font-medium text-gray-600 px-2">{page} / {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => onPageChange(p => p + 1)}>Próxima</Button>
          </div>
        </div>
      )}
    </>
  )
}