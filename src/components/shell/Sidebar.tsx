'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Files, LayoutGrid, Settings, Activity, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AuthService } from '@/lib/auth'

function getNavItems(isAdmin: boolean) {
  const base = [
    { href: '/dashboard', label: "Vue d'ensemble", icon: Home },
    { href: '/projects', label: 'Projets', icon: LayoutGrid },
    { href: '/files', label: 'Documents', icon: Files },
    { href: '/settings', label: 'Paramètres', icon: Settings },
  ]
  if (isAdmin) {
    // Menu admin demandé: Tableau de bord, Suivi en temps réel, Collaboration, Fichiers
    // Adapter les libellés/routes pour coller au visuel
    return [
      { href: '/dashboard', label: 'Tableau de bord', icon: Home },
      { href: '/dashboard?tab=avancement', label: 'Suivi en temps réel', icon: Activity },
      { href: '/collaboration', label: 'Collaboration', icon: Users },
      { href: '/files', label: 'Fichiers', icon: Files },
      { href: '/settings', label: 'Paramètres', icon: Settings },
    ]
  }
  return base
}

export default function Sidebar() {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(() => {
    setIsAdmin(AuthService.isAdmin())
  }, [])

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-ecotp-green text-ecotp-white flex flex-col">
      <div className="h-16 flex items-center px-4 border-b border-ecotp-white/20">
        <div className="h-9 w-9 rounded bg-ecotp-white/20 mr-3" aria-hidden />
        <div>
          <p className="text-sm font-semibold">EcoTP</p>
          <p className="text-xs opacity-80">Dashboard</p>
        </div>
      </div>
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {getNavItems(isAdmin).map(({ href, label, icon: Icon }) => {
            const active = pathname?.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ecotp-white/70 aria-[current=page]:bg-ecotp-white/10 ${
                    active ? 'bg-ecotp-white/10' : 'hover:bg-ecotp-white/5'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                  <span>{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="p-4 text-xs opacity-80">
        <p>Martinique · Terrassement écologique</p>
      </div>
    </aside>
  )
}