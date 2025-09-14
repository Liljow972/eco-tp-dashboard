'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Euro, Users, Briefcase, TrendingUp, Eye, Search, Filter } from 'lucide-react'
import { 
  getCurrentUserDynamic, 
  getAllProjects,
  getAllClients,
  getProjectUpdatesByProjectId,
  getDocumentsByProjectId,
  type Project, 
  type Profile
} from '@/lib/mockData'

const AdminPage = () => {
  const [currentUser, setCurrentUser] = useState(getCurrentUserDynamic())
  const [projects, setProjects] = useState<Project[]>([])
  const [clients, setClients] = useState<Profile[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    const user = getCurrentUserDynamic()
    setCurrentUser(user)
    setProjects(getAllProjects())
    setClients(getAllClients())
  }, [])

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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div><h1 className="text-2xl font-bold text-gray-900">Espace Admin</h1><p className="text-sm text-gray-500">Tableau de bord - {currentUser.name}</p></div>
            <Link href="/" className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition">🏠 Accueil</Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"><div className="flex"><Eye className="h-5 w-5 text-green-400 mr-3 mt-0.5" /><div><h3 className="text-sm font-medium text-green-800">Mode MVP - Vue Admin</h3><p className="mt-1 text-sm text-green-700">Accès complet aux projets et clients • Utilisateur: <strong>{currentUser.name}</strong></p></div></div></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg"><div className="p-5"><div className="flex items-center"><Briefcase className="h-8 w-8 text-blue-600 mr-5" /><div><dt className="text-sm font-medium text-gray-500">Total Projets</dt><dd className="text-lg font-medium text-gray-900">{stats.totalProjects}</dd></div></div></div></div>
            <div className="bg-white overflow-hidden shadow rounded-lg"><div className="p-5"><div className="flex items-center"><Users className="h-8 w-8 text-green-600 mr-5" /><div><dt className="text-sm font-medium text-gray-500">Total Clients</dt><dd className="text-lg font-medium text-gray-900">{stats.totalClients}</dd></div></div></div></div>
            <div className="bg-white overflow-hidden shadow rounded-lg"><div className="p-5"><div className="flex items-center"><Euro className="h-8 w-8 text-purple-600 mr-5" /><div><dt className="text-sm font-medium text-gray-500">CA Total</dt><dd className="text-lg font-medium text-gray-900">{stats.totalBudget.toLocaleString('fr-FR')}€</dd></div></div></div></div>
            <div className="bg-white overflow-hidden shadow rounded-lg"><div className="p-5"><div className="flex items-center"><TrendingUp className="h-8 w-8 text-orange-600 mr-5" /><div><dt className="text-sm font-medium text-gray-500">Projets actifs</dt><dd className="text-lg font-medium text-gray-900">{stats.activeProjects}</dd></div></div></div></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg"><div className="px-4 py-5 sm:p-6"><h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Finances</h3><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={budgetChartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip formatter={(value) => [`${Number(value).toLocaleString('fr-FR')}€`, '']} /><Bar dataKey="value" /></BarChart></ResponsiveContainer></div></div></div>
            <div className="bg-white overflow-hidden shadow rounded-lg"><div className="px-4 py-5 sm:p-6"><h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Statuts</h3><div className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statusChartData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>{statusChartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} />))}</Pie><Tooltip /></PieChart></ResponsiveContainer></div></div></div>
          </div>
          <div className="bg-white shadow rounded-lg mb-6"><div className="px-4 py-5 sm:p-6"><div className="flex flex-col sm:flex-row gap-4"><div className="flex-1"><div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" /><input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div></div><div className="flex items-center gap-2"><Filter className="text-gray-400 h-4 w-4" /><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg"><option value="all">Tous</option><option value="pending">En attente</option><option value="in_progress">En cours</option><option value="completed">Terminé</option></select></div></div></div></div>
          <div className="bg-white shadow overflow-hidden sm:rounded-md"><div className="px-4 py-5 sm:px-6"><h3 className="text-lg leading-6 font-medium text-gray-900">Projets ({filteredProjects.length})</h3></div><ul className="divide-y divide-gray-200">{filteredProjects.map((project) => (<li key={project.id}><button onClick={() => setSelectedProject(project)} className="w-full text-left px-4 py-4 hover:bg-gray-50 transition"><div className="flex items-center justify-between"><div className="flex items-center"><div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4"><span className="text-blue-600 font-medium text-sm">{project.progress}%</span></div><div><div className="text-sm font-medium text-gray-900">{project.name}</div><div className="text-sm text-gray-500">Client: {getClientName(project.client_id)} • {project.budget.toLocaleString('fr-FR')}€</div></div></div><div className="flex items-center space-x-4"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>{getStatusLabel(project.status)}</span><div className="w-24"><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{ width: `${project.progress}%` }}></div></div></div></div></div></button></li>))}</ul></div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage