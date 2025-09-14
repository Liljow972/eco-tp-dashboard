'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getCurrentUserDynamic, switchUser, mockProfiles } from '@/lib/mockData'

export default function Home() {
  const [currentUser, setCurrentUser] = useState(getCurrentUserDynamic())

  const handleUserSwitch = (index: number) => {
    switchUser(index)
    setCurrentUser(getCurrentUserDynamic())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            EcoTP - MVP Demo
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Plateforme de gestion de projets de terrassement écologique
          </p>
          
          {/* Sélecteur d'utilisateur pour le MVP */}
          <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-8">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">
              🚧 Mode MVP - Sélectionnez un utilisateur pour tester
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {mockProfiles.map((profile, index) => (
                <button
                  key={profile.id}
                  onClick={() => handleUserSwitch(index)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    currentUser.id === profile.id
                      ? 'bg-yellow-600 text-white'
                      : 'bg-white text-yellow-800 hover:bg-yellow-200'
                  }`}
                >
                  {profile.name} ({profile.role})
                </button>
              ))}
            </div>
            <p className="text-sm text-yellow-700 mt-2">
              Utilisateur actuel: <strong>{currentUser.name}</strong> - {currentUser.role}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Accès aux espaces de test
            </h2>
            <p className="text-gray-600 mb-6">
              Testez les fonctionnalités selon le rôle sélectionné ci-dessus.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/client"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                🏠 Espace Client
              </Link>
              <Link
                href="/admin"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                ⚙️ Espace Admin
              </Link>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-green-600 text-3xl mb-4">🌱</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Écologique
              </h3>
              <p className="text-gray-600">
                Pratiques respectueuses de l'environnement
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-blue-600 text-3xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Suivi en temps réel
              </h3>
              <p className="text-gray-600">
                Visualisez l'avancement de vos projets
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-purple-600 text-3xl mb-4">🤝</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Collaboration
              </h3>
              <p className="text-gray-600">
                Communication transparente avec votre équipe
              </p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Fonctionnalités disponibles dans ce MVP:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Vue client: Consultation des projets, suivi d'avancement, documents</li>
              <li>• Vue admin: Gestion de tous les projets, clients, statistiques</li>
              <li>• Données de démonstration avec 4 projets et 3 utilisateurs</li>
              <li>• Interface responsive et moderne</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}