'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ModernLayout from '@/components/layout/ModernLayout'
import NewProjectModal from '@/components/admin/NewProjectModal'
import { Plus, Search, Filter, MoreVertical, Calendar, DollarSign, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react'

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
  created_at: string
  updated_at: string
  profiles?: {
    name: string
    email: string
  }
}

interface Client {
  id: string
  name: string
  email: string
  role: string
  created_at: string
  updated_at: string
}

export default function AdminProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)

  useEffect(() => {
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

    fetchProjects()
    fetchClients()
  }, [])

  const filteredProjects = projects.filter(project => {
    const client = clients.find(c => c.id === project.client_id)
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (client?.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getClientName = (project: Project) => {
    // Utiliser les données de la relation Supabase si disponibles
    if (project.profiles?.name) {
      return project.profiles.name
    }
    // Sinon, chercher dans la liste des clients
    const client = clients.find(c => c.id === project.client_id)
    return client?.name || 'Client inconnu'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Terminé'
      case 'in_progress':
        return 'En cours'
      case 'pending':
        return 'En attente'
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'in_progress':
        return <Clock className="w-4 h-4" />
      case 'pending':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0)
  const avgProgress = projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) : 0

  return (
    <ModernLayout userRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestion des Projets</h1>
            <p className="text-gray-600">Suivez et gérez tous vos projets en cours</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Projets</p>
                  <p className="text-3xl font-bold text-gray-900">{projects.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">En Cours</p>
                  <p className="text-3xl font-bold text-blue-600">{projects.filter(p => p.status === 'in_progress').length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Budget Total</p>
                  <p className="text-3xl font-bold text-green-600">{(totalBudget / 1000).toFixed(0)}K€</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Progression Moy.</p>
                  <p className="text-3xl font-bold text-purple-600">{avgProgress}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl shadow-lg mb-8">
            <div className="px-6 py-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Projets ({filteredProjects.length})</h3>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Rechercher un projet..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="in_progress">En cours</option>
                    <option value="completed">Terminé</option>
                  </select>
                  <button 
                    onClick={() => setShowNewProjectModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nouveau Projet</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Projects List */}
            <div className="p-6">
              <div className="grid gap-4">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                          <span className="text-white font-bold text-lg">{project.progress}%</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 mb-1">{project.name}</h4>
                          <p className="text-gray-600 mb-2">Client: {getClientName(project)}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Budget: {project.budget.toLocaleString('fr-FR')}€</span>
                            <span>Dépensé: {project.spent.toLocaleString('fr-FR')}€</span>
                            <span>Reste: {(project.budget - project.spent).toLocaleString('fr-FR')}€</span>
                          </div>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>Début: {new Date(project.start_date).toLocaleDateString('fr-FR')}</span>
                            <span>Fin: {new Date(project.end_date).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(project.status)}
                          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(project.status)}`}>
                            {getStatusLabel(project.status)}
                          </span>
                        </div>
                        
                        <div className="w-32">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progression</span>
                            <span>{project.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300" 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="w-32">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Budget</span>
                            <span>{Math.round((project.spent / project.budget) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full transition-all duration-300 ${
                                (project.spent / project.budget) > 0.8 
                                  ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                                  : 'bg-gradient-to-r from-green-500 to-blue-500'
                              }`}
                              style={{ width: `${Math.min((project.spent / project.budget) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => router.push(`/admin/projects/${project.id}`)}
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <NewProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onProjectCreated={async () => {
          setShowNewProjectModal(false)
          // Rafraîchir la liste des projets
          try {
            const response = await fetch('/api/projects')
            if (response.ok) {
              const projectsData = await response.json()
              setProjects(projectsData)
            }
          } catch (error) {
            console.error('Erreur lors du rafraîchissement des projets:', error)
          }
        }}
      />
    </ModernLayout>
  )
}