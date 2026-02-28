// src/app/api/usuarios/criar/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email, senha, nome, role, telefone, foto_url } = await req.json()

    // Usa service role key — só disponível no servidor
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 1. Cria o auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
    })

    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: authError.message, details: authError }, { status: 400 })
    }

    // 2. Salva o profile
    const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
      id:       authData.user.id,
      nome,
      email,
      role,
      telefone: telefone ?? null,
      foto_url: foto_url ?? null,
      ativo:    true,
    })

    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 })

    return NextResponse.json({ success: true, id: authData.user.id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}