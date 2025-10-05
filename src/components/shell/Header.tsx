'use client'

import { useEffect, useState } from 'react'
import { Search, Users, LogOut, Bell, User as UserIcon } from 'lucide-react'
import { AuthService } from '@/lib/auth'
import { getClients } from '@/lib/mock'

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [clients, setClients] = useState<{ id: string; name: string }[]>([])
  const [currentClient, setCurrentClient] = useState<string>('')
  const [currentUserName, setCurrentUserName] = useState<string>('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const user = AuthService.getCurrentUser()
    setIsAdmin(user?.role === 'admin')
    setCurrentUserName(user?.name || '')
    if (user?.role === 'admin') {
      getClients().then((list) => {
        setClients(list.map((c) => ({ id: c.id, name: c.name })))
        setCurrentClient(list[0]?.id ?? '')
      })
    }
  }, [])

  return (
    <header className="ml-64">
      {/** Utilise un proxy same-origin pour éviter ORB sur certains navigateurs/extensions */}
      {/** Note: l’URL est encodée pour la query-string */}
      {(() => {
        const heroURL = encodeURIComponent(
          'https://images.unsplash.com/photo-1602204097741-b2f8ef1c6845?q=80&w=2000&auto=format&fit=crop'
        )
        return (
          <div
            className="relative h-32 bg-center bg-cover"
            style={{
              backgroundImage: `url('/api/image-proxy?url=${heroURL}')`,
            }}
            aria-label="Bandeau chantier écologique"
          >
            <div className="absolute inset-0 bg-ecotp-green/60" />
            <div className="relative h-full px-6 flex items-center justify-between">
              <h1 className="text-ecotp-white text-xl sm:text-2xl font-semibold">
                Eco TP Dashboard
              </h1>
              <div className="flex items-center gap-3">
                <label className="sr-only" htmlFor="search">Rechercher</label>
                <div className="flex items-center bg-ecotp-white/95 rounded-md px-2 py-1">
                  <Search className="h-4 w-4 text-ecotp-green" aria-hidden />
                  <input
                    id="search"
                    className="ml-2 bg-transparent placeholder-black/70 text-black outline-none w-40 sm:w-56"
                    placeholder="Rechercher..."
                  />
                </div>
                {isAdmin && (
                  <div className="flex items-center bg-ecotp-white/95 rounded-md px-2 py-1">
                    <Users className="h-4 w-4 text-ecotp-green" aria-hidden />
                    <label className="sr-only" htmlFor="client-select">Sélecteur de client</label>
                    <select
                      id="client-select"
                      className="ml-2 bg-transparent text-black outline-none"
                      value={currentClient}
                      onChange={(e) => setCurrentClient(e.target.value)}
                    >
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {/* Notifications */}
                <button
                  className="p-2 rounded-md bg-ecotp-white/95 hover:bg-ecotp-white"
                  title="Notifications"
                >
                  <Bell className="h-4 w-4 text-ecotp-green" aria-hidden />
                </button>
                {/* User menu (Profil, Déconnexion) */}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen((o) => !o)}
                    className="user-menu-button flex items-center gap-2 bg-ecotp-white/95 rounded-md px-2 py-1 hover:bg-ecotp-white"
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                  >
                    <div className="w-6 h-6 rounded-full bg-ecotp-green text-white flex items-center justify-center">
                      {(currentUserName?.[0] || (isAdmin ? 'A' : 'C')).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline text-sm text-black/80">{currentUserName || (isAdmin ? 'Admin' : 'Client')}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${isAdmin ? 'bg-ecotp-green/15 text-ecotp-green' : 'bg-black/10 text-black/70'}`}>{isAdmin ? 'Admin' : 'Client'}</span>
                  </button>
                  {menuOpen && (
                    <div className="user-menu-dropdown absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-ecotp-gray-200 z-50">
                      <a
                        href="/settings"
                        className="block px-3 py-2 text-sm text-black hover:bg-ecotp-gray-100"
                      >
                        Profil
                      </a>
                      <button
                        onClick={async () => {
                          await AuthService.signOut()
                          window.location.href = '/'
                        }}
                        className="w-full text-left block px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </header>
  )
}