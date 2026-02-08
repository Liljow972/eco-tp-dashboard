'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const AuthCallbackPage = () => {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Erreur lors de la récupération de la session:', error)
          router.push('/?error=auth_callback_error')
          return
        }

        if (data.session?.user) {
          const user = data.session.user

          // Attendre que le trigger crée le profil (retry avec délai)
          let profile = null
          let retries = 0
          const maxRetries = 5

          while (!profile && retries < maxRetries) {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single()

            if (profileData) {
              profile = profileData
              break
            }

            if (profileError && profileError.code !== 'PGRST116') {
              console.error('Erreur récupération profil:', profileError)
              break
            }

            // Attendre 500ms avant de réessayer
            await new Promise(resolve => setTimeout(resolve, 500))
            retries++
          }

          // Si le profil n'existe toujours pas après les retries, le créer manuellement
          if (!profile) {
            console.log('Création manuelle du profil...')
            const { data: newProfile, error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                email: user.email || '',
                name: user.user_metadata?.full_name || user.user_metadata?.name || 'Utilisateur Google',
                role: 'client'
              })
              .select()
              .single()

            if (insertError) {
              console.error('Erreur création profil:', insertError)
            } else {
              profile = newProfile
            }
          }

          // Stocker les informations utilisateur
          const authUser = {
            id: user.id,
            email: user.email || '',
            name: profile?.name || user.user_metadata?.full_name || user.user_metadata?.name || 'Utilisateur Google',
            role: profile?.role || 'client'
          }

          localStorage.setItem('auth_user', JSON.stringify(authUser))

          console.log('Utilisateur connecté:', authUser)

          // Rediriger selon le rôle
          if (profile?.role === 'admin') {
            router.push('/admin')
          } else {
            router.push('/client')
          }
        } else {
          // Pas de session, rediriger vers la page d'accueil
          console.log('Pas de session trouvée')
          router.push('/')
        }
      } catch (err) {
        console.error('Erreur inattendue:', err)
        router.push('/?error=unexpected_error')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <h2 className="mt-4 text-lg font-medium text-gray-900">
              Finalisation de la connexion...
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Veuillez patienter pendant que nous vous connectons.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthCallbackPage