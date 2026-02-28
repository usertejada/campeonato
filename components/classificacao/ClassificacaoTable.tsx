'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Trophy as TrophyIcon,
  Medal,
  Star,
  TrendingDown,
  Shield,
  TrendingUp,
  Minus,
  Loader2,
  ChevronDown,
  ChevronRight,
  Flag,
} from 'lucide-react'
import { useClassificacao, type TimeClassificacao } from '@/hooks/useClassificacao'
import { AvancarFaseModal } from './AvancarFaseModal'
import type { CampeonatoFase } from '@/types/campeonato'
import { FASE_LABEL, PROXIMA_FASE } from '@/types/campeonato'

type FormResult = 'v' | 'e' | 'd'
type SortKey    = 'pos' | 'pts' | 'j' | 'v' | 'e' | 'd' | 'gp' | 'gc' | 'sg'
type SortDir    = 'asc' | 'desc'

interface ClassificacaoTableProps {
  campeonatoId?:        string
  search?:              string
  faseAtual?:           CampeonatoFase
  numeroClassificados?: number
  canManage?:           boolean
  onFaseAvancou?:       () => void
}

// ── Icon Components ───────────────────────────────────────────

function PosIcon({ pos }: { pos: number }) {
  if (pos === 1) return <TrophyIcon size={16} className="text-amber-400"   strokeWidth={2} />
  if (pos === 2) return <TrophyIcon size={16} className="text-slate-400"   strokeWidth={2} />
  if (pos === 3) return <TrophyIcon size={16} className="text-amber-700"   strokeWidth={2} />
  if (pos === 4) return <Medal      size={15} className="text-blue-500"    strokeWidth={2} />
  if (pos === 5 || pos === 6) return <Medal size={15} className="text-emerald-500" strokeWidth={2} />
  if (pos === 7 || pos === 8) return <Star  size={14} className="text-orange-400"  strokeWidth={2} />
  if (pos >= 13) return <TrendingDown size={14} className="text-red-400"   strokeWidth={2} />
  return <span className="w-4 inline-block" />
}

function TeamLogo({ logo_url, nome, size = 30 }: { logo_url: string | null; nome: string; size?: number }) {
  if (logo_url) {
    return (
      <Image
        src={logo_url}
        alt={nome}
        width={size}
        height={size}
        className="rounded-full object-cover ring-1 ring-slate-200"
        style={{ width: size, height: size }}
      />
    )
  }
  return <Shield size={size - 2} className="text-slate-300 shrink-0" strokeWidth={1.5} />
}

function FormArrow({ r }: { r: FormResult }) {
  if (r === 'v') return <TrendingUp   size={13} className="text-emerald-500" strokeWidth={2.5} />
  if (r === 'd') return <TrendingDown size={13} className="text-red-400"     strokeWidth={2.5} />
  return               <Minus         size={13} className="text-slate-300"   strokeWidth={2.5} />
}

function ZoneBar({ pos, classificado }: { pos: number; classificado?: boolean }) {
  const cls =
    classificado          ? 'bg-violet-500'  :
    pos <= 4              ? 'bg-blue-500'    :
    pos <= 6              ? 'bg-emerald-500' :
    pos <= 8              ? 'bg-orange-500'  :
    pos >= 13             ? 'bg-red-500'     : 'bg-transparent'
  return <span className={`absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-full ${cls}`} />
}

function ZoneDot({ pos, classificado }: { pos: number; classificado?: boolean }) {
  const cls =
    classificado ? 'bg-violet-500'  :
    pos <= 4     ? 'bg-blue-500'    :
    pos <= 6     ? 'bg-emerald-500' :
    pos <= 8     ? 'bg-orange-500'  :
    pos >= 13    ? 'bg-red-500'     : 'bg-transparent'
  return cls !== 'bg-transparent'
    ? <span className={`w-2 h-2 rounded-full shrink-0 ${cls}`} />
    : null
}

function StatItem({ label, value, className = '' }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      <span className={`text-sm font-bold ${className}`}>{value}</span>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────

export default function ClassificacaoTable({
  campeonatoId,
  search,
  faseAtual           = 'grupos',
  numeroClassificados = 0,
  canManage           = false,
  onFaseAvancou,
}: ClassificacaoTableProps) {
  const [sortKey, setSortKey]         = useState<SortKey>('pos')
  const [sortDir, setSortDir]         = useState<SortDir>('asc')
  const [openIds, setOpenIds]         = useState<Set<string>>(new Set())
  const [modalFase, setModalFase]     = useState(false)

  const { classificacao, loading, error, refetch } = useClassificacao({
    campeonatoId,
    search,
    fase:                faseAtual,
    numeroClassificados,
  })

  const sorted = [...classificacao].sort((a, b) => {
    const m = sortDir === 'desc' ? -1 : 1
    return m * (a[sortKey] - b[sortKey])
  })

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const toggleRow = (id: string) => {
    setOpenIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const proximaFase = PROXIMA_FASE[faseAtual]
  const podeAvancar = canManage && !!proximaFase && numeroClassificados > 0

  const legends = [
    ...(numeroClassificados > 0
      ? [{ cls: 'bg-violet-500', label: `Classificados (top ${numeroClassificados})` }]
      : [
          { cls: 'bg-amber-400',  label: '🏆 Pódio' },
          { cls: 'bg-orange-500', label: 'Classificados (7–8)' },
          { cls: 'bg-red-500',    label: 'Rebaixado (13–16)' },
        ]
    ),
  ]

  const TH = ({
    label, k, align = 'center', first = false, last = false,
  }: {
    label: string; k: SortKey | null; align?: 'center' | 'left'; first?: boolean; last?: boolean
  }) => {
    const isActive = sortKey === k
    return (
      <th
        onClick={() => k && handleSort(k)}
        className={[
          'py-3.5 text-[12px] font-extrabold tracking-widest whitespace-nowrap select-none transition-colors',
          first ? 'pl-6 pr-2' : last ? 'pl-2 pr-6' : 'px-2',
          align === 'left' ? 'text-left' : 'text-center',
          k ? 'cursor-pointer' : 'cursor-default',
          isActive
            ? 'text-white border-b-2 border-white/70'
            : 'text-white/60 border-b-2 border-transparent',
        ].join(' ')}
      >
        {label}{isActive ? (sortDir === 'desc' ? ' ↓' : ' ↑') : ''}
      </th>
    )
  }

  return (
    <div>
      {/* Legend + botão avançar fase */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div className="flex flex-wrap gap-3">
          {legends.map(z => (
            <div key={z.label} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-sm ${z.cls}`} />
              <span className="text-[11px] text-slate-500 font-medium">{z.label}</span>
            </div>
          ))}
        </div>

        {/* Botão avançar fase */}
        {podeAvancar && (
          <button
            onClick={() => setModalFase(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <Flag size={13} />
            Avançar para {FASE_LABEL[proximaFase!]}
            <ChevronRight size={13} />
          </button>
        )}
      </div>

      {/* Fase atual badge */}
      {faseAtual !== 'grupos' && (
        <div className="flex items-center gap-2 mb-4 px-3 py-1.5 bg-violet-50 border border-violet-100 rounded-xl w-fit">
          <Flag size={12} className="text-violet-500" />
          <span className="text-xs font-bold text-violet-700">{FASE_LABEL[faseAtual]}</span>
        </div>
      )}

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden">

        {loading && (
          <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm font-medium">Calculando classificação...</span>
          </div>
        )}

        {!loading && error && (
          <div className="py-16 text-center text-sm text-red-400 font-medium">
            Erro ao carregar: {error}
          </div>
        )}

        {!loading && !error && classificacao.length === 0 && (
          <div className="py-16 text-center text-sm text-slate-400 font-medium">
            Nenhum time encontrado.
          </div>
        )}

        {!loading && !error && classificacao.length > 0 && (
          <>
            {/* ── DESKTOP TABLE (md+) ─────────────────────────── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse min-w-[680px]">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500">
                    <TH label="RANK"   k="pos"  align="center" first />
                    <TH label="EQUIPE" k={null} align="left"         />
                    <TH label="PTS"    k="pts"                       />
                    <TH label="J"      k="j"                         />
                    <TH label="V"      k="v"                         />
                    <TH label="E"      k="e"                         />
                    <TH label="D"      k="d"                         />
                    <TH label="GP"     k="gp"                        />
                    <TH label="GC"     k="gc"                        />
                    <TH label="SG"     k="sg"                        />
                    <TH label="FORMA"  k={null}              last    />
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((team: TimeClassificacao) => (
                    <tr
                      key={team.id}
                      className={`border-b border-slate-50 last:border-none hover:bg-blue-50/60 transition-colors
                        ${team.classificado ? 'bg-violet-50/30' : ''}`}
                    >
                      <td className="relative py-5 pl-6 pr-2 w-[90px] text-center">
                        <ZoneBar pos={team.pos} classificado={team.classificado} />
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="text-[13px] font-semibold text-slate-400 tabular-nums min-w-[22px]">
                            {String(team.pos).padStart(2, '0')}
                          </span>
                          <PosIcon pos={team.pos} />
                        </div>
                      </td>
                      <td className="py-5 px-2">
                        <div className="flex items-center gap-3">
                          <TeamLogo logo_url={team.logo_url} nome={team.nome} />
                          <span className="text-[15px] font-bold text-slate-800 whitespace-nowrap">{team.nome}</span>
                          {team.classificado && (
                            <span className="text-[9px] font-bold text-violet-600 bg-violet-100 px-1.5 py-0.5 rounded-full">
                              CLASSIFICADO
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-5 px-2 text-center">
                        <span className="text-[22px] font-extrabold text-slate-800 tabular-nums tracking-tight">{team.pts}</span>
                      </td>
                      <td className="py-5 px-2 text-center text-sm font-medium text-slate-400">{team.j}</td>
                      <td className="py-5 px-2 text-center text-sm font-bold text-emerald-500">{team.v}</td>
                      <td className="py-5 px-2 text-center text-sm font-medium text-slate-400">{team.e}</td>
                      <td className="py-5 px-2 text-center text-sm font-bold text-red-400">{team.d}</td>
                      <td className="py-5 px-2 text-center text-sm font-medium text-slate-500">{team.gp}</td>
                      <td className="py-5 px-2 text-center text-sm font-medium text-slate-500">{team.gc}</td>
                      <td className="py-5 px-2 text-center">
                        <span className={`text-sm font-bold ${team.sg > 0 ? 'text-emerald-500' : team.sg < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                          {team.sg > 0 ? `+${team.sg}` : team.sg}
                        </span>
                      </td>
                      <td className="py-5 pl-2 pr-6">
                        <div className="flex items-center justify-center gap-0.5">
                          {team.form.map((r, i) => <FormArrow key={i} r={r} />)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── MOBILE ACCORDION (< md) ─────────────────────── */}
            <div className="md:hidden">
              <div className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 px-4 py-3 flex items-center justify-between">
                <span className="text-[11px] font-extrabold tracking-widest text-white/80 uppercase">Classificação</span>
                <span className="text-[11px] font-extrabold tracking-widest text-white/80 uppercase">Toque para detalhes</span>
              </div>

              <div className="divide-y divide-slate-50">
                {sorted.map((team: TimeClassificacao) => {
                  const isOpen = openIds.has(team.id)
                  return (
                    <div key={team.id} className={team.classificado ? 'bg-violet-50/30' : ''}>
                      <button
                        onClick={() => toggleRow(team.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50/50 transition-colors text-left"
                      >
                        <div className="relative flex items-center gap-1.5 shrink-0 w-10">
                          <ZoneDot pos={team.pos} classificado={team.classificado} />
                          <span className="text-[12px] font-semibold text-slate-400 tabular-nums">
                            {String(team.pos).padStart(2, '0')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <TeamLogo logo_url={team.logo_url} nome={team.nome} size={26} />
                          <span className="text-sm font-bold text-slate-800 truncate">{team.nome}</span>
                          {team.classificado && (
                            <span className="text-[9px] font-bold text-violet-600 bg-violet-100 px-1.5 py-0.5 rounded-full shrink-0">
                              CLASS.
                            </span>
                          )}
                        </div>

                        <div className="shrink-0 flex items-center gap-0.5">
                          <span className="text-lg font-extrabold text-slate-800 tabular-nums">{team.pts}</span>
                          <span className="text-[10px] text-slate-400 font-medium ml-0.5">pts</span>
                        </div>

                        <div className="shrink-0 w-5 flex justify-center">
                          <PosIcon pos={team.pos} />
                        </div>

                        <ChevronDown
                          size={15}
                          className={`text-slate-300 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </button>

                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-4 pb-4 pt-2 bg-slate-50/70 border-t border-slate-100">
                          <div className="grid grid-cols-4 gap-2 mb-3">
                            <StatItem label="J"  value={team.j}  className="text-slate-500" />
                            <StatItem label="V"  value={team.v}  className="text-emerald-500" />
                            <StatItem label="E"  value={team.e}  className="text-slate-400" />
                            <StatItem label="D"  value={team.d}  className="text-red-400" />
                          </div>
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            <StatItem label="GP" value={team.gp} className="text-slate-500" />
                            <StatItem label="GC" value={team.gc} className="text-slate-500" />
                            <StatItem
                              label="SG"
                              value={team.sg > 0 ? `+${team.sg}` : team.sg}
                              className={team.sg > 0 ? 'text-emerald-500' : team.sg < 0 ? 'text-red-400' : 'text-slate-400'}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Forma</span>
                            <div className="flex items-center gap-0.5">
                              {team.form.map((r, i) => <FormArrow key={i} r={r} />)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between flex-wrap gap-2 px-4 md:px-6 py-3 border-t border-slate-100">
              <span className="text-xs text-slate-400">
                {classificacao.length} {classificacao.length === 1 ? 'time' : 'times'}
              </span>
              <div className="flex items-center gap-4">
                {(['v', 'e', 'd'] as FormResult[]).map((r) => (
                  <div key={r} className="flex items-center gap-1">
                    <FormArrow r={r} />
                    <span className="text-[11px] text-slate-400">
                      {r === 'v' ? 'Vitória' : r === 'e' ? 'Empate' : 'Derrota'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal avançar fase */}
      {campeonatoId && (
        <AvancarFaseModal
          isOpen={modalFase}
          onClose={() => setModalFase(false)}
          onAvancou={() => {
            setModalFase(false)
            refetch()
            onFaseAvancou?.()
          }}
          campeonatoId={campeonatoId}
          faseAtual={faseAtual}
          classificacao={classificacao}
          numeroClassificados={numeroClassificados}
        />
      )}
    </div>
  )
}