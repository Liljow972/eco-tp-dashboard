'use client'

import Link from 'next/link'
import NextImage from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, Files, LayoutGrid, Settings, Activity, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AuthService } from '@/lib/auth'

type SidebarProps = {
  open?: boolean
  onClose?: () => void
}
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

export default function Sidebar({ open = false, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(() => {
    setIsAdmin(AuthService.isAdmin())
  }, [])

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-ecotp-green text-ecotp-white flex-col z-40">
        <div className="h-16 flex items-center px-4 border-b border-ecotp-white/20">
          <div className="h-14 w-14 rounded-md overflow-hidden bg-ecotp-white/20 mr-3 flex items-center justify-center" aria-hidden={false}>
            <NextImage src="/LOGO_ECO_TP-05.png" alt="Logo CRM blanc" width={56} height={56} priority />
          </div>
          <div>
            <p className="text-sm font-semibold">CRM</p>
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

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
          <aside className="absolute left-0 top-0 h-full w-64 bg-ecotp-green text-ecotp-white flex flex-col shadow-lg transform transition-transform duration-200 ease-out translate-x-0">
            <div className="h-16 flex items-center px-4 border-b border-ecotp-white/20 justify-between">
              <div className="flex items-center">
                <div className="h-14 w-14 rounded-md overflow-hidden bg-ecotp-white/20 mr-3 flex items-center justify-center" aria-hidden={false}>
                  <NextImage src="/LOGO_ECO_TP-05.png" alt="Logo CRM blanc" width={56} height={56} priority />
                </div>
                <div>
                  <p className="text-sm font-semibold">CRM</p>
                  <p className="text-xs opacity-80">Dashboard</p>
                </div>
              </div>
              <button onClick={onClose} className="px-2 py-1 rounded bg-ecotp-white/20 hover:bg-ecotp-white/30" aria-label="Fermer le menu">Fermer</button>
            </div>
            <nav className="flex-1 py-4 overflow-y-auto">
              <ul className="space-y-1">
                {getNavItems(isAdmin).map(({ href, label, icon: Icon }) => {
                  const active = pathname?.startsWith(href)
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={onClose}
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
        </div>
      )}
    </>
  )
}