// src/app/api/cron/jogos-hoje/route.ts
//
// Esse endpoint é chamado todo dia às 8h pelo Vercel Cron
// Envia notificação pra cada técnico com os jogos do dia do seu time
//
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendNotification } from '@/lib/onesignal'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  // Segurança: só o Vercel Cron pode chamar
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  // Pega o início e fim do dia de hoje (UTC)
  const hoje      = new Date()
  const inicio    = new Date(hoje)
  inicio.setUTCHours(0, 0, 0, 0)
  const fim       = new Date(hoje)
  fim.setUTCHours(23, 59, 59, 999)

  // Busca todos os jogos de hoje que ainda não foram finalizados
  const { data: jogos, error } = await supabase
    .from('jogos')
    .select(`
      id,
      data_hora,
      time_casa:times!jogos_time_casa_id_fkey ( id, nome, tecnico_id ),
      time_fora:times!jogos_time_fora_id_fkey ( id, nome, tecnico_id ),
      campeonato:campeonatos ( nome )
    `)
    .gte('data_hora', inicio.toISOString())
    .lte('data_hora', fim.toISOString())
    .neq('status', 'finalizado')

  if (error) {
    console.error('[Cron] Erro ao buscar jogos:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!jogos || jogos.length === 0) {
    return NextResponse.json({ ok: true, message: 'Nenhum jogo hoje' })
  }

  // Agrupa notificações por técnico pra não mandar várias mensagens
  const porTecnico: Record<string, { tecnicoId: string; mensagens: string[] }> = {}

  for (const jogo of jogos) {
    const casa      = jogo.time_casa as any
    const fora      = jogo.time_fora as any
    const horario   = new Date(jogo.data_hora).toLocaleTimeString('pt-BR', {
      hour:   '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo',
    })
    const texto = `⏰ Hoje às ${horario} — ${casa?.nome} x ${fora?.nome}`

    // Técnico do time da casa
    if (casa?.tecnico_id) {
      if (!porTecnico[casa.tecnico_id]) {
        porTecnico[casa.tecnico_id] = { tecnicoId: casa.tecnico_id, mensagens: [] }
      }
      porTecnico[casa.tecnico_id].mensagens.push(texto)
    }

    // Técnico do time de fora (se diferente)
    if (fora?.tecnico_id && fora.tecnico_id !== casa?.tecnico_id) {
      if (!porTecnico[fora.tecnico_id]) {
        porTecnico[fora.tecnico_id] = { tecnicoId: fora.tecnico_id, mensagens: [] }
      }
      porTecnico[fora.tecnico_id].mensagens.push(texto)
    }
  }

  // Envia uma notificação por técnico com todos os jogos do dia
  const envios = Object.values(porTecnico).map(({ tecnicoId, mensagens }) =>
    sendNotification({
      title:   '📅 Jogos de hoje!',
      message: mensagens.join('\n'),
      userIds: [tecnicoId],
      url:     `${process.env.NEXT_PUBLIC_APP_URL}/jogos`,
    })
  )

  await Promise.all(envios)

  return NextResponse.json({
    ok:      true,
    jogos:   jogos.length,
    tecnicos: Object.keys(porTecnico).length,
  })
}