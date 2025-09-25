'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { 
  Euro, Users, Briefcase, TrendingUp, Eye, Search, Filter, Bell, Settings, User, Home, 
  BarChart3, Upload, Plus, MoreVertical, Activity, Target, DollarSign, UserCheck, 
  AlertCircle, CheckCircle, XCircle, Zap, Clock, Files
} from 'lucide-react'
import { 
  getCurrentUserDynamic, 
  getAllProjects,
  getAllClients,
  getProjectUpdatesByProjectId,
  getDocumentsByProjectId,
  type Profile
} from '@/lib/mockData'

// Redéfinition locale du type Project pour éviter les conflits
interface ProjectLocal {
  id: string
  client_id: string
  name: string
  status: 'pending' | 'in_progress' | 'completed'
  progress: number
  budget: number
  spent: number
  start_date: string
  end_date: string
  created_at: string
}
import ModernLayout from '@/components/layout/ModernLayout'
import FileManager from '@/components/files/FileManager'
import NewClientModal from '@/components/admin/NewClientModal'

const AdminPage = () => {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(getCurrentUserDynamic())
  const [projects, setProjects] = useState<ProjectLocal[]>([])
  const [clients, setClients] = useState<Profile[]>([])
  const [selectedProject, setSelectedProject] = useState<ProjectLocal | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'projects' | 'files'>('overview')
  const [showFileManager, setShowFileManager] = useState(false)
  const [showNewClientModal, setShowNewClientModal] = useState(false)

  useEffect(() => {
    const user = getCurrentUserDynamic()
    setCurrentUser(user)
    setProjects(getAllProjects())
    setClients(getAllClients())
  }, [])

  const refreshClients = () => {
    setClients(getAllClients())
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    totalProjects: projects.length,
    totalClients: clients.length,
    totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    totalSpent: projects.reduce((sum, p) => sum + p.spent, 0),
    activeProjects: projects.filter(p => p.status === 'in_progress').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    pendingProjects: projects.filter(p => p.status === 'pending').length
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente'
      case 'in_progress': return 'En cours'
      case 'completed': return 'Terminé'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId)
    return client ? client.name : 'Client inconnu'
  }

  const budgetChartData = [
    { name: 'Budget total', value: stats.totalBudget, fill: '#22c55e' },
    { name: 'Dépensé', value: stats.totalSpent, fill: '#ef4444' },
    { name: 'Restant', value: Math.max(0, stats.totalBudget - stats.totalSpent), fill: '#94a3b8' }
  ]

  const statusChartData = [
    { name: 'En cours', value: stats.activeProjects, fill: '#3b82f6' },
    { name: 'Terminés', value: stats.completedProjects, fill: '#22c55e' },
    { name: 'En attente', value: stats.pendingProjects, fill: '#f59e0b' }
  ]

  const monthlyData = [
    { month: 'Jan', budget: 120, revenue: 95 },
    { month: 'Fév', budget: 180, revenue: 142 },
    { month: 'Mar', budget: 240, revenue: 198 },
    { month: 'Avr', budget: 150, revenue: 125 },
    { month: 'Mai', budget: 210, revenue: 175 },
    { month: 'Jun', budget: 270, revenue: 225 }
  ]

  if (selectedProject) {
    const projectUpdates = getProjectUpdatesByProjectId(selectedProject.id)
    const projectDocs = getDocumentsByProjectId(selectedProject.id)
    const client = clients.find(c => c.id === selectedProject.client_id)
    
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <button onClick={() => setSelectedProject(null)} className="mr-4 p-2 text-gray-400 hover:text-gray-600">← Retour</button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{selectedProject.name}</h1>
                  <p className="text-sm text-gray-500">Client: {client?.name}</p>
                </div>
              </div>
              <Link href="/" className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition">🏠 Accueil</Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <div><dt className="text-sm font-medium text-gray-500">Statut</dt><dd className="mt-1"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedProject.status)}`}>{getStatusLabel(selectedProject.status)}</span></dd></div>
                  <div><dt className="text-sm font-medium text-gray-500">Avancement</dt><dd className="mt-1 text-lg font-semibold text-gray-900">{selectedProject.progress}%</dd></div>
                  <div><dt className="text-sm font-medium text-gray-500">Budget</dt><dd className="mt-1 text-lg font-semibold text-gray-900">{selectedProject.budget.toLocaleString('fr-FR')}€</dd></div>
                  <div><dt className="text-sm font-medium text-gray-500">Dépensé</dt><dd className="mt-1 text-lg font-semibold text-gray-900">{selectedProject.spent.toLocaleString('fr-FR')}€</dd></div>
                  <div><dt className="text-sm font-medium text-gray-500">Dates</dt><dd className="mt-1 text-sm text-gray-900">{new Date(selectedProject.start_date).toLocaleDateString('fr-FR')} - {new Date(selectedProject.end_date).toLocaleDateString('fr-FR')}</dd></div>
                </div>
                <div className="mt-6"><dt className="text-sm font-medium text-gray-500 mb-2">Progression</dt><div className="w-full bg-gray-200 rounded-full h-3"><div className="bg-blue-600 h-3 rounded-full transition-all duration-300" style={{ width: `${selectedProject.progress}%` }}></div></div></div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white overflow-hidden shadow rounded-lg"><div className="px-4 py-5 sm:p-6"><h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Mises à jour</h3><div className="space-y-4 max-h-96 overflow-y-auto">{projectUpdates.length > 0 ? projectUpdates.map((update) => (<div key={update.id} className="border-l-4 border-blue-500 pl-4"><h4 className="font-medium text-gray-900">{update.title}</h4><p className="text-sm text-gray-600 mt-1">{update.body}</p><p className="text-xs text-gray-400 mt-2">{new Date(update.created_at).toLocaleDateString('fr-FR')}</p></div>)) : (<p className="text-gray-500 text-sm">Aucune mise à jour</p>)}</div></div></div>
              <div className="bg-white overflow-hidden shadow rounded-lg"><div className="px-4 py-5 sm:p-6"><h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Documents</h3><div className="space-y-3 max-h-96 overflow-y-auto">{projectDocs.length > 0 ? projectDocs.map((doc) => (<div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"><div><p className="text-sm font-medium text-gray-900">{doc.label}</p><p className="text-xs text-gray-500">{doc.type} • {(doc.file_size / 1024).toFixed(1)} KB</p></div><button className="text-blue-600 hover:text-blue-800 text-sm">Télécharger</button></div>)) : (<p className="text-gray-500 text-sm">Aucun document</p>)}</div></div></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ModernLayout
      title="Administration EcoTP"
      subtitle="Gérez vos clients et projets de terrassement"
      userRole="admin"
      userName="Administrateur"
    >
      {/* Navigation Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-1 bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-green-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'clients'
                ? 'bg-green-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Clients
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'projects'
                ? 'bg-green-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Projets
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'files'
                ? 'bg-green-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Files className="w-4 h-4 mr-2 inline" />
            Documents
          </button>
        </nav>
      </div>
        {/* File Manager Modal */}
        {showFileManager && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Gestionnaire de Documents</h2>
                <button
                  onClick={() => setShowFileManager(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <FileManager userRole="admin" projectId="" />
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'files' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Gestionnaire de Documents</h3>
              <button
                onClick={() => setShowFileManager(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Ouvrir le gestionnaire</span>
              </button>
            </div>
            <FileManager userRole="admin" projectId="" />
          </div>
        )}

        {activeTab === 'overview' && (
          <>
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Bonjour, {currentUser.name} 👋
              </h2>
              <p className="text-xl text-gray-600">
                Voici un aperçu de votre plateforme aujourd'hui.
              </p>
            </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-blue-600 text-sm font-medium">+12%</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalProjects}</h3>
            <p className="text-gray-600 text-sm">Total Projets</p>
            <div className="mt-3 flex items-center text-xs text-gray-500">
              <span className="text-green-600">↗ {stats.activeProjects} actifs</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-green-600 text-sm font-medium">+8%</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{(stats.totalBudget / 1000000).toFixed(1)}M€</h3>
            <p className="text-gray-600 text-sm">Chiffre d'Affaires</p>
            <div className="mt-3 flex items-center text-xs text-gray-500">
              <span className="text-green-600">↗ +15% ce mois</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-yellow-600 text-sm font-medium">+5%</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)}%</h3>
            <p className="text-gray-600 text-sm">Progression Moyenne</p>
            <div className="mt-3 flex items-center text-xs text-gray-500">
              <span className="text-yellow-600">→ Stable</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-purple-600 text-sm font-medium">+22%</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalClients}</h3>
            <p className="text-gray-600 text-sm">Clients Actifs</p>
            <div className="mt-3 flex items-center text-xs text-gray-500">
              <span className="text-purple-600">↗ 3 nouveaux</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Évolution des Revenus</h3>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">6M</button>
                <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">1A</button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none', 
                    borderRadius: '12px', 
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="budget" 
                  stroke="#3498DB" 
                  strokeWidth={3}
                  dot={{ fill: '#3498DB', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#3498DB', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#2ECC71" 
                  strokeWidth={3}
                  dot={{ fill: '#2ECC71', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#2ECC71', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Statut des Projets</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${value}`}
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {statusChartData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Clients Tab Content */}
        {(activeTab as string) === 'clients' && (
          <div className="bg-white rounded-2xl shadow-lg mb-8">
            <div className="px-6 py-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Gestion des Clients</h3>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                    <Filter className="w-4 h-4" />
                    <span>Filtrer</span>
                  </button>
                  <button 
                    onClick={() => setShowNewClientModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nouveau Client</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid gap-4">
                {clients.map((client) => {
                  const clientProjects = projects.filter(p => p.client_id === client.id)
                  const clientBudget = clientProjects.reduce((sum, p) => sum + p.budget, 0)
                  const clientProgress = clientProjects.length > 0 
                    ? Math.round(clientProjects.reduce((sum, p) => sum + p.progress, 0) / clientProjects.length)
                    : 0

                  return (
                    <div key={client.id} className="group border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center">
                            <span className="text-white font-bold text-xl">
                              {client.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-900 mb-1">{client.name}</h4>
                            <p className="text-gray-600">{client.email}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="flex items-center space-x-1 text-sm text-gray-500">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Actif</span>
                              </span>
                              <span className="text-sm text-gray-500">
                                Membre depuis {new Date().getFullYear() - 1}
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
                            <p className="text-xl font-bold text-gray-900">{clientProjects.length}</p>
                          </div>
                          <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                              <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <p className="text-sm text-gray-500 mb-1">Budget</p>
                            <p className="text-xl font-bold text-gray-900">{(clientBudget / 1000).toFixed(0)}K€</p>
                          </div>
                          <div className="text-center">
                            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                              <TrendingUp className="w-6 h-6 text-yellow-600" />
                            </div>
                            <p className="text-sm text-gray-500 mb-1">Progression</p>
                            <p className="text-xl font-bold text-gray-900">{clientProgress}%</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors font-medium">
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
        )}

        {/* Projects Tab Content */}
        {(activeTab as string) === 'projects' && (
          <div className="bg-white rounded-2xl shadow-lg mb-8">
            <div className="px-6 py-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Projets ({filteredProjects.length})</h3>
                <div className="flex items-center space-x-3">
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500">
                    <option value="all">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="in_progress">En cours</option>
                    <option value="completed">Terminé</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid gap-4">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-lg">{project.progress}%</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 mb-1">{project.name}</h4>
                          <p className="text-gray-600">Client: {getClientName(project.client_id)}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm text-gray-500">
                              Budget: {project.budget.toLocaleString('fr-FR')}€
                            </span>
                            <span className="text-sm text-gray-500">
                              Dépensé: {project.spent.toLocaleString('fr-FR')}€
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(project.status)}`}>
                          {getStatusLabel(project.status)}
                        </span>
                        <div className="w-32">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progression</span>
                            <span>{project.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300" style={{ width: `${project.progress}%` }}></div>
                          </div>
                        </div>
                        <button
                          onClick={() => router.push(`/admin/projects/${project.id}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors font-medium"
                        >
                          Voir Détails
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
          </>
        )}
        
        {/* Modal Nouveau Client */}
        <NewClientModal
          isOpen={showNewClientModal}
          onClose={() => setShowNewClientModal(false)}
          onClientCreated={refreshClients}
        />
    </ModernLayout>
  )
}

export default AdminPage