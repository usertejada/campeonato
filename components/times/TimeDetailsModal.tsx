// src/components/times/TimeDetailsModal.tsx
'use client'

import { useEffect, useState } from 'react'
import { Modal }         from '@/components/ui/Modal'
import { Button }        from '@/components/ui/Button'
import {
  DetailHeader,
  DetailCard,
  DetailIconRow,
  DetailDarkCard,
} from '@/components/details'
import { Users, MapPin, Trophy, UserPlus, Shirt, LayoutGrid, UserCheck, Calendar, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { Time }     from '@/types/time'

interface Jogador {
  id: string
  nome: string
  foto_url: string | null
  posicao: string | null
  numero_camisa: number | null
}

interface TimeDetailsModalProps {
  time: Time
  isOpen: boolean
  onClose: () => void
  isTecnico?: boolean
  onAdicionarJogador?: () => void
}

export function TimeDetailsModal({
  time,
  isOpen,
  onClose,
  isTecnico = false,
  onAdicionarJogador,
}: TimeDetailsModalProps) {
  const [jogadores, setJogadores] = useState<Jogador[]>([])
  const [loadingJogadores, setLoadingJogadores] = useState(false)
  const [nomeTecnico, setNomeTecnico] = useState<string | null>(null)
  const [telefoneTecnico, setTelefoneTecnico] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const supabase = createClient()

    // Busca jogadores (sempre, não só para técnico)
    setLoadingJogadores(true)
    supabase
      .from('jogadores')
      .select('id, nome, foto_url, posicao, numero_camisa')
      .eq('time_id', time.id)
      .order('numero_camisa', { ascending: true })
      .then(({ data }) => {
        setJogadores(data ?? [])
        setLoadingJogadores(false)
      })

    // Busca nome e telefone do técnico se houver tecnico_id
    if (time.tecnico_id) {
      supabase
        .from('profiles')
        .select('nome, telefone')
        .eq('id', time.tecnico_id)
        .single()
        .then(({ data }) => {
          setNomeTecnico(data?.nome ?? null)
          setTelefoneTecnico(data?.telefone ?? null)
        })
    } else {
      setNomeTecnico(null)
      setTelefoneTecnico(null)
    }
  }, [isOpen, time.id, time.tecnico_id])

  const aprovado = time.aprovado

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      showCloseButton={false}
      mobileCenter
      header={
        <DetailHeader
          title={time.nome}
          subtitle={time.campeonato?.nome}
          logo={time.logo_url ?? null}
          fallbackIcon={Users}
          badgeLabel={aprovado ? 'Aprovado' : 'Pendente'}
          badgeVariant={aprovado ? 'success' : 'warning'}
          badgeGlow={aprovado ? '#34d399' : '#fbbf24'}
          gradient="bg-gradient-to-br from-violet-700 via-purple-500 to-pink-500"
          onClose={onClose}
        />
      }
    >
      <div className="
        -mx-5 -mt-5 -mb-5
        sm:mx-0 sm:mt-0 sm:mb-0
        px-4 pt-3 pb-4
        sm:px-0 sm:pt-1 sm:pb-0
        bg-gray-50 sm:bg-transparent
        flex flex-col gap-2 sm:gap-2.5
      ">

        {/* Campeonato + Jogadores */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
          {time.campeonato?.nome && (
            <DetailCard label="Campeonato">
              <DetailIconRow
                icon={Trophy}
                iconBg="bg-violet-100"
                iconColor="text-violet-700"
                value={time.campeonato.nome}
              />
            </DetailCard>
          )}

          <DetailCard label="Jogadores">
            <DetailIconRow
              icon={LayoutGrid}
              iconBg="bg-pink-100"
              iconColor="text-pink-500"
              value={
                loadingJogadores
                  ? '...'
                  : time.quantidade_jogadores != null
                    ? `${time.quantidade_jogadores} jogadores`
                    : `${jogadores.length} jogadores`
              }
            />
          </DetailCard>
        </div>

        {/* Cidade + Ano de Fundação lado a lado */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
          {time.cidade && (
            <DetailCard label="Cidade">
              <DetailIconRow
                icon={MapPin}
                iconBg="bg-red-100"
                iconColor="text-red-500"
                value={time.cidade}
                round
              />
            </DetailCard>
          )}

          {time.ano_fundacao && (
            <DetailCard label="Ano de Fundação">
              <DetailIconRow
                icon={Calendar}
                iconBg="bg-blue-100"
                iconColor="text-blue-600"
                value={String(time.ano_fundacao)}
              />
            </DetailCard>
          )}
        </div>

        {/* Telefone do Técnico */}
        {telefoneTecnico && (
          <DetailCard label="Telefone do Técnico">
            <DetailIconRow
              icon={Phone}
              iconBg="bg-green-100"
              iconColor="text-green-600"
              value={telefoneTecnico}
            />
          </DetailCard>
        )}

        {/* Técnico Responsável */}
        {nomeTecnico && (
          <DetailDarkCard
            icon={UserCheck}
            label="Técnico Responsável"
            value={nomeTecnico}
          />
        )}

        {/* ── Lista de jogadores (só técnico) ── */}
        {isTecnico && (
          <div className="w-full">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                Jogadores ({jogadores.length})
              </span>
              {onAdicionarJogador && (
                <Button
                  variant="soft"
                  size="sm"
                  icon={UserPlus}
                  fullWidth={false}
                  onClick={onAdicionarJogador}
                >
                  Adicionar
                </Button>
              )}
            </div>

            {loadingJogadores && (
              <p className="text-xs text-gray-400 text-center py-4">
                Carregando jogadores...
              </p>
            )}

            {!loadingJogadores && jogadores.length === 0 && (
              <div className="text-center py-6 bg-white rounded-xl border border-dashed border-gray-200">
                <Users size={24} className="text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-400">Nenhum jogador cadastrado</p>
                <p className="text-xs text-gray-400">Clique em "Adicionar" para começar</p>
              </div>
            )}

            {!loadingJogadores && jogadores.length > 0 && (
              <div className="space-y-2">
                {jogadores.map((jogador) => (
                  <DetailCard key={jogador.id} label="" row>
                    {jogador.foto_url ? (
                      <img
                        src={jogador.foto_url}
                        alt={jogador.nome}
                        className="w-9 h-9 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                        <Users size={14} className="text-gray-400" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0 ml-2.5">
                      <p className="text-sm font-semibold text-gray-900 truncate leading-tight">
                        {jogador.nome}
                      </p>
                      {jogador.posicao && (
                        <p className="text-[11px] text-gray-500 leading-tight">
                          {jogador.posicao}
                        </p>
                      )}
                    </div>

                    {jogador.numero_camisa && (
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <Shirt size={12} className="text-gray-400" />
                        <span className="text-sm font-extrabold text-gray-700">
                          #{jogador.numero_camisa}
                        </span>
                      </div>
                    )}
                  </DetailCard>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </Modal>
  )
}