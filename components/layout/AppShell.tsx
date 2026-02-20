'use client'

// components/layout/AppShell.tsx
// Toda a lógica de auth, sidebar e breadcrumb fica aqui

import { Sidebar } from '@/components/layout/Sidebar'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [user, setUser]       = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router                = useRouter()
  const supabase              = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')
        return
      }

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
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Breadcrumb />
          {children}
        </div>
      </main>
    </div>
  )
}