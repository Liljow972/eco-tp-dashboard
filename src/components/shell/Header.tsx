'use client'

import { useState, useEffect } from 'react'
import { Menu, Search, ChevronDown, LogOut, Settings } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import NotificationCenter from '@/components/NotificationCenter'

const BG_HEADER = 'rgba(234,230,223,0.92)'
const PRIMARY = '#524f3d'
const DARK = '#38362a'
const BORDER = '#d4cfc4'

export default function Header({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: string } | null>(null)

  useEffect(() => {
    const loadUser = () => {
      try {
        const stored = localStorage.getItem('auth_user')
        if (stored) {
          const u = JSON.parse(stored)
          setCurrentUser({ name: u.name || u.email || 'Utilisateur', email: u.email || '', role: u.role || 'client' })
          return
        }
      } catch { }
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const meta = session.user.user_metadata
          setCurrentUser({
            name: meta?.name || meta?.full_name || session.user.email?.split('@')[0] || 'Utilisateur',
            email: session.user.email || '',
            role: meta?.role || 'client'
          })
        }
      })
    }
    loadUser()
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem('auth_user')
    localStorage.removeItem('rememberMe')
    window.location.href = '/login'
    supabase.auth.signOut().catch(() => { })
  }

  const userInitial = currentUser?.name?.charAt(0)?.toUpperCase() || 'U'
  const roleLabel = currentUser?.role === 'admin' ? 'Administrateur' : 'Client'

  return (
    <header
      className="sticky top-0 z-30 flex h-20 items-center gap-x-4 px-6 md:ml-64 shadow-sm backdrop-blur-xl"
      style={{ backgroundColor: BG_HEADER, borderBottom: `1px solid ${BORDER}` }}>

      {/* Bouton mobile menu */}
      <button
        type="button"
        className="-m-2.5 p-2.5 rounded-lg transition-colors md:hidden"
        style={{ color: PRIMARY }}
        onClick={onToggleSidebar}
      >
        <span className="sr-only">Ouvrir le menu</span>
        <Menu className="h-6 w-6" />
      </button>

      {/* Search */}
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">Rechercher</label>
          <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5" style={{ color: '#b8b09e' }} />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-8 pr-0 sm:text-sm bg-transparent outline-none"
            style={{ color: DARK }}
            placeholder="Rechercher un chantier, un client, un document..."
            type="search"
            name="search"
          />
        </form>

        {/* Actions droite */}
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Notifications */}
          <div className="flex items-center gap-x-4 pl-4" style={{ borderLeft: `1px solid ${BORDER}` }}>
            <NotificationCenter />
          </div>

          <div className="hidden lg:block lg:h-6 lg:w-px" style={{ backgroundColor: BORDER }} />

          {/* Profil dropdown */}
          <div className="relative">
            <button
              className="-m-1.5 flex items-center gap-2 p-1.5 rounded-full transition-colors"
              onClick={() => setProfileOpen(!profileOpen)}
              id="user-menu-button"
            >
              <div
                className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm ring-2 ring-white shadow-sm"
                style={{ backgroundColor: PRIMARY, color: '#eae6df' }}>
                {userInitial}
              </div>
              <span className="hidden lg:flex lg:items-center">
                <span className="text-sm font-semibold" style={{ color: DARK }}>
                  {currentUser?.name || 'Chargement...'}
                </span>
                <ChevronDown className={`ml-1.5 h-4 w-4 transition-transform ${profileOpen ? 'rotate-180' : ''}`}
                  style={{ color: '#8c8572' }} />
              </span>
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 mt-2 w-60 origin-top-right rounded-2xl shadow-xl z-20 overflow-hidden animate-fade-in-up"
                  style={{ backgroundColor: '#fff', border: `1px solid ${BORDER}` }}>

                  {/* Info user */}
                  <div className="px-4 py-3" style={{ borderBottom: `1px solid ${BORDER}`, backgroundColor: '#fafaf8' }}>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                        style={{ backgroundColor: PRIMARY, color: '#eae6df' }}>
                        {userInitial}
                      </div>
                      <div className="overflow-hidden min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: DARK }}>
                          {currentUser?.name || '...'}
                        </p>
                        <p className="text-xs truncate" style={{ color: '#8c8572' }}>
                          {currentUser?.email || ''}
                        </p>
                        <span className="inline-block text-xs px-2 py-0.5 rounded-full mt-1 font-medium"
                          style={{ backgroundColor: 'rgba(82,79,61,0.1)', color: PRIMARY }}>
                          {roleLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="py-1">
                    <Link
                      href="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm transition-colors hover:bg-gray-50"
                      style={{ color: DARK }}>
                      <Settings className="mr-3 h-4 w-4" style={{ color: '#8c8572' }} />
                      Paramètres
                    </Link>
                  </div>

                  <div className="py-1" style={{ borderTop: `1px solid ${BORDER}` }}>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center px-4 py-2.5 text-sm transition-colors hover:bg-red-50"
                      style={{ color: '#dc2626' }}>
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