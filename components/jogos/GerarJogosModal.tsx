// src/components/jogos/GerarJogosModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { DateRangePicker } from '@/components/ui/DateRangePicker'
import { createClient } from '@/lib/supabase'
import {
  Zap, AlertCircle, CheckCircle2, MapPin, Clock,
  CalendarDays, ListChecks, ChevronRight, RefreshCw
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

// ── Types ──────────────────────────────────────────────────────────────────

interface Time {
  id: string
  nome: string
  logo_url: string | null
}

interface Campeonato {
  id: string
  nome: string
  formato: string
}

interface ConfigJogos {
  campeonato_id: string
  data: string
  horario_inicio: string
  local: string
  rodada: string
  tempo_primeiro: number
  tempo_segundo: number
  intervalo: number
  intervalo_entre_jogos: number
  quantidade_partidas: number   // só para modo sessão
}

interface JogoGerado {
  time_casa: Time
  time_fora: Time
  data_hora: string
  horario: string
}

interface GerarJogosModalProps {
  isOpen: boolean
  onClose: () => void
  onGerado: () => void
}

type Modo  = 'completo' | 'sessao'
type Step  = 'modo' | 'config' | 'preview' | 'sucesso'

// ── Constants ──────────────────────────────────────────────────────────────

const TEMPOS_OPTIONS      = [15, 20, 30, 45].map(t => ({ value: String(t), label: `${t} min` }))
const INTERVALO_OPTIONS   = [1, 5, 10, 15].map(t => ({ value: String(t), label: `${t} min` }))
const ENTRE_JOGOS_OPTIONS = [5, 10, 15, 20].map(t => ({ value: String(t), label: `${t} min entre jogos` }))
const RODADA_OPTIONS      = [
  { value: '', label: 'Sem rodada' },
  ...Array.from({ length: 20 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1}ª Rodada`,
  })),
]

// ── Helpers ────────────────────────────────────────────────────────────────

function gerarTodosPares(times: Time[]): [Time, Time][] {
  const pares: [Time, Time][] = []
  for (let i = 0; i < times.length; i++)
    for (let j = i + 1; j < times.length; j++)
      pares.push([times[i], times[j]])
  return pares.sort(() => Math.random() - 0.5)
}

function chaveConfronto(a: string, b: string) {
  return [a, b].sort().join('|')
}

function distribuirHorarios(
  pares: [Time, Time][],
  data: string,
  horarioInicio: string,
  duracaoTotal: number
): JogoGerado[] {
  const [horas, minutos] = horarioInicio.split(':').map(Number)
  let minutosAtual = horas * 60 + minutos

  return pares.map(([casa, fora]) => {
    const h = Math.floor(minutosAtual / 60).toString().padStart(2, '0')
    const m = (minutosAtual % 60).toString().padStart(2, '0')
    const horario = `${h}:${m}`
    minutosAtual += duracaoTotal
    return { time_casa: casa, time_fora: fora, data_hora: `${data}T${horario}:00`, horario }
  })
}

// ── Componente ─────────────────────────────────────────────────────────────

export function GerarJogosModal({ isOpen, onClose, onGerado }: GerarJogosModalProps) {
  const [step,             setStep]             = useState<Step>('modo')
  const [modo,             setModo]             = useState<Modo>('completo')
  const [campeonatos,      setCampeonatos]       = useState<Campeonato[]>([])
  const [timesDisponiveis, setTimesDisponiveis]  = useState<Time[]>([])
  const [jogosPreview,     setJogosPreview]      = useState<JogoGerado[]>([])
  const [loading,          setLoading]           = useState(false)
  const [loadingTimes,     setLoadingTimes]      = useState(false)
  const [erro,             setErro]              = useState<string | null>(null)

  // Estatísticas do modo sessão
  const [totalPossivel,    setTotalPossivel]     = useState(0)
  const [jaRealizados,     setJaRealizados]      = useState(0)
  const [paresRestantes,   setParesRestantes]    = useState<[Time, Time][]>([])

  const hoje = new Date().toISOString().split('T')[0]

  const [config, setConfig] = useState<ConfigJogos>({
    campeonato_id:         '',
    data:                  hoje,
    horario_inicio:        '08:00',
    local:                 '',
    rodada:                '',
    tempo_primeiro:        45,
    tempo_segundo:         45,
    intervalo:             5,
    intervalo_entre_jogos: 10,
    quantidade_partidas:   4,
  })

  // Reset ao fechar
  useEffect(() => {
    if (!isOpen) {
      setStep('modo')
      setErro(null)
      setJogosPreview([])
      setParesRestantes([])
      setTotalPossivel(0)
      setJaRealizados(0)
    }
  }, [isOpen])

  // Carregar campeonatos
  useEffect(() => {
    const supabase = createClient()
    supabase.from('campeonatos').select('id, nome, formato').order('nome')
      .then(({ data }) => setCampeonatos(data ?? []))
  }, [])

  // Carregar times quando campeonato mudar
  useEffect(() => {
    if (!config.campeonato_id) { setTimesDisponiveis([]); return }
    setLoadingTimes(true)
    const supabase = createClient()
    supabase.from('times').select('id, nome, logo_url')
      .eq('campeonato_id', config.campeonato_id).order('nome')
      .then(({ data }) => {
        const times = data ?? []
        setTimesDisponiveis(times)
        setLoadingTimes(false)
        // Calcula total possível
        const total = (times.length * (times.length - 1)) / 2
        setTotalPossivel(total)
      })
  }, [config.campeonato_id])

  // Carregar pares já jogados quando campeonato mudar (modo sessão)
  useEffect(() => {
    if (!config.campeonato_id || timesDisponiveis.length < 2) return
    const supabase = createClient()
    supabase
      .from('jogos')
      .select('time_casa_id, time_fora_id')
      .eq('campeonato_id', config.campeonato_id)
      .neq('status', 'cancelado')
      .then(({ data }) => {
        const jogados = new Set((data ?? []).map(j => chaveConfronto(j.time_casa_id, j.time_fora_id)))
        setJaRealizados(jogados.size)

        // Monta pares restantes
        const todos = gerarTodosPares(timesDisponiveis)
        const restantes = todos.filter(([a, b]) => !jogados.has(chaveConfronto(a.id, b.id)))
        setParesRestantes(restantes)
      })
  }, [config.campeonato_id, timesDisponiveis])

  function cfg<K extends keyof ConfigJogos>(key: K, value: ConfigJogos[K]) {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  // ── Gerar preview ──────────────────────────────────────────────────────

  async function handleGerarPreview() {
    setErro(null)
    if (!config.campeonato_id)       return setErro('Selecione um campeonato.')
    if (!config.data)                return setErro('Informe a data dos jogos.')
    if (!config.local.trim())        return setErro('Informe o local dos jogos.')
    if (timesDisponiveis.length < 2) return setErro('O campeonato precisa ter pelo menos 2 times.')

    const supabase = createClient()
    const duracaoTotal = config.tempo_primeiro + config.intervalo + config.tempo_segundo + config.intervalo_entre_jogos

    if (modo === 'completo') {
      // Verifica se já existem jogos nessa data
      const { data: existentes } = await supabase
        .from('jogos').select('id')
        .eq('campeonato_id', config.campeonato_id)
        .gte('data_hora', `${config.data}T00:00:00`)
        .lte('data_hora', `${config.data}T23:59:59`)

      if (existentes && existentes.length > 0)
        return setErro(`Já existem ${existentes.length} jogo(s) para essa data. Escolha outra data.`)

      const pares = gerarTodosPares(timesDisponiveis)
      setJogosPreview(distribuirHorarios(pares, config.data, config.horario_inicio, duracaoTotal))

    } else {
      // Modo sessão — usa pares restantes
      if (paresRestantes.length === 0)
        return setErro('Todos os confrontos possíveis já foram gerados para este campeonato!')

      const qtd = Math.min(config.quantidade_partidas, paresRestantes.length)

      // Garante que nenhum time joga duas vezes na mesma sessão
      const timesNaSessao = new Set<string>()
      const paresSessao: [Time, Time][] = []

      for (const [casa, fora] of paresRestantes) {
        if (paresSessao.length >= qtd) break
        if (timesNaSessao.has(casa.id) || timesNaSessao.has(fora.id)) continue
        paresSessao.push([casa, fora])
        timesNaSessao.add(casa.id)
        timesNaSessao.add(fora.id)
      }

      if (paresSessao.length === 0)
        return setErro('Não foi possível montar confrontos sem repetir times. Tente com menos partidas.')

      setJogosPreview(distribuirHorarios(paresSessao, config.data, config.horario_inicio, duracaoTotal))
    }

    setStep('preview')
  }

  // ── Confirmar e salvar ─────────────────────────────────────────────────

  async function handleConfirmar() {
    setLoading(true); setErro(null)
    try {
      const supabase = createClient()
      const inserts = jogosPreview.map(j => ({
        campeonato_id:          config.campeonato_id,
        time_casa_id:           j.time_casa.id,
        time_fora_id:           j.time_fora.id,
        data_hora:              j.data_hora,
        local:                  config.local,
        rodada:                 config.rodada !== '' ? Number(config.rodada) : null,
        tempo_primeiro:         config.tempo_primeiro,
        tempo_segundo:          config.tempo_segundo,
        intervalo:              config.intervalo,
        status:                 'agendado',
        placar_casa:            0,
        placar_fora:            0,
        finalizado:             false,
        wo:                     false,
        cartoes_amarelos_casa:  0,
        cartoes_amarelos_fora:  0,
        cartoes_vermelhos_casa: 0,
        cartoes_vermelhos_fora: 0,
      }))
      const { error } = await supabase.from('jogos').insert(inserts)
      if (error) throw new Error(error.message)
      setStep('sucesso')
      onGerado()
    } catch (err: any) {
      setErro(err.message ?? 'Erro ao salvar jogos.')
    } finally {
      setLoading(false)
    }
  }

  // ── Options ────────────────────────────────────────────────────────────

  const campeonatoOptions = campeonatos.map(c => ({ value: c.id, label: c.nome }))
  const duracaoTotal = config.tempo_primeiro + config.intervalo + config.tempo_segundo + config.intervalo_entre_jogos
  const qtdMaxSessao = Math.floor(timesDisponiveis.length / 2)
  const qtdSessaoOptions = Array.from({ length: Math.max(qtdMaxSessao, 1) }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1} partida${i + 1 > 1 ? 's' : ''}`,
  }))

  // ── Titles & Footers ───────────────────────────────────────────────────

  const titleMap: Record<Step, string> = {
    modo:    'Gerar Jogos',
    config:  modo === 'completo' ? 'Gerar Campeonato Completo' : 'Gerar Sessão do Dia',
    preview: 'Confirmar Jogos',
    sucesso: 'Jogos Criados!',
  }

  const footerModo = (
    <div className="flex gap-3">
      <Button variant="ghost" size="md" fullWidth onClick={onClose}>Cancelar</Button>
      <Button
        variant="primary" size="md" fullWidth icon={ChevronRight}
        onClick={() => setStep('config')}
      >
        Continuar
      </Button>
    </div>
  )

  const footerConfig = (
    <div className="flex gap-3">
      <Button variant="ghost" size="md" fullWidth onClick={() => setStep('modo')}>Voltar</Button>
      <Button
        variant="primary" size="md" fullWidth icon={Zap}
        onClick={handleGerarPreview}
        disabled={!config.campeonato_id || !config.data || !config.local || timesDisponiveis.length < 2}
      >
        {modo === 'completo' ? 'Gerar Todos os Jogos' : 'Gerar Sessão'}
      </Button>
    </div>
  )

  const footerPreview = (
    <div className="flex gap-3">
      <Button variant="ghost" size="md" fullWidth onClick={() => setStep('config')}>Voltar</Button>
      <Button variant="primary" size="md" fullWidth icon={Zap} onClick={handleConfirmar} disabled={loading}>
        {loading ? 'Salvando...' : `Confirmar ${jogosPreview.length} Jogo${jogosPreview.length !== 1 ? 's' : ''}`}
      </Button>
    </div>
  )

  const footerSucesso = (
    <Button variant="primary" size="md" fullWidth onClick={onClose}>Ver Jogos</Button>
  )

  const footerMap: Record<Step, React.ReactNode> = {
    modo:    footerModo,
    config:  footerConfig,
    preview: footerPreview,
    sucesso: footerSucesso,
  }

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={titleMap[step]}
      size="2xl"
      footer={footerMap[step]}
    >

      {/* ── STEP 0: ESCOLHA DO MODO ── */}
      {step === 'modo' && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500 mb-4">
            Como deseja gerar os jogos deste campeonato?
          </p>

          {/* Opção: Completo */}
          <button
            onClick={() => setModo('completo')}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-150 ${
              modo === 'completo'
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                modo === 'completo' ? 'bg-emerald-500' : 'bg-gray-100'
              }`}>
                <CalendarDays size={20} className={modo === 'completo' ? 'text-white' : 'text-gray-400'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className={`text-sm font-bold ${modo === 'completo' ? 'text-emerald-700' : 'text-gray-800'}`}>
                    Gerar Campeonato Completo
                  </p>
                  {modo === 'completo' && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Selecionado
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Gera <strong>todos os confrontos</strong> de uma vez (todos contra todos).
                  Ideal para quem quer planejar o campeonato inteiro com datas e horários definidos.
                </p>
              </div>
            </div>
          </button>

          {/* Opção: Sessão */}
          <button
            onClick={() => setModo('sessao')}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-150 ${
              modo === 'sessao'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                modo === 'sessao' ? 'bg-blue-500' : 'bg-gray-100'
              }`}>
                <ListChecks size={20} className={modo === 'sessao' ? 'text-white' : 'text-gray-400'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className={`text-sm font-bold ${modo === 'sessao' ? 'text-blue-700' : 'text-gray-800'}`}>
                    Gerar Sessão do Dia
                  </p>
                  {modo === 'sessao' && (
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                      Selecionado
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Gera <strong>algumas partidas por vez</strong> — ideal para finais de semana.
                  O sistema garante que nenhum time repita confronto e nenhum time jogue duas vezes no mesmo dia.
                </p>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* ── STEP 1: CONFIG ── */}
      {step === 'config' && (
        <div className="space-y-5">

          {/* Campeonato */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Campeonato <span className="text-red-500">*</span>
              </label>
              {config.campeonato_id && (
                <div className="flex items-center gap-2">
                  <Badge
                    label={loadingTimes ? 'Carregando...' : `${timesDisponiveis.length} time${timesDisponiveis.length !== 1 ? 's' : ''}`}
                    variant={loadingTimes ? 'gray' : timesDisponiveis.length >= 2 ? 'success' : 'orange'}
                    size="sm"
                    model="soft"
                    dot={!loadingTimes}
                  />
                  {modo === 'sessao' && !loadingTimes && totalPossivel > 0 && (
                    <Badge
                      label={`${paresRestantes.length} confronto${paresRestantes.length !== 1 ? 's' : ''} restante${paresRestantes.length !== 1 ? 's' : ''}`}
                      variant={paresRestantes.length === 0 ? 'orange' : 'info'}
                      size="sm"
                      model="soft"
                    />
                  )}
                </div>
              )}
            </div>
            <Select
              options={campeonatoOptions}
              value={config.campeonato_id}
              onChange={v => cfg('campeonato_id', v)}
              placeholder="Selecione um campeonato..."
            />

            {/* Barra de progresso do campeonato (só modo sessão) */}
            {modo === 'sessao' && config.campeonato_id && !loadingTimes && totalPossivel > 0 && (
              <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    Progresso do campeonato
                  </span>
                  <span className="text-[11px] font-bold text-gray-700">
                    {jaRealizados} / {totalPossivel} jogos
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.round((jaRealizados / totalPossivel) * 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] text-emerald-600 font-medium">{jaRealizados} realizados</span>
                  <span className="text-[10px] text-blue-600 font-medium">{paresRestantes.length} restantes</span>
                </div>
              </div>
            )}
          </div>

          {/* Quantidade de partidas — só modo sessão */}
          {modo === 'sessao' && (
            <Select
              label="Quantas partidas nessa sessão?"
              required
              options={qtdSessaoOptions}
              value={String(config.quantidade_partidas)}
              onChange={v => cfg('quantidade_partidas', Number(v))}
              hint={
                paresRestantes.length > 0
                  ? `Máximo possível sem repetir times no dia: ${Math.min(qtdMaxSessao, paresRestantes.length)} partidas`
                  : 'Selecione um campeonato primeiro'
              }
            />
          )}

          {/* Data + Horário */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DateRangePicker
              label="Data dos Jogos"
              required
              startDate={config.data}
              endDate=""
              onStartChange={v => cfg('data', v)}
              onEndChange={() => {}}
              singleDate
              singleDateTitle="Data dos Jogos"
            />
            <Input
              label="Horário de Início"
              required
              type="text"
              placeholder="08:00"
              value={config.horario_inicio}
              onChange={e => cfg('horario_inicio', e.target.value)}
              icon={Clock}
            />
          </div>

          {/* Local + Rodada */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Local / Campo"
              required
              type="text"
              placeholder="Ex: Campo Municipal..."
              value={config.local}
              onChange={e => cfg('local', e.target.value)}
              icon={MapPin}
            />
            <Select
              label="Rodada"
              options={RODADA_OPTIONS}
              value={config.rodada}
              onChange={v => cfg('rodada', v)}
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
                options={TEMPOS_OPTIONS}
                value={String(config.tempo_primeiro)}
                onChange={v => cfg('tempo_primeiro', Number(v))}
              />
              <Select
                label="Intervalo"
                options={INTERVALO_OPTIONS}
                value={String(config.intervalo)}
                onChange={v => cfg('intervalo', Number(v))}
              />
              <Select
                label="2º Tempo"
                required
                options={TEMPOS_OPTIONS}
                value={String(config.tempo_segundo)}
                onChange={v => cfg('tempo_segundo', Number(v))}
              />
            </div>
          </div>

          {/* Intervalo entre jogos */}
          <Select
            label="Intervalo entre jogos"
            required
            options={ENTRE_JOGOS_OPTIONS}
            value={String(config.intervalo_entre_jogos)}
            onChange={v => cfg('intervalo_entre_jogos', Number(v))}
            hint={`Duração total por jogo (com intervalo entre partidas): ${duracaoTotal} min`}
          />

          {erro && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              {erro}
            </div>
          )}
        </div>
      )}

      {/* ── STEP 2: PREVIEW ── */}
      {step === 'preview' && (
        <div className="space-y-4">

          {/* Resumo */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-gray-500">
              <span className="font-semibold text-gray-900">{jogosPreview.length} jogo{jogosPreview.length !== 1 ? 's' : ''}</span>
              {' '}em{' '}
              <span className="font-semibold text-gray-900">
                {new Date(config.data + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
              </span>
              {config.rodada && (
                <> · <span className="font-semibold text-gray-900">{config.rodada}ª Rodada</span></>
              )}
            </span>

            {modo === 'sessao' && (
              <Badge
                label={`${paresRestantes.length - jogosPreview.length} restantes após essa sessão`}
                variant="info"
                size="sm"
                model="soft"
              />
            )}
          </div>

          {/* Lista de jogos */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {jogosPreview.map((jogo, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-xs font-bold text-gray-400 w-5 text-right shrink-0">{i + 1}</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                  {jogo.horario}
                </span>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {jogo.time_casa.logo_url
                    ? <img src={jogo.time_casa.logo_url} className="w-5 h-5 rounded-full object-cover shrink-0" alt="" />
                    : <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <span className="text-[8px] font-bold text-emerald-700">{jogo.time_casa.nome.slice(0,2).toUpperCase()}</span>
                      </div>
                  }
                  <span className="text-sm font-medium text-gray-800 truncate">{jogo.time_casa.nome}</span>
                  <span className="text-xs text-gray-300 shrink-0 font-light">vs</span>
                  {jogo.time_fora.logo_url
                    ? <img src={jogo.time_fora.logo_url} className="w-5 h-5 rounded-full object-cover shrink-0" alt="" />
                    : <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <span className="text-[8px] font-bold text-blue-700">{jogo.time_fora.nome.slice(0,2).toUpperCase()}</span>
                      </div>
                  }
                  <span className="text-sm font-medium text-gray-800 truncate">{jogo.time_fora.nome}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Info local/tempo */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700">
            <MapPin size={12} className="shrink-0" />
            <span className="truncate">{config.local}</span>
            <span className="text-blue-200 shrink-0">·</span>
            <Clock size={12} className="shrink-0" />
            <span className="shrink-0">{config.tempo_primeiro}' + {config.intervalo}' + {config.tempo_segundo}'</span>
          </div>

          {/* Aviso modo sessão */}
          {modo === 'sessao' && paresRestantes.length > jogosPreview.length && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700">
              <RefreshCw size={13} className="shrink-0 mt-0.5" />
              <span>
                Ainda restam <strong>{paresRestantes.length - jogosPreview.length} confrontos</strong> para gerar em próximas sessões.
                Nenhum time jogará duas vezes no mesmo dia.
              </span>
            </div>
          )}

          {modo === 'sessao' && paresRestantes.length === jogosPreview.length && (
            <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-700">
              <CheckCircle2 size={13} className="shrink-0 mt-0.5" />
              <span>
                Esta é a <strong>última sessão</strong>! Após esses jogos, todos os confrontos do campeonato terão sido realizados.
              </span>
            </div>
          )}

          {erro && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              {erro}
            </div>
          )}
        </div>
      )}

      {/* ── STEP 3: SUCESSO ── */}
      {step === 'sucesso' && (
        <div className="flex flex-col items-center text-center gap-4 py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {jogosPreview.length} jogo{jogosPreview.length !== 1 ? 's' : ''} criado{jogosPreview.length !== 1 ? 's' : ''}!
            </h3>
            <p className="text-sm text-gray-500">
              {modo === 'completo'
                ? 'Todos os jogos do campeonato foram agendados com sucesso.'
                : paresRestantes.length === jogosPreview.length
                  ? 'Campeonato completo! Todos os confrontos foram gerados.'
                  : `Sessão criada! Ainda restam ${paresRestantes.length - jogosPreview.length} confrontos para próximas sessões.`
              }
            </p>
          </div>
        </div>
      )}

    </Modal>
  )
}