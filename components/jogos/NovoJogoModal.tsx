// src/components/jogos/NovoJogoModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { DateRangePicker } from '@/components/ui/DateRangePicker'
import { createClient } from '@/lib/supabase'
import { AlertCircle, MapPin, Clock } from 'lucide-react'
import type { Jogo } from './JogoCard'

interface Time {
  id: string
  nome: string
  logo_url: string | null
}

interface Campeonato {
  id: string
  nome: string
}

interface NovoJogoModalProps {
  isOpen: boolean
  onClose: () => void
  onSalvo: () => void
  jogoEditar?: Jogo | null
}

const TEMPOS_OPCOES        = [15, 20, 25, 30, 35, 40, 45].map(t => ({ value: String(t), label: `${t} min` }))
const INTERVALO_OPCOES     = [3, 5, 8, 10, 15].map(t => ({ value: String(t), label: `${t} min` }))
const ENTRE_JOGOS_OPCOES   = [5, 10, 15, 20].map(t => ({ value: String(t), label: `${t} min entre jogos` }))
const RODADA_OPCOES        = [
  { value: '', label: 'Sem rodada' },
  ...Array.from({ length: 20 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1}ª Rodada`,
  })),
]

export function NovoJogoModal({ isOpen, onClose, onSalvo, jogoEditar }: NovoJogoModalProps) {
  const [campeonatos,         setCampeonatos]         = useState<Campeonato[]>([])
  const [times,               setTimes]               = useState<Time[]>([])
  const [loading,             setLoading]             = useState(false)
  const [erro,                setErro]                = useState<string | null>(null)

  const [campeonatoId,        setCampeonatoId]        = useState('')
  const [timeCasaId,          setTimeCasaId]          = useState('')
  const [timeForaId,          setTimeForaId]          = useState('')
  const [data,                setData]                = useState('')
  const [hora,                setHora]                = useState('08:00')
  const [local,               setLocal]               = useState('')
  const [rodada,              setRodada]              = useState('')
  const [tempoPrimeiro,       setTempoPrimeiro]       = useState('45')
  const [tempoSegundo,        setTempoSegundo]        = useState('45')
  const [intervalo,           setIntervalo]           = useState('5')
  const [intervaloEntreJogos, setIntervaloEntreJogos] = useState('10')

  const editando = !!jogoEditar

  const duracaoTotal = Number(tempoPrimeiro) + Number(intervalo) + Number(tempoSegundo) + Number(intervaloEntreJogos)

  useEffect(() => {
    if (!isOpen) { setErro(null); return }

    const supabase = createClient()
    supabase.from('campeonatos').select('id, nome').order('nome')
      .then(({ data }) => setCampeonatos(data ?? []))

    if (jogoEditar) {
      setCampeonatoId(jogoEditar.campeonato_id)
      setTimeCasaId(jogoEditar.time_casa_id)
      setTimeForaId(jogoEditar.time_fora_id)
      setLocal(jogoEditar.local ?? '')
      setRodada(jogoEditar.rodada ? String(jogoEditar.rodada) : '')
      setTempoPrimeiro(String(jogoEditar.tempo_primeiro ?? 45))
      setTempoSegundo(String(jogoEditar.tempo_segundo ?? 45))
      setIntervalo(String(jogoEditar.intervalo ?? 5))
      // intervalo_entre_jogos vem do banco mas pode não estar no tipo Jogo,
      // acessamos via any como o GerarJogosModal faz com o payload
      setIntervaloEntreJogos(String((jogoEditar as any).intervalo_entre_jogos ?? 10))
      if (jogoEditar.data_hora) {
        const dt = new Date(jogoEditar.data_hora)
        setData(dt.toISOString().split('T')[0])
        setHora(dt.toTimeString().slice(0, 5))
      }
    } else {
      setCampeonatoId(''); setTimeCasaId(''); setTimeForaId('')
      setData(''); setHora('08:00'); setLocal(''); setRodada('')
      setTempoPrimeiro('45'); setTempoSegundo('45'); setIntervalo('5')
      setIntervaloEntreJogos('10')
    }
  }, [isOpen, jogoEditar])

  useEffect(() => {
    if (!campeonatoId) { setTimes([]); return }
    const supabase = createClient()
    supabase.from('times').select('id, nome, logo_url')
      .eq('campeonato_id', campeonatoId).order('nome')
      .then(({ data }) => setTimes(data ?? []))
  }, [campeonatoId])

  async function handleSalvar() {
    setErro(null)
    if (!campeonatoId)             return setErro('Selecione o campeonato.')
    if (!timeCasaId || !timeForaId) return setErro('Selecione os dois times.')
    if (timeCasaId === timeForaId)  return setErro('Os times não podem ser iguais.')

    setLoading(true)
    try {
      const supabase = createClient()
      const data_hora = data && hora ? `${data}T${hora}:00` : null

      // Mesmo padrão de insert do GerarJogosModal
      const payload = {
        campeonato_id:          campeonatoId,
        time_casa_id:           timeCasaId,
        time_fora_id:           timeForaId,
        data_hora,
        local:                  local || null,
        rodada:                 rodada !== '' ? Number(rodada) : null,
        tempo_primeiro:         Number(tempoPrimeiro),
        tempo_segundo:          Number(tempoSegundo),
        intervalo:              Number(intervalo),
        intervalo_entre_jogos:  Number(intervaloEntreJogos),
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

      if (editando && jogoEditar) {
        const { error } = await supabase.from('jogos').update(payload).eq('id', jogoEditar.id)
        if (error) throw new Error(error.message)
      } else {
        const { error } = await supabase.from('jogos').insert(payload)
        if (error) throw new Error(error.message)
      }

      onSalvo()
      onClose()
    } catch (err: any) {
      setErro(err.message ?? 'Erro ao salvar.')
    } finally {
      setLoading(false)
    }
  }

  const campeonatoOptions = [
    { value: '', label: 'Selecione...' },
    ...campeonatos.map(c => ({ value: c.id, label: c.nome })),
  ]
  const timeCasaOptions = [
    { value: '', label: 'Selecione...' },
    ...times.filter(t => t.id !== timeForaId).map(t => ({ value: t.id, label: t.nome })),
  ]
  const timeForaOptions = [
    { value: '', label: 'Selecione...' },
    ...times.filter(t => t.id !== timeCasaId).map(t => ({ value: t.id, label: t.nome })),
  ]

  const footer = (
    <div className="flex gap-3">
      <Button variant="ghost" size="md" fullWidth onClick={onClose} disabled={loading}>Cancelar</Button>
      <Button variant="primary" size="md" fullWidth onClick={handleSalvar} loading={loading}>
        {editando ? 'Salvar Alterações' : 'Criar Jogo'}
      </Button>
    </div>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editando ? 'Editar Jogo' : 'Novo Jogo'}
      size="2xl"
      footer={footer}
    >
      <div className="space-y-4">

        {/* Campeonato */}
        <Select
          label="Campeonato"
          required
          options={campeonatoOptions}
          value={campeonatoId}
          onChange={v => { setCampeonatoId(v); setTimeCasaId(''); setTimeForaId('') }}
          placeholder="Selecione..."
        />

        {/* Times */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Time Casa"
            required
            options={timeCasaOptions}
            value={timeCasaId}
            onChange={setTimeCasaId}
            disabled={!campeonatoId}
            placeholder="Selecione..."
          />
          <Select
            label="Time Fora"
            required
            options={timeForaOptions}
            value={timeForaId}
            onChange={setTimeForaId}
            disabled={!campeonatoId}
            placeholder="Selecione..."
          />
        </div>

        {/* Data + Hora */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <DateRangePicker
            label="Data"
            startDate={data}
            endDate=""
            onStartChange={setData}
            onEndChange={() => {}}
            singleDate
            singleDateTitle="Data do Jogo"
          />
          <Input
            label="Hora"
            type="text"
            placeholder="08:00"
            value={hora}
            onChange={e => setHora(e.target.value)}
            icon={Clock}
          />
        </div>

        {/* Local + Rodada */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Local / Campo"
            type="text"
            placeholder="Ex: Campo Municipal..."
            value={local}
            onChange={e => setLocal(e.target.value)}
            icon={MapPin}
          />
          <Select
            label="Rodada"
            options={RODADA_OPCOES}
            value={rodada}
            onChange={setRodada}
            placeholder="Sem rodada"
          />
        </div>

        {/* Duração dos tempos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Duração dos Tempos</label>
          <div className="grid grid-cols-3 gap-3">
            <Select
              label="1º Tempo"
              required
              options={TEMPOS_OPCOES}
              value={tempoPrimeiro}
              onChange={setTempoPrimeiro}
            />
            <Select
              label="Intervalo"
              options={INTERVALO_OPCOES}
              value={intervalo}
              onChange={setIntervalo}
            />
            <Select
              label="2º Tempo"
              required
              options={TEMPOS_OPCOES}
              value={tempoSegundo}
              onChange={setTempoSegundo}
            />
          </div>
        </div>

        {/* Intervalo entre jogos — mesmo padrão do GerarJogosModal */}
        <Select
          label="Intervalo entre jogos"
          required
          options={ENTRE_JOGOS_OPCOES}
          value={intervaloEntreJogos}
          onChange={setIntervaloEntreJogos}
          hint={`Duração total por jogo (com intervalo entre partidas): ${duracaoTotal} min`}
        />

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