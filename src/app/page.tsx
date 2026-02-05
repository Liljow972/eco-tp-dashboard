"use client"
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Leaf, BarChart3, Users, FileText, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ecotp-beige-50 selection:bg-ecotp-green-200">
      {/* Navigation - Glass effect */}
      <nav className="fixed top-0 w-full z-50 px-4 py-4 md:px-6">
        <div className="glass-panel rounded-2xl max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative overflow-hidden" style={{ width: '9rem', height: '9rem' }}>
              <Image
                src="/LOGO_ECO_TP-05.png"
                alt="Eco TP Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-ecotp-green-800 hover:text-ecotp-green-600 font-medium transition-colors">Solutions</Link>
            <Link href="#stats" className="text-ecotp-green-800 hover:text-ecotp-green-600 font-medium transition-colors">Impact</Link>
            <Link href="/contact" className="text-ecotp-green-800 hover:text-ecotp-green-600 font-medium transition-colors">Contact</Link>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/login" className="hidden sm:block text-ecotp-green-900 font-medium hover:text-ecotp-green-700 px-4 py-2 transition-colors">Connexion</Link>
            <Link href="/register" className="btn-primary py-2.5 px-5 text-sm">
              Démarrer
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-ecotp-green-50 border border-ecotp-green-100 text-ecotp-green-700 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ecotp-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-ecotp-green-500"></span>
              </span>
              <span>Dashboard v2.0 Disponible</span>
            </div>

            <h1 className="text-5xl sm:text-6xl/tight font-bold text-ecotp-green-900 tracking-tight">
              Le terrassement <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ecotp-green-600 to-ecotp-green-400">
                réinventé & durable
              </span>
            </h1>

            <p className="text-lg text-ecotp-gray-600 max-w-xl leading-relaxed">
              Pilotez vos chantiers écologiques avec une précision chirurgicale.
              Suivi en temps réel, gestion documentaire sécurisée et collaboration fluide pour les entreprises modernes.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/register" className="btn-primary flex items-center gap-2 group">
                Créer un compte
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#demo" className="btn-secondary">
                Voir la démo
              </Link>
            </div>

            <div className="flex items-center gap-4 text-sm text-ecotp-gray-500 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-ecotp-gray-200 flex items-center justify-center text-xs font-bold text-ecotp-gray-600">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p>Rejoint par +150 entreprises</p>
            </div>
          </div>

          {/* Hero Visual - Abstract Glass Composition */}
          <div className="relative h-[500px] w-full hidden lg:block animate-fade-in">
            <div className="absolute top-0 right-0 w-4/5 h-full bg-gradient-to-bl from-ecotp-green-100/50 to-transparent rounded-[3rem] -z-10 blur-3xl" />

            {/* Main Glass Card */}
            <div className="absolute top-10 right-10 left-10 bottom-10 glass-panel rounded-3xl p-6 border border-white/60 animate-float">
              <div className="h-full w-full bg-ecotp-beige-50/50 rounded-2xl border border-ecotp-green-50 p-6 flex flex-col">
                {/* Fake UI Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="space-y-1">
                    <div className="h-2 w-24 bg-ecotp-green-200 rounded-full"></div>
                    <div className="h-2 w-16 bg-ecotp-green-100 rounded-full"></div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-ecotp-green-100"></div>
                </div>
                {/* Fake Chart */}
                <div className="flex-1 flex items-end space-x-4 px-2">
                  <div className="w-full bg-ecotp-green-200/40 rounded-t-lg h-[40%]"></div>
                  <div className="w-full bg-ecotp-green-300/60 rounded-t-lg h-[70%]"></div>
                  <div className="w-full bg-ecotp-green-500 rounded-t-lg h-[55%] relative shadow-lg shadow-ecotp-green-500/20">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 glass-card py-1 px-3 rounded-lg text-xs font-bold text-ecotp-green-800">
                      +24%
                    </div>
                  </div>
                  <div className="w-full bg-ecotp-green-200/40 rounded-t-lg h-[85%]"></div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -left-4 top-32 glass-card p-4 rounded-xl flex items-center gap-3 animate-float" style={{ animationDelay: '1s' }}>
              <div className="bg-ecotp-green-100 p-2 rounded-lg text-ecotp-green-600">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-xs text-ecotp-gray-500">Statut Chantier</p>
                <p className="text-sm font-bold text-ecotp-green-900">Terminé</p>
              </div>
            </div>

            <div className="absolute -bottom-8 right-20 glass-card p-4 rounded-xl flex items-center gap-3 animate-float" style={{ animationDelay: '2s' }}>
              <div className="bg-ecotp-green-100 p-2 rounded-lg text-ecotp-green-600">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-xs text-ecotp-gray-500">Documents</p>
                <p className="text-sm font-bold text-ecotp-green-900">Signés à 100%</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Stats Section (Bento) */}
      <section id="stats" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-6 rounded-2xl col-span-1 md:col-span-2 lg:col-span-2 row-span-2 md:flex flex-col justify-between bg-gradient-to-br from-white to-ecotp-green-50/50">
            <div>
              <div className="w-12 h-12 bg-ecotp-green-100 rounded-xl flex items-center justify-center text-ecotp-green-600 mb-4">
                <Leaf size={24} />
              </div>
              <h3 className="text-2xl font-bold text-ecotp-green-900 mb-2">Impact Écologique</h3>
              <p className="text-ecotp-gray-600">Suivez votre réduction d'empreinte carbone projet par projet.</p>
            </div>
            <div className="mt-8 text-4xl font-bold text-ecotp-green-600">1,240 <span className="text-lg font-normal text-ecotp-gray-500">tonnes CO2 économisées</span></div>
          </div>

          <div className="glass-card p-6 rounded-2xl bg-white">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-ecotp-beige-200 rounded-lg flex items-center justify-center text-ecotp-brown-500">
                <ShieldCheck size={20} />
              </div>
              <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">+98%</span>
            </div>
            <div className="text-2xl font-bold text-ecotp-gray-900">Fiabilité</div>
            <p className="text-sm text-ecotp-gray-500">Taux de réussite chantier</p>
          </div>

          <div className="glass-card p-6 rounded-2xl bg-white">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <Users size={20} />
              </div>
            </div>
            <div className="text-2xl font-bold text-ecotp-gray-900">450+</div>
            <p className="text-sm text-ecotp-gray-500">Clients satisfaits</p>
          </div>

          <div className="glass-card p-6 rounded-2xl col-span-1 md:col-span-2 lg:col-span-2 bg-ecotp-green-900 text-white relative overflow-hidden group hover:bg-white/90 transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-ecotp-green-800 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-ecotp-green-100 transition-colors duration-500"></div>
            <div className="relative z-10">
              <Zap className="text-yellow-400 mb-4 h-8 w-8" />
              <h3 className="text-xl font-bold mb-2 group-hover:text-ecotp-green-900 transition-colors">Performance Maximale</h3>
              <p className="text-ecotp-green-200 group-hover:text-ecotp-green-700 transition-colors">Gagnez en moyenne 30% de temps sur la gestion administrative de vos chantiers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-ecotp-green-900 mb-4">Tout vos outils au même endroit</h2>
            <p className="text-ecotp-gray-600 max-w-2xl mx-auto">Une suite complète pour numériser votre activité de terrassement sans perdre l'humain.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BarChart3, title: "Suivi en temps réel", desc: "Tableaux de bord dynamiques pour visualiser l'avancement travaux.", color: "text-blue-600", bg: "bg-blue-50" },
              { icon: FileText, title: "GED Intelligente", desc: "Stockage sécurisé, signature électronique et partage client.", color: "text-purple-600", bg: "bg-purple-50" },
              { icon: Users, title: "Espace Client", desc: "Portail dédié pour vos clients avec accès restreint et sécurisé.", color: "text-orange-600", bg: "bg-orange-50" }
            ].map((feature, idx) => (
              <div key={idx} className="group p-8 rounded-3xl border border-ecotp-gray-100 hover:border-ecotp-green-200 hover:shadow-xl transition-all duration-300 bg-white">
                <div className={`w-14 h-14 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-ecotp-gray-900 mb-3">{feature.title}</h3>
                <p className="text-ecotp-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto relative rounded-[3rem] overflow-hidden bg-ecotp-green-900 text-center px-6 py-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-10"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-ecotp-green-500 rounded-full blur-[100px] opacity-30"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-ecotp-green-400 rounded-full blur-[100px] opacity-20"></div>

          <div className="relative z-10 space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Prêt à moderniser votre activité ?</h2>
            <p className="text-ecotp-green-100 text-lg max-w-2xl mx-auto">Rejoignez les leaders du terrassement écologique dès aujourd'hui.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register" className="bg-white text-ecotp-green-900 px-8 py-4 rounded-xl font-bold hover:bg-ecotp-beige-50 transition-colors shadow-lg shadow-black/20">
                Commencer l'essai gratuit
              </Link>
              <Link href="/contact" className="px-8 py-4 rounded-xl font-bold text-white border border-ecotp-green-700 hover:bg-ecotp-green-800 transition-colors">
                Contactez-nous
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-ecotp-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-ecotp-gray-500 text-sm">
          <p>© 2024 Eco TP - Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}