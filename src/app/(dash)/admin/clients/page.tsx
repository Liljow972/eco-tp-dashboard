'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ModernLayout from '@/components/layout/ModernLayout'
import NewClientModal from '@/components/admin/NewClientModal'
import { Plus, Search, Filter, MoreVertical, Target, DollarSign, TrendingUp, CheckCircle, Mail, Phone, MapPin } from 'lucide-react'
interface Client {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  address?: string
  role: string
  created_at: string
  updated_at: string
}

interface Project {
  id: string
  name: string
  client_id: string
  status: 'pending' | 'in_progress' | 'completed'
  progress: number
  budget: number
  spent: number
  start_date: string
  end_date: string
}

export default function AdminClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showNewClientModal, setShowNewClientModal] = useState(false)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients')
        if (response.ok) {
          const clientsData = await response.json()
          setClients(clientsData)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des clients:', error)
      }
    }

    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        if (response.ok) {
          const projectsData = await response.json()
          setProjects(projectsData)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des projets:', error)
      }
    }

    fetchClients()
    fetchProjects()
  }, [])

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesSearch
  })

  const getClientStats = (clientId: string) => {
    const clientProjects = projects.filter(p => p.client_id === clientId)
    const totalBudget = clientProjects.reduce((sum, p) => sum + p.budget, 0)
    const totalSpent = clientProjects.reduce((sum, p) => sum + p.spent, 0)
    const avgProgress = clientProjects.length > 0 
      ? Math.round(clientProjects.reduce((sum, p) => sum + p.progress, 0) / clientProjects.length)
      : 0

    return {
      projectCount: clientProjects.length,
      totalBudget,
      totalSpent,
      avgProgress
    }
  }

  return (
    <ModernLayout userRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestion des Clients</h1>
            <p className="text-gray-600">Gérez vos clients et suivez leurs projets</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Clients</p>
                  <p className="text-3xl font-bold text-gray-900">{clients.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Clients Actifs</p>
                  <p className="text-3xl font-bold text-green-600">{clients.filter(c => c.status === 'active').length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Budget Total</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {(projects.reduce((sum, p) => sum + p.budget, 0) / 1000).toFixed(0)}K€
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Progression Moy.</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) : 0}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl shadow-lg mb-8">
            <div className="px-6 py-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Clients ({filteredClients.length})</h3>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Rechercher un client..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <button 
                    onClick={() => setShowNewClientModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nouveau Client</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Clients List */}
            <div className="p-6">
              <div className="grid gap-4">
                {filteredClients.map((client) => {
                  const stats = getClientStats(client.id)
                  
                  return (
                    <div key={client.id} className="group border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                            <span className="text-white font-bold text-xl">
                              {client.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-900 mb-1">{client.name}</h4>
                            <div className="flex items-center space-x-4 text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Mail className="w-4 h-4" />
                                <span>{client.email}</span>
                              </div>
                              {client.phone && (
                                <div className="flex items-center space-x-1">
                                  <Phone className="w-4 h-4" />
                                  <span>{client.phone}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                                Client
                              </span>
                              <span className="text-sm text-gray-500">
                                Membre depuis {new Date(client.created_at).getFullYear()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-8">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                              <Target className="w-6 h-6 text-blue-600" />
                            </div>
                            <p className="text-sm text-gray-500 mb-1">Projets</p>
                            <p className="text-xl font-bold text-gray-900">{stats.projectCount}</p>
                          </div>
                          <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                              <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <p className="text-sm text-gray-500 mb-1">Budget</p>
                            <p className="text-xl font-bold text-gray-900">{(stats.totalBudget / 1000).toFixed(0)}K€</p>
                          </div>
                          <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                              <TrendingUp className="w-6 h-6 text-purple-600" />
                            </div>
                            <p className="text-sm text-gray-500 mb-1">Progression</p>
                            <p className="text-xl font-bold text-gray-900">{stats.avgProgress}%</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => router.push(`/admin/clients/${client.id}`)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors font-medium"
                            >
                              Voir Détails
                            </button>
                            <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <NewClientModal
        isOpen={showNewClientModal}
        onClose={() => setShowNewClientModal(false)}
        onClientCreated={() => {
          setShowNewClientModal(false)
          // Rafraîchir la liste des clients
          const fetchClients = async () => {
            try {
              const response = await fetch('/api/clients')
              if (response.ok) {
                const clientsData = await response.json()
                setClients(clientsData)
              }
            } catch (error) {
              console.error('Erreur lors du rafraîchissement des clients:', error)
            }
          }
          fetchClients()
        }}
      />
    </ModernLayout>
  )
}