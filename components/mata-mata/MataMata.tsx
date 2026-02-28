// src/components/mata-mata/MataMata.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { GerarMataMataModal } from '@/components/mata-mata/GerarMataMataModal'
import { FinalizarJogoModal } from '@/components/jogos/FinalizarJogoModal'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import {
  Trophy, Swords, Users, Loader2, CheckCircle2,
  AlertCircle, ChevronRight, Zap, Flag, Lock
} from 'lucide-react'
import type { CampeonatoFase } from '@/types/campeonato'
import { FASE_LABEL } from '@/types/campeonato'
import type { Jogo } from '@/components/jogos/JogoCard'

// ── Types ─────────────────────────────────────────────────────

interface Time {
  id: string
  nome: string
  logo_url: string | null
  pos?: number
}

interface FaseInfo {
  key: CampeonatoFase
  label: string
  gerada: boolean
  times: Time[]
}

interface MataMataProps {
  campeonatoId:        string
  faseAtual:           CampeonatoFase
  classificacaoGrupos: Time[]          // top N da fase de grupos (já ordenados)
  canManage:           boolean
  onFaseAvancou:       () => void
}

// ── Helpers ───────────────────────────────────────────────────

const FASES_MATA_MATA: CampeonatoFase[] = ['oitavas', 'quartas', 'semifinal', 'final']

function TeamLogo({ logo_url, nome, size = 10 }: { logo_url: string | null; nome: string; size?: number }) {
  const sz = `w-${size} h-${size}`
  if (logo_url) return <img src={logo_url} alt={nome} className={`${sz} rounded-full object-cover ring-2 ring-white shadow`} />
  return (
    <div className={`${sz} rounded-full bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center ring-2 ring-white shadow`}>
      <span className="text-[9px] font-bold text-slate-500">{nome.slice(0, 2).toUpperCase()}</span>
    </div>
  )
}

function StatusDot({ status }: { status: string }) {
  const cls =
    status === 'finalizado' ? 'bg-emerald-400' :
    status === 'em_andamento' ? 'bg-red-400 animate-ping' :
    status === 'cancelado' ? 'bg-gray-300' : 'bg-amber-400'
  return <span className={`w-2 h-2 rounded-full shrink-0 ${cls}`} />
}

// ── Componente Card de Confronto ──────────────────────────────

function ConfrontoCard({
  jogo, canManage,
  onFinalizar, onEditar,
}: {
  jogo: Jogo
  canManage: boolean
  onFinalizar: (j: Jogo) => void
  onEditar: (j: Jogo) => void
}) {
  const finalizado = jogo.status === 'finalizado'
  const nomeCasa = jogo.time_casa?.nome ?? 'Time Casa'
  const nomeFora = jogo.time_fora?.nome ?? 'Time Fora'

  const vencedor =
    finalizado && jogo.placar_casa > jogo.placar_fora ? 'casa' :
    finalizado && jogo.placar_fora > jogo.placar_casa ? 'fora' : null

  const dataFormatada = jogo.data_hora
    ? new Date(jogo.data_hora).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    : 'A definir'

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200
      ${finalizado ? 'border-gray-200' : 'border-gray-200 hover:border-violet-200 hover:shadow-md'}`}>

      {/* Barra topo */}
      <div className={`h-1 w-full ${
        finalizado ? 'bg-emerald-400' :
        jogo.status === 'em_andamento' ? 'bg-red-400' :
        'bg-linear-to-r from-violet-400 to-purple-500'
      }`} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <StatusDot status={jogo.status} />
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              {finalizado ? 'Finalizado' : jogo.status === 'em_andamento' ? 'Ao Vivo' : dataFormatada}
            </span>
          </div>
          {canManage && !finalizado && (
            <div className="flex items-center gap-1.5">
              <button onClick={() => onEditar(jogo)}
                className="text-[10px] font-semibold text-gray-400 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">
                Editar
              </button>
              <button onClick={() => onFinalizar(jogo)}
                className="text-[10px] font-semibold text-violet-600 hover:text-violet-700 px-2 py-1 rounded-lg hover:bg-violet-50 transition-colors flex items-center gap-1">
                <Zap size={10} /> Finalizar
              </button>
            </div>
          )}
        </div>

        {/* Confronto */}
        <div className="flex items-center justify-between gap-2">
          {/* Casa */}
          <div className={`flex flex-col items-center gap-2 flex-1 min-w-0 ${vencedor === 'casa' ? 'opacity-100' : finalizado ? 'opacity-50' : 'opacity-100'}`}>
            <TeamLogo logo_url={jogo.time_casa?.logo_url ?? null} nome={nomeCasa} />
            <span className="text-xs font-bold text-gray-800 text-center leading-tight line-clamp-2">{nomeCasa}</span>
            {vencedor === 'casa' && (
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">VENCEDOR</span>
            )}
          </div>

          {/* Placar */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            {finalizado ? (
              <>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-black tabular-nums ${vencedor === 'casa' ? 'text-gray-900' : 'text-gray-400'}`}>
                    {jogo.placar_casa}
                  </span>
                  <span className="text-gray-200 font-light text-lg">×</span>
                  <span className={`text-2xl font-black tabular-nums ${vencedor === 'fora' ? 'text-gray-900' : 'text-gray-400'}`}>
                    {jogo.placar_fora}
                  </span>
                </div>
                <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">Final</span>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-black text-gray-200">—</span>
                  <span className="text-lg font-light text-gray-200 mx-1">×</span>
                  <span className="text-2xl font-black text-gray-200">—</span>
                </div>
                <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">vs</span>
              </>
            )}
          </div>

          {/* Fora */}
          <div className={`flex flex-col items-center gap-2 flex-1 min-w-0 ${vencedor === 'fora' ? 'opacity-100' : finalizado ? 'opacity-50' : 'opacity-100'}`}>
            <TeamLogo logo_url={jogo.time_fora?.logo_url ?? null} nome={nomeFora} />
            <span className="text-xs font-bold text-gray-800 text-center leading-tight line-clamp-2">{nomeFora}</span>
            {vencedor === 'fora' && (
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">VENCEDOR</span>
            )}
          </div>
        </div>

        {/* Local */}
        {jogo.local && (
          <p className="text-[10px] text-gray-400 text-center mt-3">{jogo.local}</p>
        )}
      </div>
    </div>
  )
}

// ── Componente Principal ──────────────────────────────────────

export function MataMata({
  campeonatoId, faseAtual, classificacaoGrupos, canManage, onFaseAvancou,
}: MataMataProps) {
  const [faseSelecionada, setFaseSelecionada] = useState<CampeonatoFase>('oitavas')
  const [subAba,          setSubAba]          = useState<'confrontos' | 'times'>('confrontos')
  const [jogos,           setJogos]           = useState<Record<string, Jogo[]>>({})
  const [loading,         setLoading]         = useState(true)
  const [modalGerar,      setModalGerar]      = useState(false)
  const [modalFinalizar,  setModalFinalizar]  = useState(false)
  const [jogoSelecionado, setJogoSelecionado] = useState<Jogo | null>(null)
  const [avancandoFase,   setAvancandoFase]   = useState(false)

  // Busca todos os jogos do mata-mata do campeonato
  const fetchJogos = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('jogos')
      .select(`
        id, campeonato_id, time_casa_id, time_fora_id,
        data_hora, local, rodada, placar_casa, placar_fora,
        finalizado, wo, observacoes, status, fase,
        tempo_primeiro, tempo_segundo, intervalo,
        cartoes_amarelos_casa, cartoes_amarelos_fora,
        cartoes_vermelhos_casa, cartoes_vermelhos_fora,
        time_casa:times!jogos_time_casa_id_fkey(nome, logo_url),
        time_fora:times!jogos_time_fora_id_fkey(nome, logo_url)
      `)
      .eq('campeonato_id', campeonatoId)
      .in('fase', FASES_MATA_MATA)
      .order('data_hora', { ascending: true })

    const normalizado = (data ?? []).map((j: any) => ({
      ...j,
      time_casa:  Array.isArray(j.time_casa)  ? j.time_casa[0]  ?? null : j.time_casa,
      time_fora:  Array.isArray(j.time_fora)  ? j.time_fora[0]  ?? null : j.time_fora,
      campeonato: null,
    }))

    // Agrupa por fase
    const agrupado: Record<string, Jogo[]> = {}
    for (const jogo of normalizado) {
      if (!agrupado[jogo.fase]) agrupado[jogo.fase] = []
      agrupado[jogo.fase].push(jogo)
    }
    setJogos(agrupado)
    setLoading(false)
  }, [campeonatoId])

  useEffect(() => { fetchJogos() }, [fetchJogos])

  // Ajusta fase selecionada quando faseAtual mudar
  useEffect(() => {
    if (FASES_MATA_MATA.includes(faseAtual)) {
      setFaseSelecionada(faseAtual)
    }
  }, [faseAtual])

  // Times da fase atual (vêm dos vencedores da fase anterior ou da classificação de grupos)
  function getTimesDaFase(fase: CampeonatoFase): Time[] {
    const jogosF = jogos[fase] ?? []
    if (jogosF.length === 0) {
      // Ainda não gerado — para oitavas usa a classificação de grupos
      if (fase === 'oitavas') return classificacaoGrupos
      return []
    }
    // Extrai os times participantes dos jogos
    const timesMap = new Map<string, Time>()
    for (const j of jogosF) {
      if (j.time_casa) timesMap.set(j.time_casa_id, { id: j.time_casa_id, nome: j.time_casa.nome, logo_url: j.time_casa.logo_url ?? null })
      if (j.time_fora) timesMap.set(j.time_fora_id, { id: j.time_fora_id, nome: j.time_fora.nome, logo_url: j.time_fora.logo_url ?? null })
    }
    return Array.from(timesMap.values())
  }

  // Verifica se todos os jogos de uma fase foram finalizados
  function todosFinalizados(fase: CampeonatoFase): boolean {
    const jogosF = jogos[fase] ?? []
    return jogosF.length > 0 && jogosF.every(j => j.finalizado || j.status === 'finalizado')
  }

  // Extrai vencedores de uma fase
  function getVencedores(fase: CampeonatoFase): Time[] {
    const jogosF = jogos[fase] ?? []
    return jogosF
      .filter(j => j.finalizado || j.status === 'finalizado')
      .map(j => {
        const pc = j.placar_casa ?? 0
        const pf = j.placar_fora ?? 0
        if (pc > pf) return { id: j.time_casa_id, nome: j.time_casa?.nome ?? '', logo_url: j.time_casa?.logo_url ?? null }
        if (pf > pc) return { id: j.time_fora_id, nome: j.time_fora?.nome ?? '', logo_url: j.time_fora?.logo_url ?? null }
        return null
      })
      .filter(Boolean) as Time[]
  }

  // Avança para próxima fase
  async function handleAvancarFase(faseAtualLocal: CampeonatoFase) {
    const proximasMap: Partial<Record<CampeonatoFase, CampeonatoFase>> = {
      oitavas: 'quartas', quartas: 'semifinal', semifinal: 'final',
    }
    const proxima = proximasMap[faseAtualLocal]
    if (!proxima) return

    setAvancandoFase(true)
    const supabase = createClient()
    await supabase.from('campeonatos').update({ fase_atual: proxima }).eq('id', campeonatoId)
    await fetchJogos()
    setFaseSelecionada(proxima)
    setAvancandoFase(false)
    onFaseAvancou()
  }

  const fasesGeradas = FASES_MATA_MATA.filter(f => (jogos[f]?.length ?? 0) > 0)
  const jogosFaseSelecionada = jogos[faseSelecionada] ?? []
  const timesFaseSelecionada = getTimesDaFase(faseSelecionada)
  const faseFoiGerada = jogosFaseSelecionada.length > 0
  const podeAvancar = todosFinalizados(faseSelecionada) && faseSelecionada !== 'final'
  const proximaFaseMap: Partial<Record<CampeonatoFase, CampeonatoFase>> = {
    oitavas: 'quartas', quartas: 'semifinal', semifinal: 'final',
  }
  const proximaFase = proximaFaseMap[faseSelecionada]
  const proximaJaGerada = proximaFase ? (jogos[proximaFase]?.length ?? 0) > 0 : false

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm font-medium">Carregando mata-mata...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* ── Navegação por fase ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {FASES_MATA_MATA.map((fase, i) => {
          const gerada   = (jogos[fase]?.length ?? 0) > 0
          const ativa    = fase === faseSelecionada
          const acessivel = gerada || fase === 'oitavas'

          return (
            <button
              key={fase}
              onClick={() => acessivel && setFaseSelecionada(fase)}
              disabled={!acessivel}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all shrink-0
                ${ativa
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
                  : gerada
                    ? 'bg-white text-violet-700 border-2 border-violet-200 hover:border-violet-400'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-transparent'
                }`}
            >
              {gerada ? <CheckCircle2 size={14} /> : !acessivel ? <Lock size={13} /> : <Flag size={13} />}
              {FASE_LABEL[fase]}
            </button>
          )
        })}
      </div>

      {/* ── Sub-abas: Confrontos / Times ── */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {(['confrontos', 'times'] as const).map(aba => (
          <button
            key={aba}
            onClick={() => setSubAba(aba)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              subAba === aba
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {aba === 'confrontos' ? (
              <span className="flex items-center gap-1.5"><Swords size={13} /> Confrontos</span>
            ) : (
              <span className="flex items-center gap-1.5"><Users size={13} /> Times</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Conteúdo ── */}

      {/* SUB-ABA: CONFRONTOS */}
      {subAba === 'confrontos' && (
        <div className="space-y-4">

          {/* Botão gerar jogos — se fase não foi gerada ainda */}
          {!faseFoiGerada && canManage && (
            <div className="bg-white rounded-2xl border-2 border-dashed border-violet-200 p-8 flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-violet-50 flex items-center justify-center">
                <Swords size={24} className="text-violet-400" />
              </div>
              <div className="text-center">
                <p className="text-base font-bold text-gray-800 mb-1">
                  {FASE_LABEL[faseSelecionada]} não gerada
                </p>
                <p className="text-sm text-gray-500">
                  {faseSelecionada === 'oitavas'
                    ? `${timesFaseSelecionada.length} times classificados aguardando sorteio`
                    : 'Finalize os jogos da fase anterior para gerar esta fase'
                  }
                </p>
              </div>
              <button
                onClick={() => setModalGerar(true)}
                disabled={timesFaseSelecionada.length < 2}
                className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
              >
                <Zap size={15} />
                Gerar Confrontos
              </button>
            </div>
          )}

          {/* Mensagem se fase não foi gerada e não é canManage */}
          {!faseFoiGerada && !canManage && (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <Trophy size={36} className="text-gray-200 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-500">Confrontos ainda não gerados</p>
            </div>
          )}

          {/* Cards dos confrontos */}
          {faseFoiGerada && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {jogosFaseSelecionada.map(jogo => (
                  <ConfrontoCard
                    key={jogo.id}
                    jogo={jogo}
                    canManage={canManage}
                    onFinalizar={j => { setJogoSelecionado(j); setModalFinalizar(true) }}
                    onEditar={j => { /* TODO: abrir modal de edição */ }}
                  />
                ))}
              </div>

              {/* Botão avançar para próxima fase */}
              {canManage && podeAvancar && !proximaJaGerada && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => handleAvancarFase(faseSelecionada)}
                    disabled={avancandoFase}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm disabled:opacity-60"
                  >
                    {avancandoFase ? <Loader2 size={15} className="animate-spin" /> : <ChevronRight size={15} />}
                    {avancandoFase ? 'Avançando...' : `Avançar para ${proximaFase ? FASE_LABEL[proximaFase] : '...'}`}
                  </button>
                </div>
              )}

              {/* Se todos finalizados e próxima fase já gerada */}
              {podeAvancar && proximaJaGerada && (
                <div className="flex items-center justify-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span className="text-sm font-semibold text-emerald-700">
                    Fase concluída! {proximaFase ? FASE_LABEL[proximaFase] : ''} já foi gerada.
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* SUB-ABA: TIMES */}
      {subAba === 'times' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {timesFaseSelecionada.length === 0 ? (
            <div className="p-12 text-center">
              <Users size={36} className="text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-500 font-medium">Nenhum time nessa fase ainda</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {timesFaseSelecionada.map((t, i) => {
                // Verifica se esse time já foi eliminado
                const jogosTime = jogosFaseSelecionada.filter(
                  j => (j.time_casa_id === t.id || j.time_fora_id === t.id) && j.finalizado
                )
                const eliminado = jogosTime.some(j => {
                  const pc = j.placar_casa ?? 0
                  const pf = j.placar_fora ?? 0
                  if (j.time_casa_id === t.id) return pf > pc
                  return pc > pf
                })
                const classificado = jogosTime.some(j => {
                  const pc = j.placar_casa ?? 0
                  const pf = j.placar_fora ?? 0
                  if (j.time_casa_id === t.id) return pc > pf
                  return pf > pc
                })

                return (
                  <div key={t.id} className={`flex items-center gap-4 px-5 py-4 ${eliminado ? 'opacity-40' : ''}`}>
                    <span className="text-sm font-bold text-gray-400 w-6 shrink-0">{i + 1}</span>
                    <TeamLogo logo_url={t.logo_url} nome={t.nome} size={10} />
                    <span className="text-sm font-bold text-gray-800 flex-1">{t.nome}</span>
                    {classificado && !eliminado && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        CLASSIFICADO
                      </span>
                    )}
                    {eliminado && (
                      <span className="text-[10px] font-bold text-red-400 bg-red-50 px-2 py-0.5 rounded-full">
                        ELIMINADO
                      </span>
                    )}
                    {!classificado && !eliminado && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        EM JOGO
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal gerar confrontos */}
      <GerarMataMataModal
        isOpen={modalGerar}
        onClose={() => setModalGerar(false)}
        onGerado={() => { fetchJogos(); setModalGerar(false) }}
        campeonatoId={campeonatoId}
        fase={faseSelecionada}
        times={timesFaseSelecionada}
      />

      {/* Modal finalizar jogo */}
      <FinalizarJogoModal
        isOpen={modalFinalizar}
        onClose={() => { setModalFinalizar(false); setJogoSelecionado(null) }}
        jogo={jogoSelecionado}
        onFinalizado={fetchJogos}
      />
    </div>
  )
}