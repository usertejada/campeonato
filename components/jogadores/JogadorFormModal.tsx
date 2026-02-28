// src/components/times/JogadorFormModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { User, Shirt } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { FileUpload } from '@/components/ui/FileUpload'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { DateRangePicker } from '@/components/ui/DateRangePicker'
import { NacionalidadeDocumento } from '@/components/ui/NacionalidadeDocumento'
import { PhoneInput } from '@/components/ui/PhoneInput'

export interface JogadorInsert {
  time_id: string
  nome: string
  foto_url: string | null
  foto_documento: string | null
  posicao: string
  numero_camisa: number
  data_nascimento: string
  nacionalidade: string
  telefone: string
  doc_tipo: string
  doc_numero: string
}

export interface TimeOption {
  id: string
  nome: string
  logo_url?: string | null
}

const POSICOES_OPTIONS = [
  { value: 'Goleiro',  label: 'Goleiro'  },
  { value: 'Zagueiro', label: 'Zagueiro' },
  { value: 'Lateral',  label: 'Lateral'  },
  { value: 'Volante',  label: 'Volante'  },
  { value: 'Meia',     label: 'Meia'     },
  { value: 'Atacante', label: 'Atacante' },
]

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: JogadorInsert) => void
  timeId?: string
  times?: TimeOption[]
  inicial?: Partial<JogadorInsert>
  titulo?: string
}

export function JogadorFormModal({ isOpen, onClose, onSubmit, timeId, times = [], inicial, titulo = 'Novo Jogador' }: Props) {
  const [timeSelecionadoId, setTimeSelecionadoId] = useState<string>(timeId ?? '')
  const [nome,          setNome]          = useState('')
  const [fotoUrl,       setFotoUrl]       = useState<string | null>(null)
  const [fotoDoc,       setFotoDoc]       = useState<string | null>(null)
  const [posicao,       setPosicao]       = useState('')
  const [numero,        setNumero]        = useState('')
  const [dataNasc,      setDataNasc]      = useState('')
  const [nacionalidade, setNacionalidade] = useState('BR')
  const [telefone,      setTelefone]      = useState('')
  const [telefoneCC,    setTelefoneCC]    = useState('+55')
  const [docTipo,       setDocTipo]       = useState('cpf')
  const [docNumero,     setDocNumero]     = useState('')
  const [errors,        setErrors]        = useState<Record<string, string>>({})
  const [loading,       setLoading]       = useState(false)

  const timeAtual = times.find(t => t.id === timeSelecionadoId)

  useEffect(() => {
    if (isOpen && inicial) {
      setTimeSelecionadoId(inicial.time_id ?? timeId ?? '')
      setNome(inicial.nome ?? '')
      setFotoUrl(inicial.foto_url ?? null)
      setFotoDoc(inicial.foto_documento ?? null)
      setPosicao(inicial.posicao ?? '')
      setNumero(inicial.numero_camisa?.toString() ?? '')
      setDataNasc(inicial.data_nascimento ?? '')
      setNacionalidade(inicial.nacionalidade ?? 'BR')
      setTelefone(inicial.telefone ?? '')
      setDocTipo(inicial.doc_tipo ?? 'cpf')
      setDocNumero(inicial.doc_numero ?? '')
    }
    if (isOpen && !inicial) {
      setTimeSelecionadoId(timeId ?? '')
    }
    if (!isOpen) {
      setTimeSelecionadoId(timeId ?? '')
      setNome(''); setFotoUrl(null); setFotoDoc(null); setPosicao('')
      setNumero(''); setDataNasc(''); setNacionalidade('BR'); setTelefone('')
      setDocTipo('cpf'); setDocNumero(''); setTelefoneCC('+55'); setErrors({})
    }
  }, [isOpen, inicial, timeId])

  function validate() {
    const e: Record<string, string> = {}
    if (!timeSelecionadoId) e.time      = 'Selecione um time'
    if (!nome.trim())       e.nome      = 'Nome obrigatório'
    if (!posicao)           e.posicao   = 'Posição obrigatória'
    if (!numero || isNaN(Number(numero)) || Number(numero) < 1 || Number(numero) > 99)
                            e.numero    = 'Número de 1 a 99'
    if (!dataNasc)          e.dataNasc  = 'Data obrigatória'
    if (!telefone.trim())   e.telefone  = 'Telefone obrigatório'
    if (!docNumero.trim())  e.docNumero = 'Documento obrigatório'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setLoading(true)
    await onSubmit({
      time_id: timeSelecionadoId, nome, foto_url: fotoUrl, foto_documento: fotoDoc,
      posicao, numero_camisa: Number(numero), data_nascimento: dataNasc,
      nacionalidade, telefone, doc_tipo: docTipo, doc_numero: docNumero,
    })
    setLoading(false)
  }

  const timeOptions = [
    { value: '', label: 'Selecione um time' },
    ...times.map(t => ({ value: t.id, label: t.nome })),
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={titulo}
      size="2xl"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>Salvar</Button>
        </div>
      }
    >
      <div className="space-y-5">

        {/* Nome ── ocupa linha inteira no mobile, lado a lado no sm+ */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end">

          {/* Nome */}
          <div className="flex-1">
            <Input
              label="Nome do Jogador"
              required
              icon={User}
              placeholder="Ex: João Silva"
              value={nome}
              onChange={e => setNome(e.target.value)}
              error={errors.nome}
            />
          </div>

          {/* Time */}
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Time <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="shrink-0">
                {timeAtual?.logo_url ? (
                  <img
                    src={timeAtual.logo_url}
                    alt={timeAtual.nome}
                    className="w-9 h-9 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-[10px] font-bold">
                      {timeAtual ? timeAtual.nome.substring(0, 2).toUpperCase() : '—'}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <Select
                  options={timeOptions}
                  value={timeSelecionadoId}
                  onChange={(v) => setTimeSelecionadoId(v)}
                  error={errors.time}
                />
              </div>
            </div>
            {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
          </div>
        </div>

        {/* Fotos + Posição/Data
            Mobile : fotos em linha (como está) | posição e data abaixo, cada um full width
            Desktop: grid 2 colunas lado a lado
        */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 items-start">

          {/* Fotos — mantidas como estão */}
          <div className="flex gap-3">
            <FileUpload
              label="Foto 3x4"
              value={fotoUrl}
              onChange={setFotoUrl}
              shape="square"
              size="md"
              placeholder="Adicionar Foto"
              hint="Foto do jogador"
            />
            <FileUpload
              label="Documento"
              value={fotoDoc}
              onChange={setFotoDoc}
              shape="square"
              size="md"
              placeholder="RG / CPF"
              hint="Foto do documento"
            />
          </div>

          {/* Posição + Data — empilhados no mobile, coluna no desktop */}
          <div className="flex flex-col gap-4 w-full">
            <Select
              label="Posição"
              required
              options={POSICOES_OPTIONS}
              value={posicao}
              onChange={setPosicao}
              placeholder="Selecione a posição"
              error={errors.posicao}
            />
            <DateRangePicker
              label="Data de Nascimento"
              required
              singleDate
              singleDateTitle="Data de Nascimento"
              startDate={dataNasc}
              endDate=""
              onStartChange={setDataNasc}
              onEndChange={() => {}}
              error={errors.dataNasc}
            />
          </div>
        </div>

        {/* Telefone + Número da Camisa
            Mobile : um embaixo do outro (flex-col)
            Desktop: lado a lado (grid 2 cols)
        */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
          <PhoneInput
            label="Telefone"
            required
            countryCode={telefoneCC}
            onCountryCodeChange={setTelefoneCC}
            onPhoneChange={setTelefone}
            value={telefone}
            error={errors.telefone}
          />
          <Input
            type="number"
            label="Número da Camisa"
            required
            icon={Shirt}
            placeholder="Ex: 10"
            value={numero}
            onChange={e => setNumero(e.target.value)}
            min={1}
            max={99}
            error={errors.numero}
          />
        </div>

        <div className="border-t border-gray-100" />

        {/* Documentos — mantidos como estão */}
        <NacionalidadeDocumento
          nacionalidade={nacionalidade}
          onNacionalidadeChange={setNacionalidade}
          docTipo={docTipo}
          onDocTipoChange={setDocTipo}
          docNumero={docNumero}
          onDocNumeroChange={setDocNumero}
          errors={{ docNumero: errors.docNumero }}
        />

      </div>
    </Modal>
  )
}