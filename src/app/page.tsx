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
            {/* Logo: remplacé par votre PNG quand disponible */}
            <div className="w-10 h-10 rounded-lg bg-ecotp-green flex items-center justify-center">
              <span className="text-white font-bold">E</span>
            </div>
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

      {/* Bloc login/inscription rapide */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="border rounded-xl p-6 bg-white shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900">Connexion</h2>
            <p className="text-gray-600">Accédez à votre espace client ou admin.</p>
            <div className="mt-6 flex gap-3">
              <Link href="/auth/login" className="px-4 py-2 bg-ecotp-green text-white rounded lg:hover:bg-emerald-700">Se connecter</Link>
              <Link href="/auth/login" className="px-4 py-2 bg-gray-900 text-white rounded">Démo rapide</Link>
            </div>
          </div>
          <div className="border rounded-xl p-6 bg-white shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900">Inscription</h2>
            <p className="text-gray-600">Créez votre compte pour démarrer.</p>
            <div className="mt-6">
              <Link href="/register" className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">S'inscrire</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}