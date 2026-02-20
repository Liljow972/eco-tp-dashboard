'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft, Shield, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

const PRIMARY = '#524f3d'
const DARK = '#38362a'
const BG = '#eae6df'
const BORDER = '#d4cfc4'
const MUTED = '#b8b09e'

const RegisterPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
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
      setError('Les mots de passe ne correspondent pas.')
      setLoading(false)
      return
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
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
        setMessage('Un email de confirmation a été envoyé. Vérifiez votre boîte de réception.')
      } else {
        router.push('/')
      }
    } catch {
      setError("Une erreur inattendue s'est produite.")
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "block w-full rounded-xl py-3 pl-10 pr-4 text-sm shadow-sm outline-none transition-all"
  const inputStyle = { backgroundColor: '#fff', border: `1.5px solid ${BORDER}`, color: DARK }

  return (
    <div className="min-h-screen flex w-full" style={{ backgroundColor: BG }}>

      {/* ── PANNEAU GAUCHE — Formulaire ── */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-16 xl:px-20 relative animate-fade-in"
        style={{ backgroundColor: BG }}>

        {/* Retour */}
        <div className="absolute top-8 left-8 animate-fade-in-down">
          <Link href="/"
            className="group flex items-center text-sm font-medium transition-all hover:opacity-70"
            style={{ color: PRIMARY }}>
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Retour à l&#8217;accueil
          </Link>
        </div>

        <div className="mx-auto w-full max-w-sm lg:w-[28rem] animate-fade-in-up">

          {/* Logo + Titre */}
          <div className="text-center mb-8">
            <div className="inline-flex justify-center mb-5">
              <div className="relative w-48 h-16">
                <Image
                  src="/LOGO_ECO_TP_Plan de travail 1.svg"
                  alt="Eco TP"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: DARK }}>
              Créer mon espace client.
            </h1>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: '#6b6450' }}>
              Accédez à votre chantier, vos documents et suivez l&#8217;avancement de vos travaux.
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 border px-4 py-3 rounded-xl text-sm flex items-center gap-2"
              style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#dc2626' }}>
              <span className="flex-shrink-0">❌</span>
              <span>{error}</span>
            </div>
          )}
          {message && (
            <div className="mb-4 border px-4 py-3 rounded-xl text-sm flex items-center gap-2"
              style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', color: '#15803d' }}>
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* Formulaire */}
          <form className="space-y-4" onSubmit={handleRegister} autoComplete="off">

            {/* Prénom + Nom */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-1.5" style={{ color: DARK }}>
                  Prénom
                </label>
                <div className="relative">
                  <input
                    id="firstName" name="firstName" type="text" required
                    value={firstName} onChange={e => setFirstName(e.target.value)}
                    className={inputCls} style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = PRIMARY }}
                    onBlur={e => { e.target.style.borderColor = BORDER }}
                    placeholder="Prénom"
                  />
                  <User className="absolute left-3 top-3 h-4 w-4" style={{ color: MUTED }} />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-1.5" style={{ color: DARK }}>
                  Nom
                </label>
                <div className="relative">
                  <input
                    id="lastName" name="lastName" type="text" required
                    value={lastName} onChange={e => setLastName(e.target.value)}
                    className={inputCls} style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = PRIMARY }}
                    onBlur={e => { e.target.style.borderColor = BORDER }}
                    placeholder="Nom"
                  />
                  <User className="absolute left-3 top-3 h-4 w-4" style={{ color: MUTED }} />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="register-email" className="block text-sm font-medium mb-1.5" style={{ color: DARK }}>
                Adresse e-mail
              </label>
              <div className="relative">
                <input
                  id="register-email" name="register-email" type="email" autoComplete="email" required
                  value={email} onChange={e => setEmail(e.target.value)}
                  className={inputCls} style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = PRIMARY }}
                  onBlur={e => { e.target.style.borderColor = BORDER }}
                  placeholder="exemple@entreprise.com"
                />
                <Mail className="absolute left-3 top-3 h-4 w-4" style={{ color: MUTED }} />
              </div>
            </div>

            {/* Mots de passe */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="register-password" className="block text-sm font-medium mb-1.5" style={{ color: DARK }}>
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="register-password" name="register-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password" required
                    value={password} onChange={e => setPassword(e.target.value)}
                    className="block w-full rounded-xl py-3 pl-10 pr-9 text-sm shadow-sm outline-none transition-all"
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = PRIMARY }}
                    onBlur={e => { e.target.style.borderColor = BORDER }}
                    placeholder="6+ caract."
                  />
                  <Lock className="absolute left-3 top-3 h-4 w-4" style={{ color: MUTED }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 transition-opacity hover:opacity-70"
                    style={{ color: MUTED }}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium mb-1.5" style={{ color: DARK }}>
                  Confirmer
                </label>
                <div className="relative">
                  <input
                    id="confirm-password" name="confirm-password"
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password" required
                    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    className="block w-full rounded-xl py-3 pl-10 pr-9 text-sm shadow-sm outline-none transition-all"
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = PRIMARY }}
                    onBlur={e => { e.target.style.borderColor = BORDER }}
                    placeholder="Répéter"
                  />
                  <Lock className="absolute left-3 top-3 h-4 w-4" style={{ color: MUTED }} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-3 transition-opacity hover:opacity-70"
                    style={{ color: MUTED }}>
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              id="register-submit"
              className="flex w-full justify-center items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ backgroundColor: PRIMARY }}>
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Création en cours...
                </>
              ) : 'Créer mon compte'}
            </button>
          </form>

          {/* Séparateur */}
          <div className="mt-5 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: BORDER }} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3" style={{ backgroundColor: BG, color: '#8c8572' }}>Ou continuer avec</span>
            </div>
          </div>

          {/* Google */}
          <div className="mt-4">
            <button
              type="button"
              onClick={async () => {
                try {
                  const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                      redirectTo: `${window.location.origin}/auth/callback-success`,
                      queryParams: { access_type: 'offline', prompt: 'consent' }
                    }
                  })
                  if (error) setError('Impossible de se connecter avec Google')
                } catch { setError('Une erreur est survenue') }
              }}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm border transition-all hover:opacity-80 disabled:opacity-50"
              style={{ backgroundColor: '#fff', borderColor: BORDER, color: DARK }}>
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continuer avec Google
            </button>
          </div>

          {/* Lien connexion */}
          <p className="mt-6 text-center text-sm" style={{ color: '#6b6450' }}>
            Vous avez déjà un compte ?{' '}
            <Link href="/login" className="font-semibold transition-opacity hover:opacity-70"
              style={{ color: PRIMARY }}>
              Se connecter
            </Link>
          </p>
        </div>
      </div>

      {/* ── PANNEAU DROIT ── */}
      <div className="hidden lg:block relative flex-1" style={{ backgroundColor: DARK }}>
        <div className="absolute inset-0 bg-[url('/DJI_0198-4.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-10">
          <div className="rounded-3xl border p-10 backdrop-blur-xl"
            style={{ backgroundColor: 'rgba(56,54,42,0.6)', borderColor: 'rgba(255,255,255,0.15)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
              style={{ backgroundColor: 'rgba(234,230,223,0.15)' }}>
              <Shield className="w-6 h-6 text-white/70" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">
              Un espace sécurisé pour votre chantier.
            </h3>
            <div className="space-y-3 mb-6">
              {[
                'Suivi en temps réel de l\'avancement',
                'Documents centralisés et accessibles 24h/24',
                'Échange direct avec nos équipes',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'rgba(234,230,223,0.15)' }}>
                    <CheckCircle2 className="w-3.5 h-3.5 text-white/70" />
                  </div>
                  <p className="text-sm" style={{ color: 'rgba(234,230,223,0.8)' }}>{item}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {['J', 'M', 'A'].map((l, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: PRIMARY, borderColor: DARK }}>
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

export default RegisterPage