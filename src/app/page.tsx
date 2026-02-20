"use client"
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, BarChart3, Users, FileText, CheckCircle2, Clock, Shield } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#eae6df' }}>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-4 py-4 md:px-6">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between rounded-2xl shadow-sm border border-white/60 backdrop-blur-md"
          style={{ backgroundColor: 'rgba(234,230,223,0.92)' }}>
          <div className="flex items-center">
            <div className="relative overflow-hidden" style={{ width: '7rem', height: '7rem' }}>
              <Image
                src="/LOGO_ECO_TP-05.png"
                alt="Eco TP Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="font-medium transition-colors hover:opacity-70"
              style={{ color: '#524f3d' }}>Fonctionnalités</Link>
            <Link href="#contact" className="font-medium transition-colors hover:opacity-70"
              style={{ color: '#524f3d' }}>Contact</Link>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/login"
              className="hidden sm:block font-medium px-4 py-2 transition-colors hover:opacity-80"
              style={{ color: '#38362a' }}>
              Connexion
            </Link>
            <Link href="/register"
              className="py-2.5 px-5 text-sm font-semibold rounded-xl text-white shadow transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ backgroundColor: '#524f3d' }}>
              Créer mon espace
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <main className="pt-48 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Colonne texte */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium border"
              style={{ backgroundColor: 'rgba(82,79,61,0.08)', borderColor: 'rgba(82,79,61,0.2)', color: '#524f3d' }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: '#524f3d' }} />
                <span className="relative inline-flex rounded-full h-2 w-2"
                  style={{ backgroundColor: '#524f3d' }} />
              </span>
              <span>Espace client sécurisé</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight"
              style={{ color: '#38362a' }}>
              Suivez votre chantier{' '}
              <span className="relative">
                en temps réel.
              </span>
            </h1>

            <p className="text-xl font-medium" style={{ color: '#524f3d' }}>
              Accédez à tous vos documents au même endroit.
            </p>

            <p className="text-base leading-relaxed max-w-xl" style={{ color: '#6b6450' }}>
              Un espace client sécurisé pour consulter l&apos;avancement des travaux,
              télécharger vos documents et échanger avec nos équipes en toute simplicité.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/register"
                className="flex items-center gap-2 group px-6 py-3 rounded-xl text-white font-semibold shadow-md transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg"
                style={{ backgroundColor: '#524f3d' }}>
                Créer mon espace
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Colonne visuelle */}
          <div className="relative h-[460px] hidden lg:block animate-fade-in">
            <div className="absolute inset-0 rounded-3xl opacity-30 blur-3xl"
              style={{ backgroundColor: '#524f3d' }} />

            {/* Carte principale */}
            <div className="absolute top-8 right-8 left-8 bottom-8 rounded-3xl border shadow-xl backdrop-blur-sm p-6"
              style={{ backgroundColor: 'rgba(255,255,255,0.75)', borderColor: 'rgba(255,255,255,0.9)' }}>
              <div className="h-full flex flex-col gap-4">
                {/* Header fake UI */}
                <div className="flex items-center gap-3 pb-3 border-b" style={{ borderColor: '#eae6df' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: '#524f3d' }}>J</div>
                  <div>
                    <div className="h-2.5 w-24 rounded-full" style={{ backgroundColor: '#d4cfc4' }} />
                    <div className="h-2 w-16 rounded-full mt-1" style={{ backgroundColor: '#eae6df' }} />
                  </div>
                </div>
                {/* Barres progression */}
                <div className="space-y-3 flex-1">
                  {[
                    { label: 'Terrassement', pct: 100, done: true },
                    { label: 'Fondations', pct: 75, done: false },
                    { label: 'Gros œuvre', pct: 40, done: false },
                    { label: 'Finitions', pct: 0, done: false },
                  ].map((step) => (
                    <div key={step.label}>
                      <div className="flex justify-between text-xs mb-1" style={{ color: '#6b6450' }}>
                        <span className="font-medium">{step.label}</span>
                        <span>{step.pct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#eae6df' }}>
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{ width: `${step.pct}%`, backgroundColor: step.done ? '#524f3d' : '#b8b09e' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating pill — Documents */}
            <div className="absolute -left-4 top-24 animate-float bg-white rounded-xl shadow-lg border px-4 py-3 flex items-center gap-3"
              style={{ borderColor: '#eae6df', animationDelay: '1s' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#eae6df' }}>
                <FileText className="w-4 h-4" style={{ color: '#524f3d' }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: '#8c8572' }}>Documents</p>
                <p className="text-sm font-bold" style={{ color: '#38362a' }}>12 fichiers</p>
              </div>
            </div>

            {/* Floating pill — Statut */}
            <div className="absolute -bottom-4 right-12 animate-float bg-white rounded-xl shadow-lg border px-4 py-3 flex items-center gap-3"
              style={{ borderColor: '#eae6df', animationDelay: '2s' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(82,79,61,0.1)' }}>
                <CheckCircle2 className="w-4 h-4" style={{ color: '#524f3d' }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: '#8c8572' }}>Statut</p>
                <p className="text-sm font-bold" style={{ color: '#38362a' }}>En cours</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── BLOC 2 — TEXTE + 3 CARTES ── */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: '#fff' }}>
        <div className="max-w-7xl mx-auto">

          {/* Intro texte */}
          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-snug"
              style={{ color: '#38362a' }}>
              Un espace simple pour suivre votre chantier en toute sérénité.
            </h2>
            <p className="text-base leading-relaxed" style={{ color: '#6b6450' }}>
              Nous avons conçu un portail sécurisé qui vous permet de rester informé à chaque étape
              de votre projet, sans intermédiaire et sans perte de temps. Depuis votre espace
              personnel, vous visualisez l&apos;avancement des travaux, consultez vos plans, devis et
              factures, suivez les étapes clés en temps réel et échangez directement avec nos
              équipes lorsque nécessaire.
            </p>
            <p className="mt-4 text-base leading-relaxed" style={{ color: '#6b6450' }}>
              Toutes les informations essentielles sont centralisées au même endroit, accessibles
              24h/24, dans un environnement clair et sécurisé.
            </p>
          </div>

          {/* 3 Cartes */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                title: 'Suivi en temps réel',
                desc: 'Consultez l\'avancement de votre chantier grâce à un tableau de bord clair et visuel.',
              },
              {
                icon: FileText,
                title: 'Documents sécurisés',
                desc: 'Tous vos devis, plans, contrats et comptes-rendus disponibles en téléchargement à tout moment.',
              },
              {
                icon: Users,
                title: 'Espace client dédié',
                desc: 'Un accès personnel et sécurisé pour suivre votre projet en toute confidentialité.',
              },
            ].map((f, i) => (
              <div key={i}
                className="group p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                style={{
                  borderColor: '#eae6df',
                  backgroundColor: '#fafaf8',
                }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all group-hover:scale-110"
                  style={{ backgroundColor: 'rgba(82,79,61,0.1)' }}>
                  <f.icon className="w-6 h-6" style={{ color: '#524f3d' }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: '#38362a' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6b6450' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAS DE PAGE ── */}
      <section className="py-24 px-4" style={{ backgroundColor: '#eae6df' }}>
        <div className="max-w-4xl mx-auto rounded-3xl px-8 py-16 text-center border"
          style={{ backgroundColor: '#38362a', borderColor: '#524f3d' }}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-white/60" />
            <span className="text-sm font-medium text-white/60">Accès sécurisé · Données chiffrées</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Pas encore d&apos;espace ?
          </h2>
          <p className="text-white/70 mb-8 max-w-lg mx-auto">
            Créez votre accès en quelques secondes et retrouvez vos chantiers depuis n&apos;importe où.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-lg"
              style={{ backgroundColor: '#eae6df', color: '#38362a' }}>
              Créer mon compte gratuitement
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-sm border-2 text-white transition-all hover:bg-white/10"
              style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
              J&apos;ai déjà un accès
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t py-10 px-6" style={{ backgroundColor: '#fff', borderColor: '#eae6df' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <Image src="/LOGO_ECO_TP-05.png" alt="Eco TP" fill className="object-contain" />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: '#38362a' }}>Eco TP</p>
              <p className="text-xs" style={{ color: '#8c8572' }}>© 2025 · Tous droits réservés</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="text-sm transition-colors hover:opacity-70"
              style={{ color: '#6b6450' }}>Contact</Link>
            <Link href="/login" className="text-sm transition-colors hover:opacity-70"
              style={{ color: '#6b6450' }}>Connexion</Link>
          </div>
          <p className="text-xs" style={{ color: '#b8b09e' }}>
            Built by{' '}
            <a href="https://lj-design.fr" target="_blank" rel="noopener noreferrer"
              className="font-medium hover:opacity-80 transition-opacity" style={{ color: '#524f3d' }}>
              LJ DESIGN
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}