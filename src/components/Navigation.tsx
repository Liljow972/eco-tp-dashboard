'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, FileText, TrendingUp, LogOut, Settings, User, Menu, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

const Navigation = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile, signOut, loading } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/auth/login')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  // Si pas d'utilisateur connecté, ne pas afficher la navigation
  if (!user || loading) {
    return null
  }

  const navItems = [
    {
      name: 'Aperçu',
      href: '/',
      icon: Home,
    },
    {
      name: 'Documents',
      href: '/documents',
      icon: FileText,
    },
    {
      name: 'Avancement',
      href: '/avancement',
      icon: TrendingUp,
    },
  ]

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-primary-600">EcoTP</h1>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
          
          {/* Desktop User Menu */}
          <div className="hidden sm:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <User className="w-4 h-4" />
              <span className="hidden md:inline">{profile?.name || user.email}</span>
              {profile?.role === 'admin' && (
                <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                  Admin
                </span>
              )}
            </div>
            {profile?.role === 'admin' && (
              <Link
                href="/admin"
                className="text-gray-500 hover:text-gray-700 p-2 rounded-md"
                title="Administration"
              >
                <Settings className="w-5 h-5" />
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-md"
              title="Se déconnecter"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-md"
              aria-label="Menu principal"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 text-base font-medium ${
                      isActive
                        ? 'text-primary-600 bg-primary-50 border-r-4 border-primary-500'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
            
            {/* Mobile User Section */}
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-3 mb-3">
                <User className="w-5 h-5 text-gray-400 mr-2" />
                <div className="text-sm">
                  <div className="font-medium text-gray-800">{profile?.name || user.email}</div>
                  {profile?.role === 'admin' && (
                    <div className="text-xs text-primary-600">Administrateur</div>
                  )}
                </div>
              </div>
              
              <div className="space-y-1">
                {profile?.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="w-5 h-5 mr-3" />
                    Administration
                  </Link>
                )}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    handleSignOut()
                  }}
                  className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation