'use client'

import { useState } from 'react'
import { Menu, Bell, Search, Calendar, ChevronDown, LogOut, User as UserIcon, Settings } from 'lucide-react'
import Link from 'next/link'
import { AuthService } from '@/lib/auth'
import NotificationCenter from '@/components/NotificationCenter'

export default function Header({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifyOpen, setNotifyOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const handleSignOut = async () => {
    await AuthService.signOut()
    window.location.href = '/login'
  }

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center gap-x-4 border-b border-gray-200 bg-white/80 px-6 backdrop-blur-xl md:ml-64 shadow-sm">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-ecotp-green-900 md:hidden hover:bg-ecotp-green-50 rounded-lg transition-colors"
        onClick={onToggleSidebar}
      >
        <span className="sr-only">Ouvrir le menu</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">Rechercher</label>
          <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400" aria-hidden="true" />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm bg-transparent"
            placeholder="Rechercher un chantier, un client, un document..."
            type="search"
            name="search"
          />
        </form>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <div className="flex items-center gap-x-4 border-l border-gray-200 pl-4">
            {/* Notifications */}
            <NotificationCenter />

            {/* Calendar */}
            <div className="relative">
              <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-ecotp-green-600 transition-colors tooltip" title="Calendrier">
                <span className="sr-only">Calendrier</span>
                <Calendar className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/** Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

          {/** Profile Dropdown */}
          <div className="relative">
            <button
              className="-m-1.5 flex items-center p-1.5 hover:bg-gray-50 rounded-full transition-colors"
              onClick={() => setProfileOpen(!profileOpen)}
              id="user-menu-button"
              aria-expanded={profileOpen}
              aria-haspopup="true"
            >
              <span className="sr-only">Ouvrir menu utilisateur</span>
              <div className="h-8 w-8 rounded-full bg-ecotp-green-100 flex items-center justify-center text-ecotp-green-700 font-bold text-xs ring-2 ring-white shadow-sm border border-ecotp-green-200">
                A
              </div>
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">Admin EcoTP</span>
                <ChevronDown className={`ml-2 h-5 w-5 text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </span>
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white py-1 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-20 animate-fade-in-up">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm text-gray-500">Connecté en tant que</p>
                    <p className="truncate text-sm font-medium text-gray-900">admin@ecotp.com</p>
                  </div>
                  <div className="py-1">
                    <Link href="/settings" onClick={() => setProfileOpen(false)} className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-ecotp-green-700">
                      <Settings className="mr-3 h-4 w-4 text-gray-400 group-hover:text-ecotp-green-600" />
                      Paramètres
                    </Link>
                    <Link href="/settings?tab=profile" onClick={() => setProfileOpen(false)} className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-ecotp-green-700">
                      <UserIcon className="mr-3 h-4 w-4 text-gray-400 group-hover:text-ecotp-green-600" />
                      Mon Profil
                    </Link>
                  </div>
                  <div className="py-1 border-t border-gray-100">
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="mr-3 h-4 w-4 text-red-500" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}