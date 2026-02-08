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
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await AuthService.getCurrentUser()
        if (user) {
          setIsAdmin(user.role === 'admin')
          setCurrentUser(user)
        } else {
          // Fallback: Check pathname to avoid flickering wrong menu
          if (pathname.startsWith('/admin') || pathname.startsWith('/avancement') || pathname.startsWith('/collaboration')) {
            setIsAdmin(true)
          }
        }
      } catch (e) {
        console.error("Sidebar load error", e)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [pathname])

  // Menu items config based on role
  const items = (isAdmin || pathname.startsWith('/admin')) ? [
    { href: '/admin', label: 'Tableau de bord', icon: PieChart },
    { href: '/avancement', label: 'Suivi Chantier', icon: Activity },
    { href: '/collaboration', label: 'Collaboration', icon: Users },
    { href: '/files', label: 'GED', icon: FileText },
    { href: '/settings', label: 'Paramètres', icon: Settings },
  ] : [
    { href: '/client', label: 'Vue d\'ensemble', icon: Home },
    { href: '/projects', label: 'Projets', icon: LayoutGrid },
    { href: '/files', label: 'Documents', icon: Files },
    { href: '/settings', label: 'Paramètres', icon: Settings },
  ]

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <div className={`fixed inset-0 z-40 md:hidden bg-gray-900/50 backdrop-blur-sm transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />

      <aside className={`fixed top-0 left-0 z-50 h-screen w-64 bg-[#0B2318] text-white transition-transform duration-300 ease-in-out md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo Section */}
        <div className="flex h-32 items-center justify-center px-6 border-b border-[#1A3828]">
          <div className="relative w-36 h-36">
            <Image
              src="/LOGO_ECO_TP-06.png"
              alt="Eco TP"
              fill
              className="object-contain"
              priority
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
                  ? 'bg-[#1A3828] text-white shadow-lg shadow-black/10'
                  : 'text-gray-400 hover:bg-[#1A3828]/50 hover:text-white'
                  }`}
              >
                <Icon className={`mr-3 h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? 'text-[#4ADE80]' : 'text-gray-500 group-hover:text-[#4ADE80]'}`} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User / Footer */}
        <div className="border-t border-[#1A3828] p-4">
          <div className="rounded-2xl bg-[#0F2E20] p-4 border border-[#1A3828]">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-[#1A3828] flex items-center justify-center border border-[#2D5B42] text-[#4ADE80]">
                <span className="text-sm font-bold">{currentUser ? getInitials(currentUser.name) : '...'}</span>
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate text-white">{currentUser?.name || 'Chargement...'}</p>
                <p className="text-xs text-gray-400 truncate">{isAdmin ? 'Administrateur' : 'Client'}</p>
              </div>
            </div>
            <button
              onClick={async () => {
                await AuthService.signOut()
                window.location.href = '/login'
              }}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-black/20 hover:bg-black/30 py-2 text-xs font-medium text-gray-400 hover:text-white transition-colors"
            >
              <LogOut size={14} />
              Déconnexion
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-[10px] text-gray-600 font-medium">
              Built by <a href="https://lj-design.fr" target="_blank" rel="noopener noreferrer" className="hover:text-[#4ADE80] transition-colors tracking-wide">LJ DESIGN</a>
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}