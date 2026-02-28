import type { Metadata } from 'next'
import '@/app/globals.css'
import OneSignalInit from '@/components/OneSignalInit'

export const metadata: Metadata = {
  title: 'ChampionSystem',
  description: 'Gestão de Campeonatos',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <OneSignalInit />
        {children}
      </body>
    </html>
  )
}