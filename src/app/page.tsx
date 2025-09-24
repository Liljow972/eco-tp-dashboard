'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Users, BarChart3, FileText, Settings, Bell, LogIn, UserPlus } from 'lucide-react';
import AuthModal from '@/components/auth/AuthModal';

export default function Home() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleUserSelection = (userType: string) => {
    if (userType === 'client') {
      router.push('/client');
    } else if (userType === 'admin') {
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      {/* Modern Header with Background */}
      <header className="relative overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-blue-900/80 to-green-800/90"></div>
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-green-600/20 to-blue-600/20"></div>
        
        <div className="relative z-10">
          {/* Top Navigation */}
          <nav className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">EcoTP</h1>
                <p className="text-white/80 text-sm">Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                title="Rechercher"
              >
                <Search className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                title="Paramètres"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="px-6 py-16 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-bold text-white mb-6">
                Bonjour, bienvenue sur EcoTP
              </h2>
              <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
                Restez au top de vos tâches, surveillez les progrès et suivez le statut de vos projets de terrassement écologique.
              </p>
              
              {/* Access Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setShowAuthModal(true);
                  }}
                  className="group relative w-full sm:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <LogIn className="w-6 h-6" />
                    <span>Se connecter</span>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setShowAuthModal(true);
                  }}
                  className="group relative w-full sm:w-auto px-10 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <UserPlus className="w-6 h-6" />
                    <span>S'inscrire</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🌱</span>
              </div>
              <span className="text-green-600 text-sm font-medium">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">24</h3>
            <p className="text-gray-600 text-sm">Projets Écologiques</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-blue-600 text-sm font-medium">+8%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">89%</h3>
            <p className="text-gray-600 text-sm">Taux de Réussite</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-yellow-600 text-sm font-medium">+15%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">156</h3>
            <p className="text-gray-600 text-sm">Clients Actifs</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-purple-600 text-sm font-medium">+22%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">342</h3>
            <p className="text-gray-600 text-sm">Documents</p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl p-8 text-center transition-all duration-300 hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">🌱</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Écologique</h3>
            <p className="text-gray-600 leading-relaxed">
              Pratiques respectueuses de l'environnement pour un terrassement durable et responsable
            </p>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl p-8 text-center transition-all duration-300 hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Suivi en temps réel</h3>
            <p className="text-gray-600 leading-relaxed">
              Visualisez l'avancement de vos projets avec des données actualisées en continu
            </p>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl p-8 text-center transition-all duration-300 hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">🤝</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Collaboration</h3>
            <p className="text-gray-600 leading-relaxed">
              Communication transparente et efficace entre équipes, clients et partenaires
            </p>
          </div>
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authMode}
      />

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Rechercher</h3>
                <button
                  onClick={() => setShowSearch(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher des projets, documents, utilisateurs..."
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Tapez pour rechercher dans tous les contenus de la plateforme
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-900">Nouveau projet ajouté</span>
                  </div>
                  <p className="text-xs text-blue-700 mt-1">Il y a 2 heures</p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-900">Projet terminé</span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">Il y a 1 jour</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Mise à jour système</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Il y a 3 jours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Paramètres</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Mode sombre</span>
                  <button className="w-12 h-6 bg-gray-200 rounded-full relative transition-colors">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Notifications</span>
                  <button className="w-12 h-6 bg-blue-500 rounded-full relative transition-colors">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Langue</span>
                  <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                    <option>Français</option>
                    <option>English</option>
                  </select>
                </div>
                <hr className="my-4" />
                <button className="w-full text-left text-sm text-red-600 hover:text-red-700 font-medium">
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}