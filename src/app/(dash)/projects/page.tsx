"use client"
import { useEffect, useState } from 'react'
import Card from '@/components/Card'
import { getProjects, getClients, Project, ProjectStatus, Client } from '@/lib/mock'
import { AuthService } from '@/lib/auth'

export default function ProjectsPage() {
  const [items, setItems] = useState<Project[]>([])
  const [status, setStatus] = useState<ProjectStatus | 'all'>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [clientMap, setClientMap] = useState<Record<string, string>>({})
  const [currentUserName, setCurrentUserName] = useState<string>('')
  const [currentUserRole, setCurrentUserRole] = useState<'client' | 'admin' | 'unknown'>('unknown')

  const statusLabel: Record<ProjectStatus, string> = {
    pending: 'En attente',
    in_progress: 'En cours',
    completed: 'Terminé'
  }

  const refresh = async () => {
    const list = await getProjects({
      status: status === 'all' ? undefined : status,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    })
    setItems(list)
  }

  useEffect(() => { refresh() }, [status, dateFrom, dateTo])

  useEffect(() => {
    getClients().then((list: Client[]) => {
      const map: Record<string, string> = {}
      list.forEach(c => { map[c.id] = c.name })
      setClientMap(map)
    })
  }, [])

  useEffect(() => {
    const user = AuthService.getCurrentUser()
    setCurrentUserName(user?.name || '')
    setCurrentUserRole((user?.role as any) || 'unknown')
  }, [])

  return (
    <div className="space-y-6">
      <Card className="bg-ecotp-white" title="Filtres">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="status" className="text-black font-medium">Statut</label>
            <select id="status" className="mt-1 w-full border border-ecotp-gray-200 rounded px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value as any)}>
              <option value="all">Tous</option>
              <option value="pending">En attente</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminé</option>
            </select>
          </div>
          <div>
            <label htmlFor="from" className="text-black font-medium">Depuis</label>
            <input id="from" type="date" className="mt-1 w-full border border-ecotp-gray-200 rounded px-3 py-2" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>
          <div>
            <label htmlFor="to" className="text-black font-medium">Jusqu\'à</label>
            <input id="to" type="date" className="mt-1 w-full border border-ecotp-gray-200 rounded px-3 py-2" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
        </div>
      </Card>

      <Card className="bg-ecotp-white" title="Projets">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-ecotp-white border border-ecotp-gray-200 rounded">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-2 border-b border-ecotp-gray-200">Projet</th>
                <th className="px-4 py-2 border-b border-ecotp-gray-200">Statut</th>
                <th className="px-4 py-2 border-b border-ecotp-gray-200">Avancement</th>
                <th className="px-4 py-2 border-b border-ecotp-gray-200">Début</th>
                <th className="px-4 py-2 border-b border-ecotp-gray-200">Client</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="odd:bg-ecotp-gray-50">
                  <td className="px-4 py-2 border-b border-ecotp-gray-200 text-black">{p.name}</td>
                  <td className="px-4 py-2 border-b border-ecotp-gray-200 text-black">{statusLabel[p.status]}</td>
                  <td className="px-4 py-2 border-b border-ecotp-gray-200 text-black">
                    <div className="h-2 bg-ecotp-gray-200 rounded">
                      <div className="h-2 bg-ecotp-green rounded" style={{ width: `${p.progress}%` }} />
                    </div>
                    <span className="text-xs text-ecotp-gray-400">{p.progress}%</span>
                  </td>
                  <td className="px-4 py-2 border-b border-ecotp-gray-200 text-black">{p.startDate}</td>
                  <td className="px-4 py-2 border-b border-ecotp-gray-200 text-black">{currentUserRole === 'client' ? (currentUserName || (clientMap[p.clientId] ?? p.clientId)) : (clientMap[p.clientId] ?? p.clientId)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}