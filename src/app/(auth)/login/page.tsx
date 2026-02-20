"use client"

import { useState, useEffect, FormEvent } from 'react'
import { supabase } from '@/lib/supabase'
import { Mail, Lock, Eye, EyeOff, ArrowLeft, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const PRIMARY = '#524f3d'
const DARK = '#38362a'
const BG = '#eae6df'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  useEffect(() => {
    try {
      const remembered = localStorage.getItem('rememberMe') === 'true'
      const savedEmail = localStorage.getItem('rememberEmail') || ''
      setRememberMe(remembered)
      if (savedEmail) setEmail(savedEmail)
    } catch { }
  }, [])

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Veuillez saisir votre email et mot de passe.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      })
      if (authError) {
        if (authError.message === 'Invalid login credentials') {
          setError('Email ou mot de passe incorrect.')
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Veuillez confirmer votre email avant de vous connecter.')
        } else {
          setError(authError.message)
        }
        setLoading(false)
        return
      }
      if (!data.user) {
        setError('Erreur de connexion. Réessayez.')
        setLoading(false)
        return
      }
      try {
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true')
          localStorage.setItem('rememberEmail', email.trim())
        } else {
          localStorage.removeItem('rememberMe')
          localStorage.removeItem('rememberEmail')
        }
      } catch { }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, name, company')
        .eq('id', data.user.id)
        .single()

      const role = profile?.role || 'client'
      localStorage.setItem('auth_user', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        name: profile?.name || data.user.user_metadata?.full_name || data.user.email,
        role,
        company: profile?.company || ''
      }))
      window.location.href = role === 'admin' ? '/admin' : '/client'
    } catch (err) {
      console.error('Erreur login:', err)
      setError("Une erreur est survenue. Vérifiez votre connexion internet.")
      setLoading(false)
    }
  }

  const fillDemo = (type: 'admin' | 'client') => {
    if (type === 'admin') {
      setEmail('admin@ecotravaux.fr')
      setPassword('Demo2024!')
    } else {
      setEmail('client@demo.fr')
      setPassword('Demo2024!')
    }
  }

  return (
    <div className="min-h-screen flex w-full" style={{ backgroundColor: BG }}>

      {/* ── PANNEAU GAUCHE — Formulaire ── */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 relative animate-fade-in"
        style={{ backgroundColor: BG }}>

        {/* Retour */}
        <div className="absolute top-8 left-8 animate-fade-in-down">
          <Link href="/"
            className="group flex items-center text-sm font-medium transition-all duration-300 hover:opacity-70"
            style={{ color: PRIMARY }}>
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Retour à l&#8217;accueil
          </Link>
        </div>

        <div className="mx-auto w-full max-w-sm lg:w-96 animate-fade-in-up">

          {/* Logo + Titre */}
          <div className="text-center mb-10">
            <div className="inline-flex justify-center mb-6">
              <div className="relative w-14 h-14">
                <Image src="/LOGO_ECO_TP-05.png" alt="Eco TP" fill className="object-contain" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: DARK }}>
              Bon retour parmi nous.
            </h1>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6b6450' }}>
              Accédez à vos chantiers, vos documents et au suivi en temps réel en toute sécurité.
            </p>
          </div>

          {/* Erreur */}
          {error && (
            <div className="mb-4 border px-4 py-3 rounded-xl text-sm flex items-center gap-2"
              style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#dc2626' }}>
              <span className="flex-shrink-0">❌</span>
              <span>{error}</span>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleLogin} className="space-y-5" autoComplete="off">

            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium mb-2"
                style={{ color: DARK }}>
                Adresse e-mail
              </label>
              <div className="relative">
                <input
                  id="login-email"
                  name="login-email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl py-3 pl-10 pr-4 text-sm shadow-sm outline-none transition-all"
                  style={{
                    backgroundColor: '#fff',
                    border: '1.5px solid #d4cfc4',
                    color: DARK,
                  }}
                  onFocus={e => { e.target.style.borderColor = PRIMARY }}
                  onBlur={e => { e.target.style.borderColor = '#d4cfc4' }}
                  placeholder="exemple@entreprise.com"
                />
                <Mail className="absolute left-3 top-3 h-5 w-5" style={{ color: '#b8b09e' }} />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium mb-2"
                style={{ color: DARK }}>
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  name="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl py-3 pl-10 pr-10 text-sm shadow-sm outline-none transition-all"
                  style={{
                    backgroundColor: '#fff',
                    border: '1.5px solid #d4cfc4',
                    color: DARK,
                  }}
                  onFocus={e => { e.target.style.borderColor = PRIMARY }}
                  onBlur={e => { e.target.style.borderColor = '#d4cfc4' }}
                  placeholder="••••••••••"
                />
                <Lock className="absolute left-3 top-3 h-5 w-5" style={{ color: '#b8b09e' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 transition-opacity hover:opacity-70"
                  style={{ color: '#b8b09e' }}>
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Se souvenir / Mot de passe oublié */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                  style={{ accentColor: PRIMARY }}
                />
                <span className="text-sm" style={{ color: '#6b6450' }}>Se souvenir de moi</span>
              </label>
              <a href="#" className="text-sm font-medium transition-opacity hover:opacity-70"
                style={{ color: PRIMARY }}>
                Mot de passe oublié ?
              </a>
            </div>

            {/* Bouton Se connecter */}
            <button
              type="submit"
              disabled={loading}
              id="login-submit"
              className="flex w-full justify-center items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ backgroundColor: PRIMARY }}>
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Connexion en cours...
                </>
              ) : 'Se connecter'}
            </button>
          </form>

          {/* Séparateur */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: '#d4cfc4' }} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 text-sm" style={{ backgroundColor: BG, color: '#8c8572' }}>
                Ou continuer avec
              </span>
            </div>
          </div>

          {/* Bouton Google */}
          <div className="mt-4">
            <button
              type="button"
              onClick={async () => {
                try {
                  const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                      redirectTo: `${window.location.origin}/auth/callback`,
                      queryParams: { access_type: 'offline', prompt: 'consent' }
                    }
                  })
                  if (error) setError('Impossible de se connecter avec Google')
                } catch {
                  setError('Une erreur est survenue')
                }
              }}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm border transition-all hover:opacity-80 disabled:opacity-50"
              style={{ backgroundColor: '#fff', borderColor: '#d4cfc4', color: DARK }}>
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continuer avec Google
            </button>
          </div>

          {/* Section Démo */}
          <div className="mt-6 rounded-2xl border-2 p-4" style={{ borderColor: '#d4cfc4', backgroundColor: 'rgba(255,255,255,0.5)' }}>
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4" style={{ color: PRIMARY }} />
              <p className="text-sm font-semibold" style={{ color: DARK }}>Comptes de démonstration</p>
            </div>
            <p className="text-xs mb-3" style={{ color: '#8c8572' }}>
              Découvrir la plateforme en mode test :
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="text-left text-xs px-3 py-2.5 rounded-xl border transition-all hover:opacity-80"
                style={{ backgroundColor: '#fff', borderColor: '#d4cfc4', color: PRIMARY }}>
                <span className="font-semibold">👤 Accès Administrateur</span>
                <span className="text-gray-400 ml-1">(Démo)</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('client')}
                className="text-left text-xs px-3 py-2.5 rounded-xl border transition-all hover:opacity-80"
                style={{ backgroundColor: '#fff', borderColor: '#d4cfc4', color: PRIMARY }}>
                <span className="font-semibold">🏠 Accès Client</span>
                <span className="text-gray-400 ml-1">(Démo)</span>
              </button>
            </div>
          </div>

          {/* Créer un compte */}
          <p className="mt-6 text-center text-sm" style={{ color: '#6b6450' }}>
            Pas encore d&#8217;espace ?{' '}
            <Link href="/register"
              className="font-semibold transition-opacity hover:opacity-70"
              style={{ color: PRIMARY }}>
              Créer mon compte gratuitement
            </Link>
          </p>

          {/* Reset urgence */}
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={async () => {
                await supabase.auth.signOut()
                localStorage.clear()
                window.location.reload()
              }}
              className="text-xs underline transition-opacity hover:opacity-70"
              style={{ color: '#b8b09e' }}>
              Problème de connexion ? Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* ── PANNEAU DROIT — Photo chantier ── */}
      <div className="hidden lg:block relative flex-1" style={{ backgroundColor: DARK }}>
        <div className="absolute inset-0 bg-[url('/DJI_0198-4.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-10">
          <div className="rounded-3xl border p-10 backdrop-blur-xl"
            style={{ backgroundColor: 'rgba(56,54,42,0.6)', borderColor: 'rgba(255,255,255,0.15)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
              style={{ backgroundColor: 'rgba(234,230,223,0.15)' }}>
              <Image src="/LOGO_ECO_TP-05.png" alt="Eco TP" width={32} height={32} className="object-contain" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">
              Votre chantier, toujours à portée de main.
            </h3>
            <p className="text-base leading-relaxed" style={{ color: 'rgba(234,230,223,0.8)' }}>
              Suivez chaque étape de vos travaux, accédez à vos documents et échangez avec nos équipes — tout en un seul endroit.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {['J', 'M', 'A'].map((l, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: '#524f3d', borderColor: DARK }}>
                    {l}
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium" style={{ color: 'rgba(234,230,223,0.7)' }}>
                +150 clients actifs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage