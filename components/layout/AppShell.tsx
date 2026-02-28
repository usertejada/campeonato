'use client'

// components/layout/AppShell.tsx
import { Sidebar } from '@/components/layout/Sidebar'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { MobileHeader } from '@/components/layout/MobileHeader'
import { MobileNavBar } from '@/components/layout/MobileNavBar'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface AppShellProps {
  children: React.ReactNode
  onAdd?: () => void
}

export function AppShell({ children, onAdd }: AppShellProps) {
  const [user, setUser]       = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router                = useRouter()
  const supabase              = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      setUser(profile)
      setLoading(false)
    }
    getUser()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex bg-gray-50" style={{ minHeight: '100dvh' }}>

      {/* ✅ Sidebar — APENAS desktop (hidden no mobile garantido aqui e no próprio componente) */}
      <div className="hidden lg:block">
        <Sidebar user={user} />
      </div>

      {/* ✅ Mobile: header fixo no topo */}
      <MobileHeader onAdd={onAdd} />

      {/* ✅ Mobile: nav scroll horizontal fixo na parte inferior */}
      <MobileNavBar />

      {/* Conteúdo principal */}
      <main className="flex-1 overflow-y-auto w-full">
        <div
          className="p-4 lg:p-8"
          style={{
            // Mobile: espaço pro header (56px) no topo + nav bar (~60px) no bottom
            paddingTop: 'calc(56px + 1rem)',
            paddingBottom: 'calc(60px + env(safe-area-inset-bottom) + 1rem)',
          }}
        >
          {/* Breadcrumb só no desktop */}
          <div className="hidden lg:block" style={{ paddingTop: 0 }}>
            <Breadcrumb />
          </div>

          {children}
        </div>
      </main>
    </div>
  )
}