'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService, AuthUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { Activity } from 'lucide-react'

export default function DashboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    const redirectUser = async () => {
      try {
        // Fast local memory skip
        const stored = localStorage.getItem('auth_user')
        if (stored) {
          const u = JSON.parse(stored)
          if (u.role === 'admin') {
            router.push('/admin')
            return
          } else if (u.role === 'client') {
            router.push('/client')
            return
          }
        }

        // Fallback: Check active session
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const role = session.user.user_metadata?.role || session.user.app_metadata?.role
          if (role === 'admin') {
            router.push('/admin')
            return
          } else if (role === 'client') {
            router.push('/client')
            return
          }

          // Deep fallback
          const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
          router.push(profile?.role === 'admin' ? '/admin' : '/client')
          return
        }

        router.push('/login')
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
      <p className="font-medium animate-pulse">Chargement de votre espace...</p>
      <p className="text-xs text-gray-400 mt-2">Si cela prend trop de temps, forcez le rechargement (Cmd+Shift+R).</p>
    </div>
  )
}