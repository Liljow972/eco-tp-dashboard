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
    <div className="min-h-screen flex w-full">
      {/* Left Pane - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-ecotp-beige-50 relative z-10">
        <div className="absolute top-8 left-8">
          <Link href="/" className="group flex items-center text-sm font-medium text-ecotp-gray-500 hover:text-ecotp-green-700 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Retour à l'accueil
          </Link>
        </div>

        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center mb-10">
            <div className="inline-flex justify-center mb-6">
              <div className="relative" style={{ width: '9rem', height: '9rem' }}>
                <Image src="/LOGO_ECO_TP-05.png" alt="Eco TP" fill className="object-contain" />
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-ecotp-green-900">Bon retour parmi nous</h2>
            <p className="mt-2 text-sm text-ecotp-gray-500">
              Heureux de vous revoir ! Connectez-vous pour accéder à vos chantiers.
            </p>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
              )}
              {message && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${message.includes('envoyé')
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                  {message}
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
                    className="flex w-full justify-center rounded-xl bg-ecotp-green-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-ecotp-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ecotp-green-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? 'Connexion en cours...' : 'Se connecter'}
                  </button>
                </div>
              </form>

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
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-ecotp-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent disabled:opacity-50"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500"></span> Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => quickLogin({ email: 'client@ecotp.test', password: 'client123' })}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-ecotp-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent disabled:opacity-50"
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Client
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