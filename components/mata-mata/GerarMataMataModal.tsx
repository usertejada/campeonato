// src/components/mata-mata/GerarMataMataModal.tsx
'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase'
import { MapPin, Shuffle, Trophy, AlertCircle, CheckCircle2, Clock } from 'lucide-react'

interface Time {
  id: string
  nome: string
  logo_url: string | null
  pos?: number
}

interface Confronto {
  casa: Time
  fora: Time
}

interface GerarMataMataModalProps {
  isOpen:       boolean
  onClose:      () => void
  onGerado:     () => void
  campeonatoId: string
  fase:         string
  times:        Time[]   // times participantes dessa fase (já vêm ordenados por posição)
}

function TeamLogo({ logo_url, nome, size = 8 }: { logo_url: string | null; nome: string; size?: number }) {
  const sz = `w-${size} h-${size}`
  if (logo_url) return <img src={logo_url} alt={nome} className={`${sz} rounded-full object-cover ring-1 ring-white shadow-sm shrink-0`} />
  return (
    <div className={`${sz} rounded-full bg-linear-to-br from-violet-100 to-violet-200 flex items-center justify-center ring-1 ring-white shadow-sm shrink-0`}>
      <span className="text-[7px] font-bold text-violet-700">{nome.slice(0, 2).toUpperCase()}</span>
    </div>
  )
}

type Modo = 'posicao' | 'aleatorio'

export function GerarMataMataModal({
  isOpen, onClose, onGerado, campeonatoId, fase, times,
}: GerarMataMataModalProps) {
  const [modo,           setModo]          = useState<Modo>('posicao')
  const [local,          setLocal]         = useState('')
  const [horarioInicio,  setHorarioInicio] = useState('08:00')
  const [loading,        setLoading]       = useState(false)
  const [erro,           setErro]          = useState<string | null>(null)
  const [preview,        setPreview]       = useState<Confronto[] | null>(null)

  function gerarPreview() {
    if (times.length < 2) return
    let confrontos: Confronto[] = []

    if (modo === 'posicao') {
      // 1º vs último, 2º vs penúltimo...
      const n = times.length
      for (let i = 0; i < n / 2; i++) {
        confrontos.push({ casa: times[i], fora: times[n - 1 - i] })
      }
    } else {
      // Aleatório — embaralha e emparelha
      const embaralhados = [...times].sort(() => Math.random() - 0.5)
      for (let i = 0; i < embaralhados.length; i += 2) {
        if (embaralhados[i + 1]) {
          confrontos.push({ casa: embaralhados[i], fora: embaralhados[i + 1] })
        }
      }
    }

    setPreview(confrontos)
  }

  function resetPreview() {
    setPreview(null)
  }

  async function handleConfirmar() {
    if (!preview || !local.trim()) return
    setErro(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const duracaoTotal = 45 + 5 + 45 + 10  // padrão, pode ser ajustado depois
      const [h, m] = horarioInicio.split(':').map(Number)
      let minutosAtual = h * 60 + m

      const inserts = preview.map(c => {
        const hh = Math.floor(minutosAtual / 60).toString().padStart(2, '0')
        const mm = (minutosAtual % 60).toString().padStart(2, '0')
        minutosAtual += duracaoTotal
        return {
          campeonato_id:          campeonatoId,
          time_casa_id:           c.casa.id,
          time_fora_id:           c.fora.id,
          fase,
          local,
          data_hora:              null,
          rodada:                 null,
          tempo_primeiro:         45,
          tempo_segundo:          45,
          intervalo:              5,
          status:                 'agendado',
          placar_casa:            0,
          placar_fora:            0,
          finalizado:             false,
          wo:                     false,
          cartoes_amarelos_casa:  0,
          cartoes_amarelos_fora:  0,
          cartoes_vermelhos_casa: 0,
          cartoes_vermelhos_fora: 0,
        }
      })

      const { error } = await supabase.from('jogos').insert(inserts)
      if (error) throw new Error(error.message)

      onGerado()
      onClose()
    } catch (err: any) {
      setErro(err.message ?? 'Erro ao gerar jogos.')
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    setPreview(null)
    setErro(null)
    setLocal('')
    onClose()
  }

  const faseLabel: Record<string, string> = {
    oitavas: 'Oitavas de Final', quartas: 'Quartas de Final',
    semifinal: 'Semifinal', final: 'Final',
  }

  const footer = (
    <div className="flex gap-3">
      {preview ? (
        <>
          <Button variant="ghost" size="md" fullWidth onClick={resetPreview} disabled={loading}>
            Alterar
          </Button>
          <Button variant="primary" size="md" fullWidth onClick={handleConfirmar} loading={loading}
            disabled={!local.trim() || loading}>
            Confirmar {preview.length} Confrontos
          </Button>
        </>
      ) : (
        <>
          <Button variant="ghost" size="md" fullWidth onClick={handleClose}>Cancelar</Button>
          <Button variant="primary" size="md" fullWidth onClick={gerarPreview}
            disabled={times.length < 2 || !local.trim()}>
            Visualizar Confrontos
          </Button>
        </>
      )}
    </div>
  )

  return (
    <Modal isOpen={isOpen} onClose={handleClose}
      title={`Gerar Jogos — ${faseLabel[fase] ?? fase}`}
      size="2xl" footer={footer}>
      <div className="space-y-5">

        {/* Escolha do modo */}
        {!preview && (
          <>
            <div className="grid grid-cols-2 gap-3">
              {/* Por posição */}
              <button onClick={() => setModo('posicao')}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  modo === 'posicao'
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${
                  modo === 'posicao' ? 'bg-violet-500' : 'bg-gray-100'
                }`}>
                  <Trophy size={18} className={modo === 'posicao' ? 'text-white' : 'text-gray-400'} />
                </div>
                <p className={`text-sm font-bold mb-1 ${modo === 'posicao' ? 'text-violet-700' : 'text-gray-800'}`}>
                  Por Posição
                </p>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  1º vs último, 2º vs penúltimo e assim por diante.
                </p>
              </button>

              {/* Aleatório */}
              <button onClick={() => setModo('aleatorio')}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  modo === 'aleatorio'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${
                  modo === 'aleatorio' ? 'bg-blue-500' : 'bg-gray-100'
                }`}>
                  <Shuffle size={18} className={modo === 'aleatorio' ? 'text-white' : 'text-gray-400'} />
                </div>
                <p className={`text-sm font-bold mb-1 ${modo === 'aleatorio' ? 'text-blue-700' : 'text-gray-800'}`}>
                  Aleatório
                </p>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Sorteio livre entre os times classificados.
                </p>
              </button>
            </div>

            {/* Local */}
            <Input
              label="Local / Campo"
              required
              type="text"
              placeholder="Ex: Campo Municipal..."
              value={local}
              onChange={e => setLocal(e.target.value)}
              icon={MapPin}
            />

            {/* Times que vão participar */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                {times.length} times nessa fase
              </p>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {times.map((t, i) => (
                  <div key={t.id} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                    {t.pos && <span className="text-xs font-bold text-gray-400 w-5 shrink-0">{t.pos}º</span>}
                    <TeamLogo logo_url={t.logo_url} nome={t.nome} />
                    <span className="text-xs font-semibold text-gray-800 truncate">{t.nome}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Preview dos confrontos */}
        {preview && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-xl">
              <CheckCircle2 size={14} className="text-green-500 shrink-0" />
              <span className="text-xs font-semibold text-green-700">
                {preview.length} confrontos gerados — confirme abaixo
              </span>
            </div>

            <div className="space-y-2">
              {preview.map((c, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 w-4 shrink-0">{i + 1}</span>
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <TeamLogo logo_url={c.casa.logo_url} nome={c.casa.nome} />
                    <span className="text-xs font-semibold text-gray-800 truncate">{c.casa.nome}</span>
                    {c.casa.pos && <span className="text-[9px] text-violet-500 font-bold shrink-0">{c.casa.pos}º</span>}
                  </div>
                  <span className="text-xs font-bold text-gray-300 shrink-0 px-1">vs</span>
                  <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
                    {c.fora.pos && <span className="text-[9px] text-violet-500 font-bold shrink-0">{c.fora.pos}º</span>}
                    <span className="text-xs font-semibold text-gray-800 truncate text-right">{c.fora.nome}</span>
                    <TeamLogo logo_url={c.fora.logo_url} nome={c.fora.nome} />
                  </div>
                </div>
              ))}
            </div>

            {/* Local confirmação */}
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700">
              <MapPin size={12} className="shrink-0" />
              <span>{local}</span>
            </div>

            <p className="text-[11px] text-gray-400">
              * Datas e horários serão definidos ao editar cada jogo individualmente.
            </p>
          </div>
        )}

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