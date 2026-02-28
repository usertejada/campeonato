'use client'

// components/OneSignalInit.tsx
// Coloca esse componente em: components/OneSignalInit.tsx

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export default function OneSignalInit() {
  useEffect(() => {
    // Garante que só roda no browser
    if (typeof window === 'undefined') return

    const script = document.createElement('script')
    script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js'
    script.defer = true
    script.onload = async () => {
      window.OneSignalDeferred = window.OneSignalDeferred || []
      window.OneSignalDeferred.push(async (OneSignal: any) => {
        await OneSignal.init({
          appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
          notifyButton: { enable: false },
          allowLocalhostAsSecureOrigin: true,
        })

        try {
          const supabase = createClient()
          const { data: { session } } = await supabase.auth.getSession()

          if (session?.user?.id) {
            // Vincula o external_id do OneSignal ao ID do usuário Supabase
            await OneSignal.login(session.user.id)
            console.log('[OneSignal] Login OK — external_id:', session.user.id)
          } else {
            console.warn('[OneSignal] Nenhuma sessão ativa')
          }
        } catch (e) {
          console.error('[OneSignal] Erro no login:', e)
        }
      })
    }
    document.head.appendChild(script)
  }, [])

  return null
}