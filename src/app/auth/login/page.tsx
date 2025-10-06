"use client"

import { useState, useEffect, FormEvent } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { AuthService } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import AuthHeader from '@/components/auth/AuthHeader'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const supabase = createSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    try {
      const remembered = localStorage.getItem('rememberMe') === 'true'
      const savedEmail = localStorage.getItem('rememberEmail') || ''
      setRememberMe(remembered)
      if (savedEmail) setEmail(savedEmail)
    } catch {}
  }, [])

  const goToCallback = () => router.push('/auth/callback-success')

  const handleEmailLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        try {
          if (rememberMe) {
            localStorage.setItem('rememberMe', 'true')
            localStorage.setItem('rememberEmail', email)
          } else {
            localStorage.removeItem('rememberMe')
            localStorage.removeItem('rememberEmail')
          }
        } catch {}
        goToCallback()
      }
    } catch {
      setError("Une erreur inattendue s'est produite")
    } finally {
      setLoading(false)
    }
  }

  const quickLogin = async (creds: { email: string; password: string }) => {
    setEmail(creds.email)
    setPassword(creds.password)
    setLoading(true)
    setError('')
    try {
      const { user, error } = await AuthService.signInWithEmail(creds.email, creds.password)
      if (error || !user) {
        setError(error || 'Identifiants de démo invalides')
      } else {
        router.push('/dashboard')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AuthHeader />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Connexion au CRM</h2>
            <p className="mt-2 text-center text-sm text-gray-600">Accédez à votre espace membre</p>
          </div>
          <div className="mt-8 space-y-6">
            <div className="bg-white py-8 px-6 shadow rounded-lg">
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">{error}</div>
              )}
              <form className="space-y-4" onSubmit={handleEmailLogin}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Adresse email</label>
                  <div className="mt-1 relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                  <div className="mt-1 relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Se souvenir de moi</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </button>
              </form>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => quickLogin({ email: 'admin@ecotp.test', password: 'admin123' })}
                  disabled={loading}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Admin démo
                </button>
                <button
                  type="button"
                  onClick={() => quickLogin({ email: 'client@ecotp.test', password: 'client123' })}
                  disabled={loading}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Client démo
                </button>
              </div>

              {message && (
                <div
                  className={`mt-4 p-3 rounded-md text-sm ${
                    message.includes('envoyé')
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage