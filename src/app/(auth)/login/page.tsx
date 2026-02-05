"use client"

import { useState, useEffect, FormEvent } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { AuthService } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Leaf } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

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
    } catch { }
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
        } catch { }
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
    setMessage('')
    
    try {
      const { user, error } = await AuthService.signInWithEmail(creds.email, creds.password)
      if (error || !user) {
        setError(error || 'Identifiants de démo invalides')
      } else {
        // Redirection immédiate sans message
        router.push('/dashboard')
      }
    } catch (err) {
      console.error('Error in quickLogin:', err)
      setError('Une erreur est survenue lors de la connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Pane - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-ecotp-beige-50 relative z-10 animate-fade-in">
        <div className="absolute top-8 left-8 animate-fade-in-down">
          <Link href="/" className="group flex items-center text-sm font-medium text-ecotp-gray-500 hover:text-ecotp-green-700 transition-all duration-300">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Retour à l'accueil
          </Link>
        </div>

        <div className="mx-auto w-full max-w-sm lg:w-96 animate-fade-in-up">
          <div className="text-center mb-10">
<<<<<<< HEAD
            <div className="inline-flex justify-center mb-6">
              <div className="relative" style={{ width: '9rem', height: '9rem' }}>
                <Image src="/LOGO_ECO_TP-05.png" alt="Eco TP" fill className="object-contain" />
=======
            <div className="inline-flex justify-center mb-6 animate-scale-in">
              <div className="relative w-16 h-16 hover-lift">
                <Image src="/LOGO_ECO_TP-05.png" alt="Eco TP" fill className="object-contain rounded-xl" />
>>>>>>> 9bbbd1f2b40b205269e04a931c80701333bc89d0
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-ecotp-green-900 animate-fade-in-up">Bon retour parmi nous</h2>
            <p className="mt-2 text-sm text-ecotp-gray-500 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              Heureux de vous revoir ! Connectez-vous pour accéder à vos chantiers.
            </p>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm animate-fade-in-down flex items-center gap-2">
                  <span className="flex-shrink-0">❌</span>
                  <span>{error}</span>
                </div>
              )}
              {message && (
<<<<<<< HEAD
                <div className={`mb-4 p-3 rounded-lg text-sm ${message.includes('envoyé')
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
=======
                <div className={`mb-4 p-3 rounded-lg text-sm animate-fade-in-down flex items-center gap-2 ${message.includes('envoyé')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
>>>>>>> 9bbbd1f2b40b205269e04a931c80701333bc89d0
                  }`}>
                  <span className="flex-shrink-0">{message.includes('envoyé') ? '✅' : '❌'}</span>
                  <span>{message}</span>
                </div>
              )}

              <form onSubmit={handleEmailLogin} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-ecotp-green-900">Email</label>
                  <div className="mt-2 relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-xl border-0 py-3 pl-10 text-ecotp-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ecotp-green-600 sm:text-sm sm:leading-6 bg-white"
                      placeholder="nom@entreprise.com"
                    />
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-ecotp-gray-400" />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-ecotp-green-900">Mot de passe</label>
                  <div className="mt-2 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-xl border-0 py-3 pl-10 pr-10 text-ecotp-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ecotp-green-600 sm:text-sm sm:leading-6 bg-white"
                      placeholder="••••••••"
                    />
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-ecotp-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-ecotp-green-600 focus:ring-ecotp-green-600"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-ecotp-gray-900">
                      Se souvenir de moi
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-ecotp-green-600 hover:text-ecotp-green-500">
                      Mot de passe oublié ?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    data-testid="login-submit-button"
                    className="flex w-full justify-center items-center gap-2 rounded-xl bg-ecotp-green-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-ecotp-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ecotp-green-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Connexion en cours...</span>
                      </>
                    ) : (
                      'Se connecter'
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-ecotp-beige-50 px-2 text-ecotp-gray-500">Ou continuer avec</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const { error } = await supabase.auth.signInWithOAuth({
                          provider: 'google',
                          options: {
                            redirectTo: `${window.location.origin}/auth/callback-success`,
                            queryParams: {
                              access_type: 'offline',
                              prompt: 'consent',
                            }
                          }
                        })
                        if (error) {
                          console.error('Erreur Google OAuth:', error)
                          setError('Impossible de se connecter avec Google')
                        }
                      } catch (err) {
                        console.error('Erreur:', err)
                        setError('Une erreur est survenue')
                      }
                    }}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-3 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-all duration-300 hover:shadow hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continuer avec Google
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-ecotp-beige-50 px-2 text-ecotp-gray-500">Comptes de démonstration</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => quickLogin({ email: 'admin@ecotp.test', password: 'admin123' })}
                    disabled={loading}
                    data-testid="quick-login-admin"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-ecotp-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:shadow transition-all duration-300 hover:-translate-y-0.5 focus-visible:ring-transparent disabled:opacity-50 active:translate-y-0"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => quickLogin({ email: 'client@ecotp.test', password: 'client123' })}
                    disabled={loading}
                    data-testid="quick-login-client"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-ecotp-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:shadow transition-all duration-300 hover:-translate-y-0.5 focus-visible:ring-transparent disabled:opacity-50 active:translate-y-0"
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Client
                  </button>
                </div>
              </div>

              <p className="mt-8 text-center text-sm text-ecotp-gray-500">
                Pas encore de compte ?{' '}
                <Link href="/register" className="font-semibold text-ecotp-green-600 hover:text-ecotp-green-500">
                  S'inscrire gratuitement
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane - Image & Glass */}
      <div className="hidden lg:block relative flex-1 bg-ecotp-green-900">
        <div className="absolute inset-0 bg-[url('/DJI_0198-4.jpg')] bg-cover bg-center opacity-60 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-ecotp-green-900/90 to-ecotp-green-900/40"></div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg px-8">
          <div className="glass-card p-10 rounded-3xl border border-white/20 text-white backdrop-blur-xl bg-white/10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <Leaf className="text-white w-8 h-8" />
            </div>
            <h3 className="text-3xl font-bold mb-4">Construction Durable</h3>
            <p className="text-lg text-ecotp-green-100 leading-relaxed">
              "Notre plateforme vous permet de suivre l'impact écologique de chaque étape de vote chantier, en temps réel."
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-ecotp-green-800 bg-ecotp-green-200"></div>
                ))}
              </div>
              <div className="text-sm font-medium text-ecotp-green-100">
                Rejoint par +2000 partenaires
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage