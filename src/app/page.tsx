"use client"
import Link from 'next/link'
import Image from 'next/image'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header simple */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Logo PNG fourni */}
            <Image
              src="/LOGO_ECO_TP-05.png"
              alt="Logo EcoTP"
              width={40}
              height={40}
              className="rounded-lg"
              priority
            />
            <span className="text-xl font-semibold text-gray-900">EcoTP Dashboard</span>
          </div>
          <nav className="flex items-center space-x-6">
            <Link href="/contact" className="text-gray-700 hover:text-gray-900">Nous contacter</Link>
          </nav>
        </div>
      </header>

      {/* Hero section avec dégradé de couleur (remplace temporairement l'image) */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-100">
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">Terrassement écologique, suivi en temps réel</h1>
          <p className="mt-4 text-lg text-gray-700 max-w-3xl">Gérez vos projets, documents et collaborateurs sur une plateforme simple et efficace.</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/auth/login" className="px-6 py-3 bg-ecotp-green text-white rounded-lg shadow hover:bg-emerald-700">Se connecter</Link>
            <Link href="/register" className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100">S'inscrire</Link>
          </div>
        </div>
      </section>

      {/* Section chiffres (statistiques synthétiques) */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Carte: Projets Écologiques */}
          <div className="relative rounded-2xl bg-white shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">🌱</div>
              <div>
                <div className="text-2xl font-semibold text-gray-900">24</div>
                <div className="text-sm text-gray-600">Projets Écologiques</div>
              </div>
            </div>
            <span className="absolute right-4 top-4 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
          </div>

          {/* Carte: Taux de Réussite */}
          <div className="relative rounded-2xl bg-white shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">📊</div>
              <div>
                <div className="text-2xl font-semibold text-gray-900">89%</div>
                <div className="text-sm text-gray-600">Taux de Réussite</div>
              </div>
            </div>
            <span className="absolute right-4 top-4 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">+8%</span>
          </div>

          {/* Carte: Clients Actifs */}
          <div className="relative rounded-2xl bg-white shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">👥</div>
              <div>
                <div className="text-2xl font-semibold text-gray-900">156</div>
                <div className="text-sm text-gray-600">Clients Actifs</div>
              </div>
            </div>
            <span className="absolute right-4 top-4 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">+15%</span>
          </div>

          {/* Carte: Documents */}
          <div className="relative rounded-2xl bg-white shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">📄</div>
              <div>
                <div className="text-2xl font-semibold text-gray-900">342</div>
                <div className="text-sm text-gray-600">Documents</div>
              </div>
            </div>
            <span className="absolute right-4 top-4 text-xs font-medium text-violet-600 bg-violet-50 px-2 py-1 rounded-full">+22%</span>
          </div>
        </div>
      </section>

      {/* 3 blocs animés (Écologique, Suivi en temps réel, Collaboration) */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Écologique */}
          <div className="group rounded-2xl bg-white border border-gray-100 shadow-sm p-8 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-4">🌿</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Écologique</h3>
            <p className="text-gray-600">Pratiques respectueuses de l'environnement pour un terrassement durable et responsable.</p>
          </div>

          {/* Suivi en temps réel */}
          <div className="group rounded-2xl bg-white border border-gray-100 shadow-sm p-8 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-4">📈</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Suivi en temps réel</h3>
            <p className="text-gray-600">Visualisez l'avancement de vos projets avec des données actualisées en continu.</p>
          </div>

          {/* Collaboration */}
          <div className="group rounded-2xl bg-white border border-gray-100 shadow-sm p-8 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center mb-4">🤝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Collaboration</h3>
            <p className="text-gray-600">Communication transparente et efficace entre équipes, clients et partenaires.</p>
          </div>
        </div>
      </section>
    </div>
  )
}