'use client'

import { useState } from 'react'
import Sidebar from '@/components/shell/Sidebar'
import Header from '@/components/shell/Header'

export default function DashLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="min-h-screen bg-ecotp-beige">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <main className="md:ml-64 ml-0 px-0 sm:px-6 py-6">
        {children}
      </main>
    </div>
  )
}