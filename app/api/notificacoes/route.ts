// src/app/api/notificacoes/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendNotification } from '@/lib/onesignal'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function isAuthorized(req: NextRequest) {
  const secret = req.headers.get('x-webhook-secret')
  console.log('[Webhook] Secret recebido:', secret)
  console.log('[Webhook] Secret esperado:', process.env.WEBHOOK_SECRET)
  console.log('[Webhook] Bate?', secret === process.env.WEBHOOK_SECRET)
  return secret === process.env.WEBHOOK_SECRET
}

export async function POST(req: NextRequest) {
  console.log('[Webhook] ========== NOVA REQUISIÇÃO ==========')
  console.log('[Webhook] Headers:', Object.fromEntries(req.headers.entries()))

  if (!isAuthorized(req)) {
    console.log('[Webhook] BLOQUEADO — secret inválido')
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const payload = await req.json()
  console.log('[Webhook] Payload completo:', JSON.stringify(payload, null, 2))

  const { type, table, record, old_record } = payload
  console.log('[Webhook] type:', type, '| table:', table)
  console.log('[Webhook] record:', JSON.stringify(record))
  console.log('[Webhook] old_record:', JSON.stringify(old_record))

  try {

    // ── 1. CARTÃO AMARELO OU VERMELHO ────────────────────────
    if (table === 'eventos_jogo' && type === 'INSERT') {
      console.log('[Webhook] → eventos_jogo INSERT | tipo:', record?.tipo)

      const evento = record
      if (evento.tipo !== 'amarelo' && evento.tipo !== 'vermelho') {
        console.log('[Webhook] Tipo ignorado:', evento.tipo)
        return NextResponse.json({ ok: true })
      }

      const { data: jogo } = await supabase
        .from('jogos')
        .select(`
          id,
          campeonato:campeonatos ( nome ),
          time_casa:times!jogos_time_casa_id_fkey ( id, nome, tecnico_id ),
          time_fora:times!jogos_time_fora_id_fkey ( id, nome, tecnico_id )
        `)
        .eq('id', evento.jogo_id)
        .single()

      const { data: jogador } = await supabase
        .from('jogadores')
        .select('nome, time_id')
        .eq('id', evento.jogador_id)
        .single()

      console.log('[Webhook] jogo encontrado:', !!jogo, '| jogador encontrado:', !!jogador)

      if (!jogo || !jogador) return NextResponse.json({ ok: true })

      const timeCasa  = jogo.time_casa as any
      const timeFora  = jogo.time_fora as any
      const time      = jogador.time_id === timeCasa?.id ? timeCasa : timeFora
      const tecnicoId = time?.tecnico_id

      console.log('[Webhook] tecnico_id:', tecnicoId)
      if (!tecnicoId) return NextResponse.json({ ok: true })

      const cartao  = evento.tipo === 'amarelo' ? '🟨 Cartão Amarelo' : '🟥 Cartão Vermelho'
      const acao    = evento.tipo === 'amarelo' ? 'recebeu cartão amarelo' : 'foi expulso'
      const campNome = (jogo.campeonato as any)?.nome ?? ''

      console.log('[Webhook] Enviando notif cartão para:', tecnicoId)
      await sendNotification({
        title:   `${cartao} — ${time.nome}`,
        message: `${jogador.nome} ${acao} na partida de ${campNome}`,
        userIds: [tecnicoId],
        url:     `${process.env.NEXT_PUBLIC_APP_URL}/jogos`,
      })
    }

    // ── 2. NOVA TABELA DE JOGOS (INSERT em jogos) ────────────
    if (table === 'jogos' && type === 'INSERT') {
      console.log('[Webhook] → jogos INSERT')

      const { data: tecnicos } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'tecnico')

      const tecnicoIds = (tecnicos ?? []).map((t: any) => t.id)
      console.log('[Webhook] Técnicos encontrados:', tecnicoIds.length)

      if (tecnicoIds.length === 0) return NextResponse.json({ ok: true })

      const { data: jogo } = await supabase
        .from('jogos')
        .select(`
          data_hora,
          time_casa:times!jogos_time_casa_id_fkey ( nome ),
          time_fora:times!jogos_time_fora_id_fkey ( nome )
        `)
        .eq('id', record.id)
        .single()

      if (!jogo) return NextResponse.json({ ok: true })

      const casa = (jogo.time_casa as any)?.nome ?? '?'
      const fora = (jogo.time_fora as any)?.nome ?? '?'

      console.log('[Webhook] Enviando notif novo jogo:', casa, 'x', fora)
      await sendNotification({
        title:   '📅 Novo jogo agendado!',
        message: `${casa} x ${fora} — Confira a tabela de jogos atualizada`,
        userIds: tecnicoIds,
        url:     `${process.env.NEXT_PUBLIC_APP_URL}/jogos`,
      })
    }

    // ── 3. PARTIDA FINALIZADA ────────────────────────────────
    if (table === 'jogos' && type === 'UPDATE') {
      console.log('[Webhook] → jogos UPDATE')
      console.log('[Webhook] status novo:', record?.status, '| status antigo:', old_record?.status)

      const jogoAtualizado = record
      const jogoAnterior   = old_record

      const finalizouAgora =
        jogoAtualizado.status === 'finalizado' &&
        jogoAnterior?.status  !== 'finalizado'

      console.log('[Webhook] finalizouAgora:', finalizouAgora)

      if (!finalizouAgora) return NextResponse.json({ ok: true })

      const { data: tecnicos } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'tecnico')

      const tecnicoIds = (tecnicos ?? []).map((t: any) => t.id)
      console.log('[Webhook] Técnicos para notif:', tecnicoIds.length)

      const { data: jogo } = await supabase
        .from('jogos')
        .select(`
          placar_casa,
          placar_fora,
          time_casa:times!jogos_time_casa_id_fkey ( nome ),
          time_fora:times!jogos_time_fora_id_fkey ( nome )
        `)
        .eq('id', jogoAtualizado.id)
        .single()

      if (!jogo) return NextResponse.json({ ok: true })

      const casa   = (jogo.time_casa as any)?.nome ?? '?'
      const fora   = (jogo.time_fora as any)?.nome ?? '?'
      const placar = `${jogo.placar_casa} x ${jogo.placar_fora}`

      console.log('[Webhook] Enviando notif partida finalizada:', casa, placar, fora)
      await sendNotification({
        title:   '⚽ Partida finalizada!',
        message: `${casa} ${placar} ${fora}`,
        userIds: tecnicoIds.length > 0 ? tecnicoIds : undefined,
        url:     `${process.env.NEXT_PUBLIC_APP_URL}/historico`,
      })
    }

    // ── 4. ARTILHARIA TOP 3 ──────────────────────────────────
    if (table === 'eventos_jogo' && type === 'INSERT' && record.tipo === 'gol') {
      console.log('[Webhook] → eventos_jogo INSERT (gol)')

      const { data: jogador } = await supabase
        .from('jogadores')
        .select('id, nome, time_id')
        .eq('id', record.jogador_id)
        .single()

      if (!jogador) return NextResponse.json({ ok: true })

      const { data: jogo } = await supabase
        .from('jogos')
        .select('campeonato_id')
        .eq('id', record.jogo_id)
        .single()

      if (!jogo?.campeonato_id) return NextResponse.json({ ok: true })

      const { data: artilharia } = await supabase
        .from('eventos_jogo')
        .select(`jogador_id, jogador:jogadores ( nome, time_id )`)
        .eq('tipo', 'gol')
        .in('jogo_id',
          (await supabase
            .from('jogos')
            .select('id')
            .eq('campeonato_id', jogo.campeonato_id)
          ).data?.map((j: any) => j.id) ?? []
        )

      const contagem: Record<string, { nome: string; time_id: string; gols: number }> = {}
      for (const e of artilharia ?? []) {
        const jId = e.jogador_id
        if (!contagem[jId]) {
          contagem[jId] = { nome: (e.jogador as any)?.nome ?? '', time_id: (e.jogador as any)?.time_id ?? '', gols: 0 }
        }
        contagem[jId].gols++
      }

      const top3 = Object.entries(contagem)
        .sort((a, b) => b[1].gols - a[1].gols)
        .slice(0, 3)
        .map(([id, dados]) => ({ id, ...dados }))

      const posicao = top3.findIndex(t => t.id === jogador.id)
      console.log('[Webhook] Artilharia — posição do jogador:', posicao)
      if (posicao === -1) return NextResponse.json({ ok: true })

      const { data: time } = await supabase
        .from('times')
        .select('tecnico_id, nome')
        .eq('id', jogador.time_id)
        .single()

      if (!time?.tecnico_id) return NextResponse.json({ ok: true })

      const medalhas = ['🥇', '🥈', '🥉']
      const gols = top3[posicao].gols

      console.log('[Webhook] Enviando notif artilharia para:', time.tecnico_id)
      await sendNotification({
        title:   `${medalhas[posicao]} Artilharia — ${time.nome}`,
        message: `${jogador.nome} está em ${posicao + 1}º na artilharia com ${gols} gol${gols > 1 ? 's' : ''}!`,
        userIds: [time.tecnico_id],
        url:     `${process.env.NEXT_PUBLIC_APP_URL}/artilharia`,
      })
    }

    console.log('[Webhook] ========== FIM OK ==========')
    return NextResponse.json({ ok: true })

  } catch (err: any) {
    console.error('[Webhook] ERRO:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}