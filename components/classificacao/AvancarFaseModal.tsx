// src/components/classificacao/AvancarFaseModal.tsx
'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAvancarFase } from '@/hooks/useAvancarFase'
import type { TimeClassificacao } from '@/hooks/useClassificacao'
import type { CampeonatoFase } from '@/types/campeonato'
import { FASE_LABEL, PROXIMA_FASE } from '@/types/campeonato'
import {
  AlertCircle, CheckCircle2, MapPin, ChevronRight,
  Trophy, Shield, ArrowRight
} from 'lucide-react'

interface AvancarFaseModalProps {
  isOpen:              boolean
  onClose:             () => void
  onAvancou:           () => void
  campeonatoId:        string
  faseAtual:           CampeonatoFase
  classificacao:       TimeClassificacao[]
  numeroClassificados: number
}

function TeamLogo({ logo_url, nome }: { logo_url: string | null; nome: string }) {
  if (logo_url) {
    return <img src={logo_url} alt={nome} className="w-7 h-7 rounded-full object-cover ring-1 ring-white shadow-sm" />
  }
  return (
    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center ring-1 ring-white shadow-sm">
      <span className="text-[8px] font-bold text-violet-700">{nome.slice(0, 2).toUpperCase()}</span>
    </div>
  )
}

export function AvancarFaseModal({
  isOpen,
  onClose,
  onAvancou,
  campeonatoId,
  faseAtual,
  classificacao,
  numeroClassificados,
}: AvancarFaseModalProps) {
  const [local, setLocal] = useState('')
  const { loading, erro, gerarConfrontos, avancarFase } = useAvancarFase()

  const proximaFase = PROXIMA_FASE[faseAtual]
  const classificados = classificacao.slice(0, numeroClassificados)
  const confrontos = classificados.length >= 2 ? gerarConfrontos(classificados) : []

  async function handleConfirmar() {
    if (!local.trim()) return
    const ok = await avancarFase({
      campeonatoId,
      faseAtual,
      classificados,
      local,
    })
    if (ok) onAvancou()
  }

  const footer = (
    <div className="flex gap-3">
      <Button variant="ghost" size="md" fullWidth onClick={onClose} disabled={loading}>
        Cancelar
      </Button>
      <Button
        variant="primary" size="md" fullWidth
        icon={ChevronRight}
        onClick={handleConfirmar}
        disabled={loading || !local.trim() || classificados.length < 2}
        loading={loading}
      >
        {loading ? 'Gerando...' : `Avançar para ${proximaFase ? FASE_LABEL[proximaFase] : '...'}`}
      </Button>
    </div>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Avançar para ${proximaFase ? FASE_LABEL[proximaFase] : '...'}`}
      size="2xl"
      footer={footer}
    >
      <div className="space-y-5">

        {/* Info da transição */}
        <div className="flex items-center gap-3 p-4 bg-violet-50 border border-violet-100 rounded-2xl">
          <div className="flex items-center gap-2 shrink-0">
            <Trophy size={14} className="text-violet-500" />
            <span className="text-sm font-semibold text-violet-700">{FASE_LABEL[faseAtual]}</span>
          </div>
          <ArrowRight size={14} className="text-violet-300 shrink-0" />
          <div className="flex items-center gap-2 shrink-0">
            <Trophy size={14} className="text-violet-500" />
            <span className="text-sm font-bold text-violet-800">
              {proximaFase ? FASE_LABEL[proximaFase] : '—'}
            </span>
          </div>
          <div className="flex-1" />
          <span className="text-xs text-violet-500 bg-violet-100 px-2 py-0.5 rounded-full font-medium">
            {classificados.length} times classificados
          </span>
        </div>

        {/* Times classificados */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Times que avançam
          </p>
          <div className="grid grid-cols-2 gap-2">
            {classificados.map(t => (
              <div key={t.id} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-xs font-bold text-gray-400 w-5 shrink-0">{t.pos}º</span>
                <TeamLogo logo_url={t.logo_url} nome={t.nome} />
                <span className="text-xs font-semibold text-gray-800 truncate">{t.nome}</span>
                <span className="ml-auto text-xs font-bold text-violet-600 shrink-0">{t.pts}pts</span>
              </div>
            ))}
          </div>
        </div>

        {/* Confrontos gerados */}
        {confrontos.length > 0 && (
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Confrontos gerados automaticamente
            </p>
            <div className="space-y-2">
              {confrontos.map((c, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 w-4 shrink-0">{i + 1}</span>
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <TeamLogo logo_url={c.time_casa.logo_url} nome={c.time_casa.nome} />
                    <span className="text-xs font-semibold text-gray-800 truncate">{c.time_casa.nome}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-300 shrink-0">vs</span>
                  <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
                    <span className="text-xs font-semibold text-gray-800 truncate text-right">{c.time_fora.nome}</span>
                    <TeamLogo logo_url={c.time_fora.logo_url} nome={c.time_fora.nome} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 mt-2">
              * Datas e horários serão definidos ao editar cada jogo.
            </p>
          </div>
        )}

        {/* Local */}
        <Input
          label="Local / Campo dos jogos"
          required
          type="text"
          placeholder="Ex: Campo Municipal..."
          value={local}
          onChange={e => setLocal(e.target.value)}
          icon={MapPin}
        />

        {/* Aviso se times insuficientes */}
        {classificados.length < 2 && (
          <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-100 rounded-xl text-sm text-orange-600">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            Não há times classificados suficientes. Verifique o número de classificados do campeonato.
          </div>
        )}

        {/* Erro */}
        {erro && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            {erro}
          </div>
        )}
      </div>
    </Modal>
  )
}