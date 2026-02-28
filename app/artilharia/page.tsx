// src/app/artilharia/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { createClient } from '@/lib/supabase'
import { Target, Trophy, Medal } from 'lucide-react'

interface ArtilhariaItem {
  jogador_id: string
  jogador_nome: string
  foto_url: string | null
  numero_camisa: number | null
  time_id: string
  time_nome: string
  time_logo: string | null
  campeonato_id: string
  gols: number
}

interface Campeonato { id: string; nome: string }

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

function medalhaStyle(pos: number) {
  if (pos === 1) return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', icon: '🥇' }
  if (pos === 2) return { bg: 'bg-gray-50',  border: 'border-gray-200',  text: 'text-gray-500',  icon: '🥈' }
  if (pos === 3) return { bg: 'bg-orange-50',border: 'border-orange-200',text: 'text-orange-600',icon: '🥉' }
  return { bg: 'bg-white', border: 'border-gray-100', text: 'text-gray-400', icon: '' }
}

export default function ArtilhariaPage() {
  const [artilharia,    setArtilharia]    = useState<ArtilhariaItem[]>([])
  const [campeonatos,   setCampeonatos]   = useState<Campeonato[]>([])
  const [campSelecionado, setCampSelecionado] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('campeonatos').select('id, nome').order('nome')
      .then(({ data }) => {
        const lista = data ?? []
        setCampeonatos(lista)
        if (lista.length > 0) setCampSelecionado(lista[0].id)
      })
  }, [])

  useEffect(() => {
    if (!campSelecionado) return
    setLoading(true)
    const supabase = createClient()
    supabase
      .from('artilharia')
      .select('*')
      .eq('campeonato_id', campSelecionado)
      .order('gols', { ascending: false })
      .then(({ data }) => {
        setArtilharia(data ?? [])
        setLoading(false)
      })
  }, [campSelecionado])

  return (
    <AppShell>
      <div className="hidden lg:block">
        <PageHeader title="Artilharia" subtitle="Ranking de gols por campeonato" />
      </div>
      <div className="lg:hidden mb-4">
        <h1 className="text-xl font-bold text-gray-900">Artilharia</h1>
        <p className="text-sm text-gray-500">Ranking de gols</p>
      </div>

      {/* Seletor de campeonato */}
      {campeonatos.length > 1 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {campeonatos.map(c => (
            <button
              key={c.id}
              onClick={() => setCampSelecionado(c.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                campSelecionado === c.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
              }`}
            >
              {c.nome}
            </button>
          ))}
        </div>
      )}

      {loading && <div className="text-center py-12 text-gray-500">Carregando artilharia...</div>}

      {!loading && artilharia.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Target size={40} className="text-gray-200 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-900 mb-1">Nenhum gol registrado</h3>
          <p className="text-sm text-gray-500">A artilharia aparecerá aqui conforme os gols forem registrados nos jogos.</p>
        </div>
      )}

      {!loading && artilharia.length > 0 && (
        <div className="space-y-3">
          {/* Top 3 destacados */}
          {artilharia.length >= 3 && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[artilharia[1], artilharia[0], artilharia[2]].map((item, i) => {
                if (!item) return null
                const realPos = i === 0 ? 2 : i === 1 ? 1 : 3
                const style = medalhaStyle(realPos)
                return (
                  <div key={item.jogador_id} className={`${style.bg} border ${style.border} rounded-xl p-4 text-center flex flex-col items-center gap-2 ${realPos === 1 ? 'scale-105 shadow-md' : ''}`}>
                    <span className="text-2xl">{style.icon}</span>
                    {item.foto_url ? (
                      <img src={item.foto_url} alt={item.jogador_nome} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow" />
                    ) : (
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-700 text-sm">
                        {getInitials(item.jogador_nome)}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-gray-800 leading-tight">{item.jogador_nome.split(' ')[0]}</p>
                      <p className="text-[10px] text-gray-400">{item.time_nome}</p>
                    </div>
                    <div className={`text-2xl font-black ${style.text}`}>{item.gols}</div>
                    <p className="text-[10px] text-gray-400">gols</p>
                  </div>
                )
              })}
            </div>
          )}

          {/* Tabela completa */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <Target size={15} className="text-blue-500" />
              <span className="font-semibold text-gray-800 text-sm">Ranking Completo</span>
            </div>
            <div className="divide-y divide-gray-50">
              {artilharia.map((item, idx) => {
                const pos = idx + 1
                const style = medalhaStyle(pos)
                return (
                  <div key={item.jogador_id} className={`flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors ${pos <= 3 ? style.bg : ''}`}>
                    {/* Posição */}
                    <div className="w-6 text-center shrink-0">
                      {pos <= 3
                        ? <span className="text-base">{style.icon}</span>
                        : <span className="text-xs font-semibold text-gray-400">{pos}</span>
                      }
                    </div>

                    {/* Foto */}
                    {item.foto_url ? (
                      <img src={item.foto_url} alt={item.jogador_nome} className="w-9 h-9 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center text-[10px] font-bold text-emerald-700 shrink-0">
                        {getInitials(item.jogador_nome)}
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.jogador_nome}</p>
                      <div className="flex items-center gap-2">
                        {item.time_logo ? (
                          <img src={item.time_logo} alt={item.time_nome} className="w-4 h-4 rounded-full" />
                        ) : (
                          <div className="w-4 h-4 bg-gray-200 rounded-full" />
                        )}
                        <span className="text-xs text-gray-400">{item.time_nome}</span>
                        {item.numero_camisa && (
                          <span className="text-[10px] text-gray-300">#{item.numero_camisa}</span>
                        )}
                      </div>
                    </div>

                    {/* Gols */}
                    <div className="text-right shrink-0">
                      <span className={`text-xl font-black ${pos <= 3 ? style.text : 'text-gray-700'}`}>{item.gols}</span>
                      <p className="text-[10px] text-gray-400">gols</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}