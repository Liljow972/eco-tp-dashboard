'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import ClientDashboard from '@/components/ClientDashboard'

export default function ClientDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Lecture depuis localStorage (non-bloquant)
        const stored = localStorage.getItem('auth_user')
        if (stored) {
          setUser(JSON.parse(stored))
          setLoading(false)
          return
        }

        // Fallback session (avec timeout)
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const meta = session.user.user_metadata
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: meta?.name || meta?.full_name || session.user.email,
            role: meta?.role || 'client'
          })
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center p-16">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-ecotp-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Chargement de votre espace client...</p>
      </div>
    </div>
  )

  return (
    <div className="animate-fade-in p-6">
      {user ? (
        <ClientDashboard />
      ) : (
        <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg">
          Veuillez vous connecter pour accéder à vos projets.
        </div>
      )}
    </div>
  )
}