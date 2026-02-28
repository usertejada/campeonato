// src/components/times/CardTime.tsx
'use client'

import { useState } from 'react'
import { Users, MapPin, Trophy, Calendar, Settings, Eye, Edit, ShieldCheck, ShieldOff, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Time } from '@/types/time'

interface CardTimeProps {
  time: Time
  podeAprovar: boolean
  onDetalhes: () => void
  onEditar: () => void
  onAprovar: () => void
  onExcluir: () => void
}

export function CardTime({ time, podeAprovar, onDetalhes, onEditar, onAprovar, onExcluir }: CardTimeProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">

      {/* Header */}
      <div className="bg-linear-to-br from-emerald-500 to-teal-600 p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            {time.logo_url ? (
              <img src={time.logo_url} alt={time.nome} className="w-12 h-12 object-cover rounded-full border-2 border-white shrink-0" />
            ) : (
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0">
                <Users size={22} className="text-emerald-600" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-bold text-white text-sm leading-tight truncate">{time.nome}</h3>
              {time.cidade && <p className="text-white/75 text-xs truncate">{time.cidade}</p>}
            </div>
          </div>

          {/* Menu dropdown */}
          <div className="relative shrink-0">
            <button onClick={() => setMenuOpen(v => !v)} className="p-1.5 rounded-lg hover:bg-white/20 transition text-white">
              <Settings size={18} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                  <button onClick={() => { onDetalhes(); setMenuOpen(false) }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                    <Eye size={16} className="text-gray-500" /> Detalhes
                  </button>
                  <button onClick={() => { onEditar(); setMenuOpen(false) }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                    <Edit size={16} className="text-gray-500" /> Editar
                  </button>

                  {/* Botão aprovar/reprovar — só aparece pra admin ou organizador */}
                  {podeAprovar && (
                    <button onClick={() => { onAprovar(); setMenuOpen(false) }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      {time.aprovado
                        ? <><ShieldOff size={16} className="text-gray-500" /> Reprovar</>
                        : <><ShieldCheck size={16} className="text-gray-500" /> Aprovar</>
                      }
                    </button>
                  )}

                  <div className="my-1 border-t border-gray-100" />
                  <button onClick={() => { onExcluir(); setMenuOpen(false) }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                    <Trash2 size={16} /> Excluir
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex justify-end mb-3">
          <Badge
            label={time.aprovado ? 'Aprovado' : 'Pendente'}
            variant={time.aprovado ? 'success' : 'warning'}
            size="sm" model="soft" dot
          />
        </div>

        <div className="space-y-2">
          {time.campeonato?.nome && (
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-gray-700 truncate">{time.campeonato.nome}</span>
            </div>
          )}
          {time.cidade && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-gray-700 truncate">{time.cidade}</span>
            </div>
          )}
          {time.quantidade_jogadores && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-gray-700">{time.quantidade_jogadores} jogadores</span>
            </div>
          )}
          {time.ano_fundacao && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-gray-700">Fundado em {time.ano_fundacao}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="soft-blue" size="md" fullWidth onClick={onDetalhes}>Detalhes</Button>
          <Button variant="soft" size="md" fullWidth onClick={onEditar}>Editar</Button>
        </div>
      </div>
    </div>
  )
}