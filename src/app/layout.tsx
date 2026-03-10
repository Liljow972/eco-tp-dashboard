import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '../styles/globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CRM - Dashboard Client',
  description: 'Espace membre CRM pour le suivi de vos projets de terrassement écologique',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            {children}
            <SpeedInsights />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}