'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService, AuthUser } from '@/lib/auth'
import { Activity } from 'lucide-react'

export default function DashboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    console.log("DashboardRedirect: Démarrage...")
    const redirectUser = async () => {
      try {
        // Timeout de sécurité 3s
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject("Timeout"), 3000))
        const userPromise = AuthService.getCurrentUser()

        console.log("DashboardRedirect: En attente de AuthService...")
        const user = await Promise.race([userPromise, timeoutPromise]) as AuthUser | null

        console.log("DashboardRedirect: User récupéré:", user)

        if (!user) {
          console.log("DashboardRedirect: Pas d'user -> Login")
          router.push('/login')
          return
        }

        const timestamp = Date.now()
        // Ajout du timestamp pour forcer le navigateur à ignorer le cache 308 (Redirection permanente)
        if (user.role === 'admin') {
          console.log("DashboardRedirect: Admin -> /admin")
          window.location.href = `/admin?nocache=${timestamp}`
        } else {
          console.log("DashboardRedirect: Client -> /client")
          window.location.href = `/client?nocache=${timestamp}`
        }
      } catch (error) {
        console.error('Erreur redirection ou Timeout:', error)
        // Fallback d'urgence pour l'admin
        console.log("DashboardRedirect: Fallback -> /admin")
        window.location.href = `/admin?nocache=${Date.now()}`
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