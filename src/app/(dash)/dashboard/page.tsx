'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService, AuthUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { Activity } from 'lucide-react'

export default function DashboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    console.log("DashboardRedirect: Démarrage...")
    const redirectUser = async () => {
      try {
        console.log("DashboardRedirect: En attente de AuthService...")

        // Timeout de sécurité augmenté à 10s
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject("Timeout"), 10000)
        )
        const userPromise = AuthService.getCurrentUser()

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

        // Essayer de récupérer la session directement
        try {
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user) {
            console.log("DashboardRedirect: Session trouvée, redirection vers /client")
            window.location.href = `/client?nocache=${Date.now()}`
            return
          }
        } catch (sessionError) {
          console.error('Erreur récupération session:', sessionError)
        }

        // Dernier recours: retour au login
        console.log("DashboardRedirect: Erreur critique -> Login")
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