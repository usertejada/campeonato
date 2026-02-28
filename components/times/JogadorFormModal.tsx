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
  timeId: string
  inicial?: Partial<JogadorInsert>
  titulo?: string
}

export function JogadorFormModal({ isOpen, onClose, onSubmit, timeId, inicial, titulo = 'Novo Jogador' }: Props) {
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

  useEffect(() => {
    if (isOpen && inicial) {
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
    if (!isOpen) {
      setNome(''); setFotoUrl(null); setFotoDoc(null); setPosicao('')
      setNumero(''); setDataNasc(''); setNacionalidade('BR'); setTelefone('')
      setDocTipo('cpf'); setDocNumero(''); setTelefoneCC('+55'); setErrors({})
    }
  }, [isOpen, inicial])

  function validate() {
    const e: Record<string, string> = {}
    if (!nome.trim())      e.nome      = 'Nome obrigatório'
    if (!posicao)          e.posicao   = 'Posição obrigatória'
    if (!numero || isNaN(Number(numero)) || Number(numero) < 1 || Number(numero) > 99)
                           e.numero    = 'Número de 1 a 99'
    if (!dataNasc)         e.dataNasc  = 'Data obrigatória'
    if (!telefone.trim())  e.telefone  = 'Telefone obrigatório'
    if (!docNumero.trim()) e.docNumero = 'Documento obrigatório'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setLoading(true)
    await onSubmit({
      time_id: timeId, nome, foto_url: fotoUrl, foto_documento: fotoDoc,
      posicao, numero_camisa: Number(numero), data_nascimento: dataNasc,
      nacionalidade, telefone, doc_tipo: docTipo, doc_numero: docNumero,
    })
    setLoading(false)
  }

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

        {/* Nome */}
        <Input
          label="Nome do Jogador"
          required
          icon={User}
          placeholder="Ex: João Silva"
          value={nome}
          onChange={e => setNome(e.target.value)}
          error={errors.nome}
        />

        {/* Grid 2 colunas: Fotos | Posição+Data */}
        <div className="grid grid-cols-2 gap-4 items-start">

          {/* Fotos */}
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

          {/* Posição + Data */}
          <div className="flex flex-col gap-4">
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

        {/* Grid 2 colunas: Telefone | Número da Camisa */}
        <div className="grid grid-cols-2 gap-4">
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

        {/* Nacionalidade + Documento */}
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