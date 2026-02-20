// app/layout.tsx

import type { Metadata } from 'next'
import './globals.css'  // ← adiciona essa linha

export const metadata: Metadata = {
  title: 'ChampionSystem',
  description: 'Gestão de Campeonatos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}