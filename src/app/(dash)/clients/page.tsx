"use client"

import Card from '@/components/Card'
import { AuthService } from '@/lib/auth'
import { getClients } from '@/lib/mock'
import { useEffect, useState } from 'react'

export default function ClientsPage() {
  const user = AuthService.getCurrentUser()
  const [list, setList] = useState<{ id: string; name: string; email: string }[]>([])

  useEffect(() => {
    getClients().then(setList)
  }, [])

  if (user?.role !== 'admin') {
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