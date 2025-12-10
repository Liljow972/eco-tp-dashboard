'use client'

import { useState } from 'react'
import Sidebar from '@/components/shell/Sidebar'
import Header from '@/components/shell/Header'

export default function DashLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="min-h-screen bg-ecotp-beige-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <main className="md:ml-64 min-h-[calc(100vh-80px)] p-6">
        {children}
      </main>
    </div>
  )
}