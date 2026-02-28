// src/components/jogos/FinalizarJogoModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { createClient } from '@/lib/supabase'
import { AlertCircle, Plus, Trash2, Target, Shield, FileText } from 'lucide-react'
import type { Jogo } from './JogoCard'

interface FinalizarJogoModalProps {
  isOpen: boolean
  onClose: () => void
  jogo: Jogo | null
  onFinalizado: () => void
}

interface Jogador {
  id: string
  nome: string
}

interface EntradaGol {
  jogador_id: string
  quantidade: number
  minuto: string
  time: 'casa' | 'fora'
}

interface EntradaCartao {
  jogador_id: string
  tipo: 'amarelo' | 'vermelho'
  minuto: string
  time: 'casa' | 'fora'
}

type Aba = 'placar' | 'cartoes' | 'obs'

const ABAS: { id: Aba; label: string; icon: React.ElementType }[] = [
  { id: 'placar',  label: 'Placar',   icon: Target   },
  { id: 'cartoes', label: 'Cartões',  icon: Shield   },
  { id: 'obs',     label: 'Obs.',     icon: FileText },
]

function TeamHeader({ logo_url, nome }: { logo_url?: string | null; nome: string }) {
  return (
    <div className="flex items-center gap-2">
      {logo_url
        ? <img src={logo_url} className="w-6 h-6 rounded-full object-cover" alt="" />
        : <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
            <span className="text-[9px] font-bold text-emerald-700">{nome.slice(0,2).toUpperCase()}</span>
          </div>
      }
      <span className="text-sm font-semibold text-gray-700 truncate">{nome}</span>
    </div>
  )
}

export function FinalizarJogoModal({ isOpen, onClose, jogo, onFinalizado }: FinalizarJogoModalProps) {
  const [abaAtiva,      setAbaAtiva]      = useState<Aba>('placar')
  const [gols,          setGols]          = useState<EntradaGol[]>([])
  const [cartoes,       setCartoes]       = useState<EntradaCartao[]>([])
  const [wo,            setWo]            = useState(false)
  const [woTime,         setWoTime]         = useState<'casa' | 'fora' | ''>('')
  const [observacoes,   setObservacoes]   = useState('')
  const [jogadoresCasa, setJogadoresCasa] = useState<Jogador[]>([])
  const [jogadoresFora, setJogadoresFora] = useState<Jogador[]>([])
  const [loading,       setLoading]       = useState(false)
  const [erro,          setErro]          = useState<string | null>(null)

  // Selects para adicionar gol
  const [selGolCasa,  setSelGolCasa]  = useState('')
  const [selGolFora,  setSelGolFora]  = useState('')
  const [qtdGolCasa,  setQtdGolCasa]  = useState(1)
  const [qtdGolFora,  setQtdGolFora]  = useState(1)
  const [minGolCasa,  setMinGolCasa]  = useState('')
  const [minGolFora,  setMinGolFora]  = useState('')

  // Selects para adicionar cartão
  const [selCartCasa,  setSelCartCasa]  = useState('')
  const [selCartFora,  setSelCartFora]  = useState('')
  const [tipoCartCasa, setTipoCartCasa] = useState<'amarelo' | 'vermelho'>('amarelo')
  const [tipoCartFora, setTipoCartFora] = useState<'amarelo' | 'vermelho'>('amarelo')
  const [minCartCasa,  setMinCartCasa]  = useState('')
  const [minCartFora,  setMinCartFora]  = useState('')

  useEffect(() => {
    if (!isOpen || !jogo) return
    setGols([]); setCartoes([]); setWo(false); setWoTime(''); setObservacoes('')
    setErro(null); setAbaAtiva('placar')
    setSelGolCasa(''); setSelGolFora(''); setQtdGolCasa(1); setQtdGolFora(1)
    setMinGolCasa(''); setMinGolFora('')
    setSelCartCasa(''); setSelCartFora(''); setMinCartCasa(''); setMinCartFora('')

    const supabase = createClient()
    supabase.from('jogadores').select('id, nome').eq('time_id', jogo.time_casa_id).order('nome')
      .then(({ data }) => setJogadoresCasa(data ?? []))
    supabase.from('jogadores').select('id, nome').eq('time_id', jogo.time_fora_id).order('nome')
      .then(({ data }) => setJogadoresFora(data ?? []))
  }, [isOpen, jogo])

  // Placar é a soma das quantidades de gol (WO: time que não compareceu perde 0x3)
  const placarCasa = wo
    ? (woTime === 'fora' ? 3 : woTime === 'casa' ? 0 : 0)
    : gols.filter(g => g.time === 'casa').reduce((s, g) => s + g.quantidade, 0)
  const placarFora = wo
    ? (woTime === 'casa' ? 3 : woTime === 'fora' ? 0 : 0)
    : gols.filter(g => g.time === 'fora').reduce((s, g) => s + g.quantidade, 0)
  const amarCasa   = cartoes.filter(c => c.time === 'casa' && c.tipo === 'amarelo').length
  const amarFora   = cartoes.filter(c => c.time === 'fora' && c.tipo === 'amarelo').length
  const vermCasa   = cartoes.filter(c => c.time === 'casa' && c.tipo === 'vermelho').length
  const vermFora   = cartoes.filter(c => c.time === 'fora' && c.tipo === 'vermelho').length

  function jogadorNome(id: string) {
    return [...jogadoresCasa, ...jogadoresFora].find(j => j.id === id)?.nome ?? '—'
  }

  function adicionarGol(time: 'casa' | 'fora') {
    const id  = time === 'casa' ? selGolCasa : selGolFora
    const qtd = time === 'casa' ? qtdGolCasa : qtdGolFora
    const min = time === 'casa' ? minGolCasa : minGolFora
    if (!id) return
    setGols(prev => [...prev, { jogador_id: id, quantidade: qtd, minuto: min, time }])
    if (time === 'casa') { setSelGolCasa(''); setQtdGolCasa(1); setMinGolCasa('') }
    else                 { setSelGolFora(''); setQtdGolFora(1); setMinGolFora('') }
  }

  function removerGol(idx: number) {
    setGols(prev => prev.filter((_, i) => i !== idx))
  }

  function adicionarCartao(time: 'casa' | 'fora') {
    const id   = time === 'casa' ? selCartCasa  : selCartFora
    const tipo = time === 'casa' ? tipoCartCasa : tipoCartFora
    const min  = time === 'casa' ? minCartCasa  : minCartFora
    if (!id) return
    setCartoes(prev => [...prev, { jogador_id: id, tipo, minuto: min, time }])
    if (time === 'casa') { setSelCartCasa(''); setMinCartCasa('') }
    else                 { setSelCartFora(''); setMinCartFora('') }
  }

  function removerCartao(idx: number) {
    setCartoes(prev => prev.filter((_, i) => i !== idx))
  }

  async function handleFinalizar() {
    if (!jogo) return
    if (wo && !woTime) {
      setErro('Selecione qual time não compareceu para registrar o W.O.')
      return
    }
    setErro(null); setLoading(true)
    try {
      const supabase = createClient()

      const { error: erroJogo } = await supabase.from('jogos').update({
        placar_casa:            placarCasa,
        placar_fora:            placarFora,
        cartoes_amarelos_casa:  amarCasa,
        cartoes_amarelos_fora:  amarFora,
        cartoes_vermelhos_casa: vermCasa,
        cartoes_vermelhos_fora: vermFora,
        finalizado:             true,
        wo,
        observacoes:            observacoes || null,
        status:                 'finalizado',
      }).eq('id', jogo.id)

      if (erroJogo) throw new Error(erroJogo.message)

      // Expande gols: se jogador fez 2 gols, insere 2 registros
      const eventosGol = gols.flatMap(g =>
        Array.from({ length: g.quantidade }, () => ({
          jogo_id:    jogo.id,
          jogador_id: g.jogador_id,
          tipo:       'gol',
          minuto:     g.minuto ? Number(g.minuto) : null,
          observacao: null,
        }))
      )

      const eventosCartao = cartoes.map(c => ({
        jogo_id:    jogo.id,
        jogador_id: c.jogador_id,
        tipo:       c.tipo === 'amarelo' ? 'amarelo' : 'vermelho',
        minuto:     c.minuto ? Number(c.minuto) : null,
        observacao: null,
      }))

      const eventos = [...eventosGol, ...eventosCartao]
      if (eventos.length > 0) {
        const { error: erroEventos } = await supabase.from('eventos_jogo').insert(eventos)
        if (erroEventos) throw new Error(erroEventos.message)
      }

      onFinalizado()
      onClose()
    } catch (err: any) {
      setErro(err.message ?? 'Erro ao finalizar jogo.')
    } finally {
      setLoading(false)
    }
  }

  if (!jogo) return null

  const nomeCasa = jogo.time_casa?.nome ?? 'Casa'
  const nomeFora = jogo.time_fora?.nome ?? 'Fora'
  const jogadoresCasaOpts = jogadoresCasa.map(j => ({ value: j.id, label: j.nome }))
  const jogadoresForaOpts = jogadoresFora.map(j => ({ value: j.id, label: j.nome }))
  const tipoCartaoOpts    = [{ value: 'amarelo', label: '🟡 Amarelo' }, { value: 'vermelho', label: '🔴 Vermelho' }]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Finalizar Partida" size="xl">
      <div className="space-y-4">

        {/* Placar ao vivo no topo */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
          <TeamHeader logo_url={jogo.time_casa?.logo_url} nome={nomeCasa} />
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-gray-900 tabular-nums">
                {wo ? (woTime ? placarCasa : '—') : placarCasa}
              </span>
              <span className="text-lg text-gray-300">×</span>
              <span className="text-2xl font-black text-gray-900 tabular-nums">
                {wo ? (woTime ? placarFora : '—') : placarFora}
              </span>
            </div>
            {wo && <span className="text-[10px] font-bold text-orange-500 uppercase">W.O.</span>}
          </div>
          <TeamHeader logo_url={jogo.time_fora?.logo_url} nome={nomeFora} />
        </div>

        {/* Tabs — 3 abas */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {ABAS.map(aba => {
            const Icon  = aba.icon
            const badge = aba.id === 'cartoes' ? cartoes.length : 0
            return (
              <button
                key={aba.id}
                onClick={() => setAbaAtiva(aba.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  abaAtiva === aba.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={12} />
                {aba.label}
                {badge > 0 && (
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Conteúdo com altura fixa */}
        <div className="min-h-[320px]">

          {/* ── ABA: PLACAR ── */}
          {abaAtiva === 'placar' && (
            <div className="space-y-4">
              {/* W.O. */}
              <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={wo} onChange={e => { setWo(e.target.checked); setWoTime('') }} className="w-4 h-4 accent-orange-500" />
                  <div>
                    <p className="text-sm font-semibold text-orange-700">W.O. (Walkover)</p>
                    <p className="text-xs text-orange-500">Um dos times não compareceu</p>
                  </div>
                </label>

                {wo && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-orange-600">Qual time <span className="underline">não compareceu</span>?</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setWoTime('casa')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors ${
                          woTime === 'casa'
                            ? 'bg-orange-500 border-orange-500 text-white'
                            : 'bg-white border-orange-200 text-orange-700 hover:bg-orange-100'
                        }`}
                      >
                        {jogo.time_casa?.logo_url
                          ? <img src={jogo.time_casa.logo_url} className="w-5 h-5 rounded-full object-cover" alt="" />
                          : <div className="w-5 h-5 rounded-full bg-orange-200 flex items-center justify-center"><span className="text-[8px] font-bold text-orange-700">{nomeCasa.slice(0,2).toUpperCase()}</span></div>
                        }
                        <span className="truncate">{nomeCasa}</span>
                      </button>
                      <button
                        onClick={() => setWoTime('fora')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors ${
                          woTime === 'fora'
                            ? 'bg-orange-500 border-orange-500 text-white'
                            : 'bg-white border-orange-200 text-orange-700 hover:bg-orange-100'
                        }`}
                      >
                        {jogo.time_fora?.logo_url
                          ? <img src={jogo.time_fora.logo_url} className="w-5 h-5 rounded-full object-cover" alt="" />
                          : <div className="w-5 h-5 rounded-full bg-orange-200 flex items-center justify-center"><span className="text-[8px] font-bold text-orange-700">{nomeFora.slice(0,2).toUpperCase()}</span></div>
                        }
                        <span className="truncate">{nomeFora}</span>
                      </button>
                    </div>
                    {woTime && (
                      <p className="text-[11px] text-orange-600 text-center font-medium">
                        Resultado: {woTime === 'casa' ? `${nomeFora} 3 × 0 ${nomeCasa}` : `${nomeCasa} 3 × 0 ${nomeFora}`}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {!wo && (
                <div className="grid grid-cols-2 gap-4">
                  {/* ── Casa ── */}
                  <div className="space-y-2">
                    <TeamHeader logo_url={jogo.time_casa?.logo_url} nome={nomeCasa} />
                    <Select options={jogadoresCasaOpts} value={selGolCasa} onChange={setSelGolCasa} placeholder="Jogador..." size="sm" />
                    <div className="flex gap-2">
                      {/* Quantidade */}
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-gray-400">Gols</span>
                        <input
                          type="number" min={1} max={20}
                          value={qtdGolCasa}
                          onChange={e => setQtdGolCasa(Math.max(1, Number(e.target.value)))}
                          className="w-12 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-center font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                      </div>
                      {/* Minuto */}
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-gray-400">Min.</span>
                        <input
                          type="number" placeholder="—" min={1} max={120}
                          value={minGolCasa} onChange={e => setMinGolCasa(e.target.value)}
                          className="w-14 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1">
                        <span className="text-[10px] text-transparent">.</span>
                        <button
                          onClick={() => adicionarGol('casa')}
                          disabled={!selGolCasa}
                          className="flex items-center justify-center gap-1 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus size={12} /> Adicionar
                        </button>
                      </div>
                    </div>

                    {/* Lista gols casa */}
                    <div className="space-y-1 max-h-36 overflow-y-auto">
                      {gols.filter(g => g.time === 'casa').length === 0
                        ? <p className="text-xs text-gray-300 text-center py-3">Nenhum gol</p>
                        : gols.filter(g => g.time === 'casa').map((g, i) => (
                          <div key={i} className="flex items-center justify-between px-2 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg">
                            <span className="text-xs font-medium text-emerald-800 truncate">
                              ⚽ {jogadorNome(g.jogador_id)}
                              {g.quantidade > 1 && (
                                <span className="ml-1 bg-emerald-200 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">×{g.quantidade}</span>
                              )}
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0 ml-1">
                              {g.minuto && <span className="text-[10px] text-emerald-500">{g.minuto}'</span>}
                              <button onClick={() => removerGol(gols.indexOf(g))} className="text-red-300 hover:text-red-500 transition-colors">
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                    <p className="text-xs font-bold text-emerald-600 text-center">Total: {placarCasa} gol{placarCasa !== 1 ? 's' : ''}</p>
                  </div>

                  {/* ── Fora ── */}
                  <div className="space-y-2">
                    <TeamHeader logo_url={jogo.time_fora?.logo_url} nome={nomeFora} />
                    <Select options={jogadoresForaOpts} value={selGolFora} onChange={setSelGolFora} placeholder="Jogador..." size="sm" />
                    <div className="flex gap-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-gray-400">Gols</span>
                        <input
                          type="number" min={1} max={20}
                          value={qtdGolFora}
                          onChange={e => setQtdGolFora(Math.max(1, Number(e.target.value)))}
                          className="w-12 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-center font-bold focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-gray-400">Min.</span>
                        <input
                          type="number" placeholder="—" min={1} max={120}
                          value={minGolFora} onChange={e => setMinGolFora(e.target.value)}
                          className="w-14 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1">
                        <span className="text-[10px] text-transparent">.</span>
                        <button
                          onClick={() => adicionarGol('fora')}
                          disabled={!selGolFora}
                          className="flex items-center justify-center gap-1 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus size={12} /> Adicionar
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 max-h-36 overflow-y-auto">
                      {gols.filter(g => g.time === 'fora').length === 0
                        ? <p className="text-xs text-gray-300 text-center py-3">Nenhum gol</p>
                        : gols.filter(g => g.time === 'fora').map((g, i) => (
                          <div key={i} className="flex items-center justify-between px-2 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
                            <span className="text-xs font-medium text-blue-800 truncate">
                              ⚽ {jogadorNome(g.jogador_id)}
                              {g.quantidade > 1 && (
                                <span className="ml-1 bg-blue-200 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">×{g.quantidade}</span>
                              )}
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0 ml-1">
                              {g.minuto && <span className="text-[10px] text-blue-500">{g.minuto}'</span>}
                              <button onClick={() => removerGol(gols.indexOf(g))} className="text-red-300 hover:text-red-500 transition-colors">
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                    <p className="text-xs font-bold text-blue-600 text-center">Total: {placarFora} gol{placarFora !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── ABA: CARTÕES ── */}
          {abaAtiva === 'cartoes' && (
            <div className="grid grid-cols-2 gap-4">
              {/* Casa */}
              <div className="space-y-2">
                <TeamHeader logo_url={jogo.time_casa?.logo_url} nome={nomeCasa} />
                <Select options={jogadoresCasaOpts} value={selCartCasa} onChange={setSelCartCasa} placeholder="Jogador..." size="sm" />
                <Select options={tipoCartaoOpts} value={tipoCartCasa} onChange={v => setTipoCartCasa(v as 'amarelo' | 'vermelho')} size="sm" />
                <div className="flex gap-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-gray-400">Min.</span>
                    <input
                      type="number" placeholder="—" min={1} max={120}
                      value={minCartCasa} onChange={e => setMinCartCasa(e.target.value)}
                      className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5 flex-1">
                    <span className="text-[10px] text-transparent">.</span>
                    <button
                      onClick={() => adicionarCartao('casa')}
                      disabled={!selCartCasa}
                      className="flex items-center justify-center gap-1 py-1.5 text-xs font-semibold text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus size={12} /> Adicionar
                    </button>
                  </div>
                </div>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {cartoes.filter(c => c.time === 'casa').length === 0
                    ? <p className="text-xs text-gray-300 text-center py-3">Nenhum cartão</p>
                    : cartoes.filter(c => c.time === 'casa').map((c, i) => (
                      <div key={i} className="flex items-center justify-between px-2 py-1.5 bg-gray-50 border border-gray-100 rounded-lg">
                        <span className="text-xs font-medium text-gray-700 truncate">
                          {c.tipo === 'amarelo' ? '🟡' : '🔴'} {jogadorNome(c.jogador_id)}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0 ml-1">
                          {c.minuto && <span className="text-[10px] text-gray-400">{c.minuto}'</span>}
                          <button onClick={() => removerCartao(cartoes.indexOf(c))} className="text-red-300 hover:text-red-500 transition-colors">
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Fora */}
              <div className="space-y-2">
                <TeamHeader logo_url={jogo.time_fora?.logo_url} nome={nomeFora} />
                <Select options={jogadoresForaOpts} value={selCartFora} onChange={setSelCartFora} placeholder="Jogador..." size="sm" />
                <Select options={tipoCartaoOpts} value={tipoCartFora} onChange={v => setTipoCartFora(v as 'amarelo' | 'vermelho')} size="sm" />
                <div className="flex gap-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-gray-400">Min.</span>
                    <input
                      type="number" placeholder="—" min={1} max={120}
                      value={minCartFora} onChange={e => setMinCartFora(e.target.value)}
                      className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5 flex-1">
                    <span className="text-[10px] text-transparent">.</span>
                    <button
                      onClick={() => adicionarCartao('fora')}
                      disabled={!selCartFora}
                      className="flex items-center justify-center gap-1 py-1.5 text-xs font-semibold text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus size={12} /> Adicionar
                    </button>
                  </div>
                </div>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {cartoes.filter(c => c.time === 'fora').length === 0
                    ? <p className="text-xs text-gray-300 text-center py-3">Nenhum cartão</p>
                    : cartoes.filter(c => c.time === 'fora').map((c, i) => (
                      <div key={i} className="flex items-center justify-between px-2 py-1.5 bg-gray-50 border border-gray-100 rounded-lg">
                        <span className="text-xs font-medium text-gray-700 truncate">
                          {c.tipo === 'amarelo' ? '🟡' : '🔴'} {jogadorNome(c.jogador_id)}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0 ml-1">
                          {c.minuto && <span className="text-[10px] text-gray-400">{c.minuto}'</span>}
                          <button onClick={() => removerCartao(cartoes.indexOf(c))} className="text-red-300 hover:text-red-500 transition-colors">
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          )}

          {/* ── ABA: OBSERVAÇÕES ── */}
          {abaAtiva === 'obs' && (
            <textarea
              value={observacoes}
              onChange={e => setObservacoes(e.target.value)}
              placeholder="Descreva como foi a partida, incidentes, destaques..."
              rows={10}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          )}
        </div>

        {erro && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            {erro}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button variant="ghost" size="md" fullWidth onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button variant="primary" size="md" fullWidth onClick={handleFinalizar} disabled={loading}>
            {loading ? 'Salvando...' : 'Finalizar Partida'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}