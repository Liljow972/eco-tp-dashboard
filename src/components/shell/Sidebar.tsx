'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, Files, LayoutGrid, Settings, Activity, Users, LogOut, FileText, PieChart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

// Palette warm
const C = {
  bg: '#2a2920',   // fond sidebar
  bgCard: '#38362a',   // carte user
  active: '#524f3d',   // item actif
  hover: 'rgba(82,79,61,0.35)',
  border: 'rgba(255,255,255,0.08)',
  accent: '#eae6df',   // icône active / texte accent
  text: 'rgba(234,230,223,0.85)',
  muted: 'rgba(234,230,223,0.45)',
}

type SidebarProps = {
  open?: boolean
  onClose?: () => void
}

export default function Sidebar({ open = false, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(() =>
    pathname.startsWith('/admin') || pathname.startsWith('/avancement') || pathname.startsWith('/collaboration')
  )
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const loadUser = async () => {
      try {
        let localUser: any = null
        try {
          const stored = localStorage.getItem('auth_user')
          if (stored) {
            localUser = JSON.parse(stored)
            setIsAdmin(localUser.role === 'admin')
            setCurrentUser({ name: localUser.name || localUser.email?.split('@')[0] || 'Utilisateur', role: localUser.role || 'client' })
          }
        } catch { }

        // Si on a les données localement, on skip les appels réseau lents
        if (localUser && localUser.role) return

        // 2. Session Supabase (fallback)
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const meta = session.user.user_metadata
          const role = meta?.role || (pathname.startsWith('/admin') ? 'admin' : 'client')
          setIsAdmin(role === 'admin')
          setCurrentUser({ name: meta?.name || session.user.email?.split('@')[0] || 'Utilisateur', role })

          // 3. Profile BDD en arrière-plan
          supabase.from('profiles').select('name, role').eq('id', session.user.id).single()
            .then(({ data }) => {
              if (data) {
                setIsAdmin(data.role === 'admin')
                setCurrentUser({ name: data.name || meta?.name, role: data.role })
              }
            })
        } else {
          setCurrentUser({ name: 'Invité', role: 'client' })
        }
      } catch (e) {
        console.error('Sidebar load error', e)
      }
    }
    loadUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <>
      {/* Overlay mobile */}
      <div
        className={`fixed inset-0 z-40 md:hidden backdrop-blur-sm transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ backgroundColor: 'rgba(42,41,32,0.6)' }}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ backgroundColor: C.bg }}
      >
        {/* Logo */}
        <div className="flex h-[7.5rem] items-center justify-center px-6 shrink-0"
          style={{ borderBottom: `1px solid ${C.border}` }}>
          <div className="relative w-32 h-32">
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
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200"
                style={{
                  backgroundColor: isActive ? C.active : 'transparent',
                  color: isActive ? C.accent : C.text,
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = C.hover }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
              >
                <Icon
                  className="mr-3 h-5 w-5 transition-transform group-hover:scale-110"
                  style={{ color: isActive ? C.accent : C.muted }}
                />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User / Footer */}
        <div className="shrink-0 p-4" style={{ borderTop: `1px solid ${C.border}` }}>
          <div className="rounded-2xl p-4" style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}` }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                style={{ backgroundColor: C.active, color: C.accent, border: `1px solid ${C.border}` }}>
                {currentUser ? getInitials(currentUser.name) : '?'}
              </div>
              <div className="overflow-hidden min-w-0">
                {currentUser ? (
                  <>
                    <p className="text-sm font-semibold truncate" style={{ color: C.accent }}>
                      {currentUser.name}
                    </p>
                    <p className="text-xs truncate" style={{ color: C.muted }}>
                      {isAdmin ? 'Administrateur' : 'Client'}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="h-3 w-24 rounded animate-pulse mb-1" style={{ backgroundColor: C.active }} />
                    <div className="h-2 w-16 rounded animate-pulse" style={{ backgroundColor: C.active }} />
                  </>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('auth_user')
                localStorage.removeItem('rememberMe')
                window.location.href = '/login'
                supabase.auth.signOut().catch(() => { })
              }}
              className="w-full flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium transition-all"
              style={{ backgroundColor: 'rgba(0,0,0,0.2)', color: C.muted }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.35)'
                  ; (e.currentTarget as HTMLElement).style.color = C.accent
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.2)'
                  ; (e.currentTarget as HTMLElement).style.color = C.muted
              }}
            >
              <LogOut size={14} />
              Déconnexion
            </button>
          </div>

          <div className="mt-3 text-center">
            <p className="text-[10px] font-medium" style={{ color: 'rgba(234,230,223,0.2)' }}>
              Built by{' '}
              <a href="https://lj-design.fr" target="_blank" rel="noopener noreferrer"
                className="transition-colors" style={{ color: 'rgba(234,230,223,0.35)' }}>
                LJ DESIGN
              </a>
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}