// src/components/ui/NacionalidadeDocumento.tsx
'use client'

import { useState } from 'react'
import { ChevronDown, FileText } from 'lucide-react'
import { Input } from './Input'

// ─── Dados por país ────────────────────────────────────────────────────────────

export const PAISES = [
  { key: 'BR', label: 'Brasileiro',  flag: '🇧🇷', ddi: '+55', mask: '(00) 00000-0000' },
  { key: 'CO', label: 'Colombiano',  flag: '🇨🇴', ddi: '+57', mask: '000 0000000'      },
  { key: 'PE', label: 'Peruano',     flag: '🇵🇪', ddi: '+51', mask: '000 000 0000'     },
]

const DOCS: Record<string, { key: string; label: string; mask: string }[]> = {
  BR: [
    { key: 'cpf', label: 'CPF',  mask: '000.000.000-00'  },
    { key: 'rg',  label: 'RG',   mask: '00.000.000-0'    },
  ],
  CO: [{ key: 'dni_co', label: 'DNI Colômbia', mask: '0.000.000.000' }],
  PE: [{ key: 'dni_pe', label: 'DNI Peru',     mask: '00000000'       }],
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface NacionalidadeDocumentoProps {
  nacionalidade: string
  onNacionalidadeChange: (value: string) => void
  docTipo: string
  onDocTipoChange: (value: string) => void
  docNumero: string
  onDocNumeroChange: (value: string) => void
  errors?: { nacionalidade?: string; docNumero?: string }
}

// ─── Seletor de DDI ────────────────────────────────────────────────────────────

export function DDISelector({ pais, onChange }: { pais: typeof PAISES[0]; onChange: (p: typeof PAISES[0]) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-3 py-2 h-full border-r border-gray-300 hover:bg-gray-50 transition rounded-l-lg text-sm font-medium text-gray-700 whitespace-nowrap"
      >
        <span className="text-base">{pais.flag}</span>
        <span className="text-gray-500">{pais.ddi}</span>
        <ChevronDown size={12} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-30 py-1 overflow-hidden">
            {PAISES.map(p => (
              <button
                key={p.key}
                type="button"
                onClick={() => { onChange(p); setOpen(false) }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition ${pais.key === p.key ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-700'}`}
              >
                <span className="text-base">{p.flag}</span>
                <span>{p.label}</span>
                <span className="ml-auto text-gray-400 text-xs">{p.ddi}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Componente principal ──────────────────────────────────────────────────────

export function NacionalidadeDocumento({
  nacionalidade, onNacionalidadeChange,
  docTipo, onDocTipoChange,
  docNumero, onDocNumeroChange,
  errors = {},
}: NacionalidadeDocumentoProps) {
  const paisSelecionado = PAISES.find(p => p.key === nacionalidade) ?? PAISES[0]
  const docsDisponiveis = DOCS[paisSelecionado.key] ?? []
  const docAtivo = docsDisponiveis.find(d => d.key === docTipo) ?? docsDisponiveis[0]

  // Quando troca nacionalidade → reseta doc para o primeiro disponível
  function handleNacionalidade(novoPais: typeof PAISES[0]) {
    onNacionalidadeChange(novoPais.key)
    const primeiroDoc = DOCS[novoPais.key]?.[0]
    if (primeiroDoc) onDocTipoChange(primeiroDoc.key)
    onDocNumeroChange('')
    }

  return (
    <div className="space-y-4">

      {/* Documentos de Identificação */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-0.5">
          Documentos de Identificação <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-400 mb-3">Selecione e preencha pelo menos um documento</p>

        {/* Grid 2 colunas: Nacionalidade | Campo do documento */}
        <div className="grid grid-cols-2 gap-4">

          {/* Nacionalidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nacionalidade <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={paisSelecionado.key}
                onChange={e => {
                  const p = PAISES.find(x => x.key === e.target.value)!
                  handleNacionalidade(p)
                }}
                className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {PAISES.map(p => (
                  <option key={p.key} value={p.key}>{p.flag} {p.label}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Coluna direita: checkboxes (só BR) + campo */}
          <div className="flex flex-col gap-2">

            {/* Checkboxes CPF / RG — só para Brasil */}
            {paisSelecionado.key === 'BR' && (
              <div className="flex gap-4">
                {docsDisponiveis.map(doc => (
                  <label key={doc.key} className="flex items-center gap-2 cursor-pointer select-none">
                    <div
                      onClick={() => { onDocTipoChange(doc.key); onDocNumeroChange('') }}
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${
                        docTipo === doc.key
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {docTipo === doc.key && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                          <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{doc.label}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Campo do número */}
            {docAtivo && (
              <Input
                icon={FileText}
                label={paisSelecionado.key !== 'BR' ? docAtivo.label : undefined}
                placeholder={docAtivo.mask}
                value={docNumero}
                onChange={e => onDocNumeroChange(e.target.value)}
                error={errors.docNumero}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}