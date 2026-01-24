'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft, Leaf } from 'lucide-react'
import Image from 'next/image'

const RegisterPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createSupabaseClient()

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback-success`,
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`.trim(),
          },
        },
      })

      if (error) {
        setError(error.message)
      } else if (data.user && !data.user.email_confirmed_at) {
        setMessage('Un email de confirmation a été envoyé à votre adresse. Veuillez vérifier votre boîte de réception.')
      } else {
        router.push('/')
      }
    } catch {
      setError("Une erreur inattendue s'est produite")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Pane - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-ecotp-beige-50 relative z-10 w-full animate-fade-in">
        <div className="absolute top-8 left-8 animate-fade-in-down">
          <Link href="/" className="group flex items-center text-sm font-medium text-ecotp-gray-500 hover:text-ecotp-green-700 transition-all duration-300">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Retour à l'accueil
          </Link>
        </div>

        <div className="mx-auto w-full max-w-sm lg:w-[32rem] animate-fade-in-up">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-ecotp-green-900">Créer un nouveau compte</h2>
            <p className="mt-2 text-sm text-ecotp-gray-500">
              Commencez à gérer vos chantiers de manière plus simple et plus écologique.
            </p>
          </div>

          <div className="mt-8">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm animate-fade-in-down flex items-center gap-2">
                <span className="flex-shrink-0">❌</span>
                <span>{error}</span>
              </div>
            )}
            {message && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm animate-fade-in-down flex items-center gap-2">
                <span className="flex-shrink-0">✅</span>
                <span>{message}</span>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleRegister}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-ecotp-green-900">Prénom</label>
                  <div className="mt-1 relative">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="block w-full rounded-xl border-0 py-2.5 pl-10 text-ecotp-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ecotp-green-600 sm:text-sm sm:leading-6 bg-white"
                      placeholder="John"
                    />
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-ecotp-gray-400" />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-ecotp-green-900">Nom</label>
                  <div className="mt-1 relative">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="block w-full rounded-xl border-0 py-2.5 pl-10 text-ecotp-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ecotp-green-600 sm:text-sm sm:leading-6 bg-white"
                      placeholder="Doe"
                    />
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-ecotp-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-ecotp-green-900">Adresse email</label>
                <div className="mt-1 relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border-0 py-2.5 pl-10 text-ecotp-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ecotp-green-600 sm:text-sm sm:leading-6 bg-white"
                    placeholder="nom@entreprise.com"
                  />
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-ecotp-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-ecotp-green-900">Mot de passe</label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-xl border-0 py-2.5 pl-10 pr-10 text-ecotp-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ecotp-green-600 sm:text-sm sm:leading-6 bg-white"
                      placeholder="6+ caract."
                    />
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-ecotp-gray-400" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-ecotp-green-900">Confirmer</label>
                  <div className="mt-1 relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full rounded-xl border-0 py-2.5 pl-10 pr-10 text-ecotp-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ecotp-green-600 sm:text-sm sm:leading-6 bg-white"
                      placeholder="Répéter"
                    />
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-ecotp-gray-400" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-xl bg-ecotp-green-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-ecotp-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ecotp-green-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? 'Création...' : 'Créer mon compte'}
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-ecotp-gray-500">
              Vous avez déjà un compte ?{' '}
              <Link href="/login" className="font-semibold text-ecotp-green-600 hover:text-ecotp-green-500">
                Connectez-vous
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Pane - Image & Glass (Simpler version for Register) */}
      <div className="hidden lg:block relative flex-1 bg-ecotp-green-800">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590059390047-6058db5177cc?q=80&w=2800&auto=format&fit=crop')] bg-cover bg-center opacity-70 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-ecotp-green-900/80 to-ecotp-green-800/30"></div>

        <div className="absolute bottom-20 left-20 right-20">
          <h3 className="text-4xl font-bold text-white mb-6">Rejoignez la communauté Eco TP</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="glass-card bg-white/10 border-white/10 p-4 rounded-2xl text-white">
              <div className="font-bold text-lg mb-1">Collaboratif</div>
              <p className="text-sm text-ecotp-green-100 opacity-80">Invitez tout vos partenaires sur vos chantiers.</p>
            </div>
            <div className="glass-card bg-white/10 border-white/10 p-4 rounded-2xl text-white">
              <div className="font-bold text-lg mb-1">Sécurisé</div>
              <p className="text-sm text-ecotp-green-100 opacity-80">Vos documents et données sont cryptés.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage