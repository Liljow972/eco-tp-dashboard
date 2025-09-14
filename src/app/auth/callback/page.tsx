'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'

const AuthCallbackPage = () => {
  const router = useRouter()
  const supabase = createSupabaseClient()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Erreur lors de la récupération de la session:', error)
          router.push('/login?error=auth_callback_error')
          return
        }

        if (data.session) {
          // L'utilisateur est connecté, rediriger vers la page d'accueil
          router.push('/')
        } else {
          // Pas de session, rediriger vers la page de connexion
          router.push('/login')
        }
      } catch (err) {
        console.error('Erreur inattendue:', err)
        router.push('/login?error=unexpected_error')
      }
    }

    handleAuthCallback()
  }, [router, supabase.auth])

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