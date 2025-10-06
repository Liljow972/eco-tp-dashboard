'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Users, LogOut, Bell, User as UserIcon, Menu, Home } from 'lucide-react'
import { AuthService } from '@/lib/auth'
import { getClients } from '@/lib/mock'

export default function Header({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [clients, setClients] = useState<{ id: string; name: string }[]>([])
  const [currentClient, setCurrentClient] = useState<string>('')
  const [currentUserName, setCurrentUserName] = useState<string>('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifyOpen, setNotifyOpen] = useState(false)
  const router = useRouter()
  // Logo: configurable via NEXT_PUBLIC_APP_LOGO, puis /logo.svg, /logo.png, fallback
  const initialLogo = process.env.NEXT_PUBLIC_APP_LOGO || '/logo.svg'
  const [logoSrc, setLogoSrc] = useState<string>(initialLogo)
  const [logoTriedPng, setLogoTriedPng] = useState(false)

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

  // Handlers dépendants de l'état et du router (doivent être dans le composant)
  const handleLogoError = () => {
    if (!logoTriedPng) {
      setLogoTriedPng(true)
      setLogoSrc('/logo.png')
    } else {
      setLogoSrc('/logo-ecotp.svg')
    }
  }

  const handleSignOut = async () => {
    await AuthService.signOut()
    router.push('/')
  }

  return (
    <header className="md:ml-64 ml-0">
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
            <div className="absolute inset-0 bg-ecotp-green/60 pointer-events-none" />
            <div className="relative z-10 h-full px-3 sm:px-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="md:hidden p-2 rounded-md bg-ecotp-white/95 hover:bg-ecotp-white relative z-20"
                  onMouseDown={() => onToggleSidebar && onToggleSidebar()}
                  aria-label="Ouvrir le menu"
                >
                  <Menu className="h-5 w-5 text-ecotp-green" aria-hidden />
                </button>
                {/* Logo retiré du header pour épurer l’UI du dashboard */}
              </div>
              <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                {/* Icône de recherche (ouvre un champ au clic) */}
                <div className="relative">
                  <button
                    type="button"
                    className="p-2 rounded-md bg-ecotp-white/95 hover:bg-ecotp-white"
                    aria-label="Ouvrir la recherche"
                    onClick={() => setSearchOpen((o) => !o)}
                  >
                    <Search className="h-4 w-4 text-ecotp-green" aria-hidden />
                  </button>
                  {/* Popover de recherche */}
                  {searchOpen && (
                    <div className="absolute left-0 mt-2 w-72 bg-white rounded-md shadow-lg border border-ecotp-gray-200 z-50 p-2 flex items-center gap-2">
                      <Search className="h-4 w-4 text-ecotp-green" aria-hidden />
                      <input
                        autoFocus
                        id="search"
                        className="flex-1 bg-transparent placeholder-black/70 text-black outline-none"
                        placeholder="Rechercher..."
                      />
                      <button
                        type="button"
                        className="px-2 py-1 rounded bg-ecotp-green text-white"
                        onClick={() => setSearchOpen(false)}
                      >Fermer</button>
                    </div>
                  )}
                </div>
                {isAdmin && (
                  <div className="hidden sm:flex items-center bg-ecotp-white/95 rounded-md px-2 py-1">
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
                <div className="relative">
                  <button
                    type="button"
                    className="hidden min-[360px]:inline-flex p-2 rounded-md bg-ecotp-white/95 hover:bg-ecotp-white"
                    title="Notifications"
                    onClick={() => setNotifyOpen((o) => !o)}
                  >
                    <Bell className="h-4 w-4 text-ecotp-green" aria-hidden />
                  </button>
                  {notifyOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-ecotp-gray-200 z-50">
                      <div className="px-3 py-2 text-sm text-black/80 border-b border-ecotp-gray-100">Notifications</div>
                      <ul className="max-h-48 overflow-y-auto">
                        <li className="px-3 py-2 text-sm text-black hover:bg-ecotp-gray-100">Nouveau document partagé</li>
                        <li className="px-3 py-2 text-sm text-black hover:bg-ecotp-gray-100">Tâche planifiée demain</li>
                        <li className="px-3 py-2 text-sm text-black hover:bg-ecotp-gray-100">Projet mis à jour</li>
                      </ul>
                      <div className="px-3 py-2"><button type="button" className="text-ecotp-green text-sm" onClick={() => setNotifyOpen(false)}>Fermer</button></div>
                    </div>
                  )}
                </div>
                {/* Accueil */}
                <Link
                  href="/"
                  className="inline-flex p-2 rounded-md bg-ecotp-white/95 hover:bg-ecotp-white"
                  title="Accueil"
                >
                  <Home className="h-4 w-4 text-ecotp-green" aria-hidden />
                </Link>
                {/* Déconnexion directe */}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex p-2 rounded-md bg-ecotp-white/95 hover:bg-ecotp-white"
                  title="Se déconnecter"
                >
                  <LogOut className="h-4 w-4 text-ecotp-green" aria-hidden />
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
                    <span className={`hidden min-[360px]:inline text-xs px-2 py-0.5 rounded-full ${isAdmin ? 'bg-ecotp-green/15 text-ecotp-green' : 'bg-black/10 text-black/70'}`}>{isAdmin ? 'Admin' : 'Client'}</span>
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