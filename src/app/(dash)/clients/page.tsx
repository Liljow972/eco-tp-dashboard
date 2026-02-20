"use client"

import Card from '@/components/Card'
import { getClients } from '@/lib/mock'
import { useEffect, useState } from 'react'

// Lecture synchrone du rôle depuis localStorage (même pattern que Sidebar)
const getLocalRole = () => {
  if (typeof window === 'undefined') return null
  try { return JSON.parse(localStorage.getItem('auth_user') || 'null')?.role } catch { return null }
}

export default function ClientsPage() {
  const role = getLocalRole()
  const [list, setList] = useState<{ id: string; name: string; email: string }[]>([])

  useEffect(() => {
    getClients().then(setList)
  }, [])

  if (role !== 'admin') {
    return (
      <div className="space-y-6">
        <Card className="bg-ecotp-white" title="Accès restreint">
          <p className="text-black">Cette page est réservée aux administrateurs.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-ecotp-white" title="Clients">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-ecotp-gray-200">
                <th className="py-2 px-3">Nom</th>
                <th className="py-2 px-3">Email</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id} className="border-b border-ecotp-gray-100">
                  <td className="py-2 px-3">{c.name}</td>
                  <td className="py-2 px-3">{c.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}