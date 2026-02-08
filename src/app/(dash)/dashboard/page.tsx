'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '@/lib/auth'
import { Activity } from 'lucide-react'

export default function DashboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    const redirectUser = async () => {
      try {
        const user = await AuthService.getCurrentUser()

        if (!user) {
          router.push('/login')
          return
        }

        if (user.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/client')
        }
      } catch (error) {
        console.error('Erreur redirection:', error)
        router.push('/login')
      }
    }

    redirectUser()
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-ecotp-green-600">
      <Activity className="w-10 h-10 animate-spin mb-4" />
      <p className="font-medium animate-pulse">Redirection vers votre espace...</p>
    </div>
  )
}