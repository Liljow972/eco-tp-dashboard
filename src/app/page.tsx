'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Users, BarChart3, FileText, Settings, Bell, LogIn, UserPlus } from 'lucide-react';
import AuthModal from '@/components/auth/AuthModal';

export default function Home() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

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
              <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all">
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
    </div>
  );
}