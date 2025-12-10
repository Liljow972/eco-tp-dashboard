'use client'

import { useState } from 'react'
import { Menu, Bell, Search, Calendar, ChevronDown, LogOut, User as UserIcon, Settings } from 'lucide-react'
import Link from 'next/link'
import { AuthService } from '@/lib/auth'

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
            <div className="relative">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-ecotp-green-600 relative group transition-colors"
                onClick={() => setNotifyOpen(!notifyOpen)}
              >
                <span className="sr-only">Notifications</span>
                <Bell className="h-6 w-6" aria-hidden="true" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
              </button>
              {notifyOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setNotifyOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-80 origin-top-right rounded-xl bg-white p-4 shadow-xl ring-1 ring-black ring-opacity-5 z-20 focus:outline-none animate-fade-in-up">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      <button className="text-xs text-ecotp-green-600 hover:text-ecotp-green-700">Tout marquer comme lu</button>
                    </div>
                    <ul className="space-y-3 max-h-[300px] overflow-y-auto">
                      <li className="flex gap-3 items-start group cursor-pointer hover:bg-gray-50 p-2 rounded-lg -mx-2 transition-colors">
                        <span className="h-2 w-2 mt-2 rounded-full bg-ecotp-green-500 flex-shrink-0"></span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Nouveau document ajouté</p>
                          <p className="text-xs text-gray-500">Plan_masse_v2.pdf a été ajouté au projet Villa Bel Air.</p>
                          <p className="text-[10px] text-gray-400 mt-1">Il y a 5 min</p>
                        </div>
                      </li>
                      <li className="flex gap-3 items-start group cursor-pointer hover:bg-gray-50 p-2 rounded-lg -mx-2 transition-colors">
                        <span className="h-2 w-2 mt-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Avancement chantier</p>
                          <p className="text-xs text-gray-500">L'étape "Fondations" est marquée comme terminée.</p>
                          <p className="text-[10px] text-gray-400 mt-1">Il y a 2h</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>

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