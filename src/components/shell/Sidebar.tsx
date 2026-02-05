'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, Files, LayoutGrid, Settings, Activity, Users, LogOut, FileText, PieChart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AuthService } from '@/lib/auth'

type SidebarProps = {
  open?: boolean
  onClose?: () => void
}

const navItems = {
  common: [
    { href: '/dashboard', label: 'Vue d\'ensemble', icon: Home },
    { href: '/projects', label: 'Projets', icon: LayoutGrid },
    { href: '/files', label: 'Documents', icon: Files },
    { href: '/settings', label: 'Paramètres', icon: Settings },
  ],
  admin: [
    { href: '/dashboard', label: 'Tableau de bord', icon: PieChart },
    { href: '/avancement', label: 'Suivi Chantier', icon: Activity },
    { href: '/collaboration', label: 'Collaboration', icon: Users },
    { href: '/files', label: 'GED', icon: FileText },
    { href: '/settings', label: 'Paramètres', icon: Settings },
  ]
}

export default function Sidebar({ open = false, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setIsAdmin(AuthService.isAdmin())
  }, [])

  const items = isAdmin ? navItems.admin : navItems.common

  return (
    <>
      <div className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity md:hidden ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />

      <aside className={`fixed top-0 left-0 z-50 h-screen w-64 bg-ecotp-green-900 text-white transition-transform duration-300 ease-in-out md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo Section */}
        <div className="flex h-32 items-center justify-center px-6 border-b border-ecotp-green-800/50 bg-ecotp-green-900/50 backdrop-blur-md">
          <div className="relative flex-shrink-0" style={{ width: '9rem', height: '9rem' }}>
            <Image
              src="/LOGO_ECO_TP-06.png"
              alt="Eco TP"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                  ? 'bg-ecotp-green-500 text-white shadow-lg shadow-ecotp-green-900/20'
                  : 'text-ecotp-green-100 hover:bg-ecotp-green-800/50 hover:text-white'
                  }`}
              >
                <Icon className={`mr-3 h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-ecotp-green-300 group-hover:text-white'}`} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User / Footer */}
        <div className="border-t border-ecotp-green-800/50 p-4">
          <div className="rounded-2xl bg-gradient-to-br from-ecotp-green-800 to-ecotp-green-900 p-4 border border-ecotp-green-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-ecotp-green-700 flex items-center justify-center border-2 border-ecotp-green-600">
                <span className="text-sm font-bold">JD</span>
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">Jean Dupont</p>
                <p className="text-xs text-ecotp-green-300 truncate">{isAdmin ? 'Administrateur' : 'Client'}</p>
              </div>
            </div>
            <button
              onClick={async () => {
                await AuthService.signOut()
                window.location.href = '/login'
              }}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-black/20 hover:bg-black/30 py-2 text-xs font-medium text-ecotp-green-100 transition-colors"
            >
              <LogOut size={14} />
              Déconnexion
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-[10px] text-ecotp-green-400/60 font-medium">
              Built by <a href="https://lj-design.fr" target="_blank" rel="noopener noreferrer" className="hover:text-ecotp-green-300 transition-colors tracking-wide">LJ DESIGN</a>
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}