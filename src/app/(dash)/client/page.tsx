'use client'

import { useEffect, useState } from 'react'
import { AuthService } from '@/lib/auth'
import ClientDashboard from '@/components/ClientDashboard'

export default function ClientDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const u = await AuthService.getCurrentUser()
        setUser(u)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  if (loading) return <div className="p-8 text-center text-gray-500">Chargement espace client...</div>

  return (
    <div className="animate-fade-in p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Tableau de bord Client</h1>
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