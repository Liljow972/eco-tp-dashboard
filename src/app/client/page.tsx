'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Search, Filter, Download, Eye, 
  Calendar, DollarSign, TrendingUp, Clock,
  FileText, Image, Archive, User, Bell, Files, Euro,
  Home, Users, BarChart3, Settings, HelpCircle, Menu, X, ChevronDown, LogOut
} from 'lucide-react';
import { mockProjects, mockProjectUpdates, mockDocuments, getCurrentUserDynamic, getProjectUpdatesByProjectId, getDocumentsByProjectId, type Project } from '@/lib/mockData';
import FileManager from '@/components/files/FileManager';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function ClientPage() {
  // Pour la page client, utilisons un client par défaut (Jean Dupont)
  const [currentUser, setCurrentUser] = useState(() => {
    const user = getCurrentUserDynamic();
    // Si l'utilisateur actuel n'est pas un client, utiliser le premier client disponible
    if (user.role !== 'client') {
      return { id: 'client-1', email: 'client@ecotp-demo.com', name: 'Jean Dupont', role: 'client' as const, created_at: '2024-01-02T00:00:00Z' };
    }
    return user;
  });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Filtrer les projets pour l'utilisateur actuel
  const userProjects = mockProjects.filter(project => 
    project.client_id === currentUser.id
  );

  // Filtrer les mises à jour pour les projets de l'utilisateur
  const userUpdates = mockProjectUpdates.filter(update => 
    userProjects.some(project => project.id === update.project_id)
  );

  // Filtrer les documents pour les projets de l'utilisateur
  const userDocuments = mockDocuments.filter(doc => 
    userProjects.some(project => project.id === doc.project_id)
  );

  const totalBudget = userProjects.reduce((sum, project) => sum + project.budget, 0);
  const avgProgress = userProjects.length > 0 ? Math.round(userProjects.reduce((sum, project) => sum + project.progress, 0) / userProjects.length) : 0;
  
  // Calculer les statistiques
  const stats = {
    budget: totalBudget,
    spent: Math.round(totalBudget * (avgProgress / 100)), // Estimation basée sur le progrès
    progress: avgProgress
  };

  const chartData = [
    {
      name: 'Budget',
      value: stats.budget,
      fill: '#22c55e'
    },
    {
      name: 'Dépensé',
      value: stats.spent,
      fill: '#ef4444'
    },
    {
      name: 'Restant',
      value: Math.max(0, stats.budget - stats.spent),
      fill: '#94a3b8'
    }
  ]

  // Charger les données du client actuel
  useEffect(() => {
    const user = getCurrentUserDynamic();
    setCurrentUser(user);
  }, []);

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

  if (selectedProject) {
    const projectUpdates = getProjectUpdatesByProjectId(selectedProject.id)
    const projectDocs = getDocumentsByProjectId(selectedProject.id)
    
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="mr-4 p-2 text-gray-400 hover:text-gray-600"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{selectedProject.name}</h1>
                  <p className="text-sm text-gray-500">Détails du projet</p>
                </div>
              </div>
              <Link
                href="/"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
              >
                🏠 Accueil
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Informations du projet */}
            <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Statut</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedProject.status)}`}>
                        {getStatusLabel(selectedProject.status)}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Avancement</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">{selectedProject.progress}%</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Budget</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">{selectedProject.budget.toLocaleString('fr-FR')}€</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Dépensé</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">{selectedProject.spent.toLocaleString('fr-FR')}€</dd>
                  </div>
                </div>
                
                <div className="mt-6">
                  <dt className="text-sm font-medium text-gray-500 mb-2">Barre de progression</dt>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${selectedProject.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mises à jour du projet */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Mises à jour</h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {projectUpdates.length > 0 ? projectUpdates.map((update) => (
                      <div key={update.id} className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-medium text-gray-900">{update.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{update.body}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(update.created_at).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    )) : (
                      <p className="text-gray-500 text-sm">Aucune mise à jour disponible</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Documents du projet */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Documents</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {projectDocs.length > 0 ? projectDocs.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{doc.label}</p>
                            <p className="text-xs text-gray-500">
                              {doc.type} • {(doc.file_size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    )) : (
                      <p className="text-gray-500 text-sm">Aucun document disponible</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">EcoTP</h1>
                <p className="text-sm text-gray-500">Espace Client - {currentUser.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Search className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="h-5 w-5" />
              </button>
              <Link
                href="/"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
              >
                🏠 Accueil
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
      {/* Navigation Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-1 bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-green-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Tableau de bord
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
            Mes Documents
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <div>
          {/* Alerte MVP */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <Eye className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Mode MVP - Vue Client
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Vous consultez l'espace client avec les données de: <strong>{currentUser.name}</strong></p>
                  <p>Retournez à l'accueil pour changer d'utilisateur de test.</p>
                </div>
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Euro className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Budget total</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.budget.toLocaleString('fr-FR')}€
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Dépensé</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.spent.toLocaleString('fr-FR')}€
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Avancement moyen</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.progress}%
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Projets actifs</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {userProjects.filter(p => p.status === 'in_progress').length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Graphique */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Répartition budgétaire</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${Number(value).toLocaleString('fr-FR')}€`, '']} />
                      <Bar dataKey="value" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Dernières mises à jour */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Dernières mises à jour</h3>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {userUpdates.length > 0 ? userUpdates.map((update) => {
                    const project = userProjects.find(p => p.id === update.project_id)
                    return (
                      <div key={update.id} className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-medium text-gray-900">{update.title}</h4>
                        <p className="text-xs text-blue-600 mb-1">{project?.name}</p>
                        <p className="text-sm text-gray-600">{update.body.substring(0, 100)}...</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(update.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    )
                  }) : (
                    <p className="text-gray-500 text-sm">Aucune mise à jour disponible</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Liste des projets */}
          <div className="mt-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Mes projets</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Cliquez sur un projet pour voir les détails
                </p>
              </div>
              <ul className="divide-y divide-gray-200">
                {userProjects.map((project) => (
                  <li key={project.id}>
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="w-full text-left px-4 py-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium text-sm">
                                {project.progress}%
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {project.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {project.budget.toLocaleString('fr-FR')}€ • {getStatusLabel(project.status)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                            {getStatusLabel(project.status)}
                          </span>
                          <div className="ml-4 w-24">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'files' && (
         <FileManager
           userRole="client"
           projectId="project-1"
         />
       )}
        </div>
      </div>
    </div>
  )
}