'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, Users, BarChart3, Settings, Bell, Search, User, 
  Menu, X, ChevronDown, LogOut, HelpCircle 
} from 'lucide-react';
import { useState } from 'react';

interface ModernLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showSidebar?: boolean;
  userRole?: 'client' | 'admin';
  userName?: string;
}

const navigation = {
  client: [
    { name: 'Tableau de bord', href: '/client', icon: Home },
    { name: 'Mes Projets', href: '/client/projects', icon: BarChart3 },
    { name: 'Documents', href: '/client/documents', icon: Users },
    { name: 'Support', href: '/client/support', icon: HelpCircle },
  ],
  admin: [
    { name: 'Vue d\'ensemble', href: '/admin', icon: Home },
    { name: 'Clients', href: '/admin/clients', icon: Users },
    { name: 'Projets', href: '/admin/projects', icon: BarChart3 },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Paramètres', href: '/admin/settings', icon: Settings },
  ]
};

export default function ModernLayout({ 
  children, 
  title, 
  subtitle, 
  showSidebar = true, 
  userRole = 'client',
  userName = 'Utilisateur'
}: ModernLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const currentNavigation = navigation[userRole];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50">
      {/* Header */}
      <header className="header-modern">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">E</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">EcoTP</h1>
                  <p className="text-sm text-gray-600 capitalize">{userRole}</p>
                </div>
              </Link>

              {/* Navigation Desktop */}
              {showSidebar && (
                <nav className="hidden md:flex items-center space-x-1">
                  {currentNavigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="input-search w-64"
                />
              </div>

              {/* Notifications */}
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="notification-badge"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 bg-gray-100 rounded-xl px-3 py-2 hover:bg-gray-200 transition-colors"
                >
                  <div className="avatar avatar-sm">
                    <span>{userName.charAt(0)}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 hidden md:block">{userName}</span>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <div className="dropdown-menu">
                    <Link href="/profile" className="dropdown-item">
                      <User className="w-4 h-4 mr-3" />
                      Profil
                    </Link>
                    <Link href="/settings" className="dropdown-item">
                      <Settings className="w-4 h-4 mr-3" />
                      Paramètres
                    </Link>
                    <div className="divider"></div>
                    <button className="dropdown-item text-red-600 w-full text-left">
                      <LogOut className="w-4 h-4 mr-3" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              {showSidebar && (
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {showSidebar && sidebarOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setSidebarOpen(false)}></div>
          <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-xl z-50 transform transition-transform">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="avatar avatar-md">
                    <span>{userName.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{userName}</p>
                    <p className="text-sm text-gray-600 capitalize">{userRole}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-2">
                {currentNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`nav-link w-full ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container-modern">
        {/* Page Header */}
        {(title || subtitle) && (
          <div className="mb-8 animate-fade-in">
            {title && (
              <h1 className="text-hero mb-2">{title}</h1>
            )}
            {subtitle && (
              <p className="text-subtitle">{subtitle}</p>
            )}
          </div>
        )}

        {/* Page Content */}
        <div className="animate-slide-up">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">EcoTP</h3>
                  <p className="text-sm text-gray-600">Terrassement Écologique</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Plateforme de gestion de projets de terrassement respectueux de l'environnement.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-lg">🌱</span>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-lg">📊</span>
                </div>
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 text-lg">🤝</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Navigation</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Accueil</Link></li>
                <li><Link href="/client" className="text-gray-600 hover:text-gray-900 transition-colors">Espace Client</Link></li>
                <li><Link href="/admin" className="text-gray-600 hover:text-gray-900 transition-colors">Espace Admin</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-gray-600 hover:text-gray-900 transition-colors">Centre d'aide</Link></li>
                <li><Link href="/docs" className="text-gray-600 hover:text-gray-900 transition-colors">Documentation</Link></li>
                <li><Link href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">Confidentialité</Link></li>
                <li><Link href="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">Conditions</Link></li>
              </ul>
            </div>
          </div>

          <div className="divider"></div>

          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-600 text-sm">
              © 2024 EcoTP. Tous droits réservés.
            </p>
            <p className="text-gray-600 text-sm">
              Développé avec 💚 pour l'environnement
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}