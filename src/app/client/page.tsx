'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Search, Filter, Download, Eye, 
  Calendar, DollarSign, TrendingUp, Clock,
  FileText, Image, Archive, User, Bell, Files, Euro,
  Home, Users, BarChart3, Settings, HelpCircle, Menu, X, ChevronDown, LogOut
} from 'lucide-react';
import FileManager from '@/components/files/FileManager';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { supabase } from '@/lib/supabase';

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
}

interface Client {
  id: string
  name: string
  email: string
  role: string
  created_at: string
  updated_at: string
}

interface ProjectUpdate {
  id: string
  project_id: string
  title: string
  description: string
  created_at: string
}

interface Document {
  id: string
  project_id: string
  label: string
  type: 'contract' | 'invoice' | 'deliverable' | 'other'
  file_path: string
  file_size?: number
  mime_type?: string
  created_at: string
}

export default function ClientPage() {
  const [currentUser, setCurrentUser] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projectUpdates, setProjectUpdates] = useState<ProjectUpdate[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer l'utilisateur actuel
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Récupérer le profil de l'utilisateur
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profile) {
            setCurrentUser(profile);
            
            // Récupérer tous les clients et projets
            const [clientsResponse, projectsResponse] = await Promise.all([
              supabase.from('profiles').select('*').eq('role', 'client'),
              supabase.from('projects').select('*')
            ]);

            if (clientsResponse.data) setClients(clientsResponse.data);
            if (projectsResponse.data) setProjects(projectsResponse.data);

            // Si l'utilisateur est un client, filtrer ses projets
            if (profile.role === 'client') {
              const userProjects = projectsResponse.data?.filter(p => p.client_id === profile.id) || [];
              setProjects(userProjects);
            }
          }
        } else {
          // Si pas d'utilisateur connecté, utiliser le premier client disponible pour la démo
          const { data: clientsData } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'client')
            .limit(1);

          if (clientsData && clientsData.length > 0) {
            setCurrentUser(clientsData[0]);
            
            const { data: projectsData } = await supabase
              .from('projects')
              .select('*')
              .eq('client_id', clientsData[0].id);

            if (projectsData) setProjects(projectsData);
          } else {
            // Données fictives si aucun client n'est trouvé
            const fallbackUser = {
              id: 'client-demo',
              name: 'Client Démo',
              email: 'demo@client.com',
              role: 'client',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            setCurrentUser(fallbackUser);
          }
        }

        // Ajouter des données fictives si aucun projet n'est trouvé
        if (projects.length === 0) {
          const fallbackProjects = [
            {
              id: 'proj-demo-1',
              name: 'Terrassement Villa Moderne',
              client_id: currentUser?.id || 'client-demo',
              status: 'in_progress' as const,
              progress: 65,
              budget: 25000,
              spent: 16250,
              start_date: '2024-01-15',
              end_date: '2024-03-15',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: 'proj-demo-2',
              name: 'Aménagement Paysager',
              client_id: currentUser?.id || 'client-demo',
              status: 'pending' as const,
              progress: 15,
              budget: 18000,
              spent: 2700,
              start_date: '2024-02-01',
              end_date: '2024-04-01',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ];
          setProjects(fallbackProjects);
        }

        // Ajouter des mises à jour fictives si aucune n'est trouvée
        if (projectUpdates.length === 0) {
          const fallbackUpdates = [
            {
              id: 'update-1',
              project_id: 'proj-demo-1',
              title: 'Début des travaux de terrassement',
              description: 'Les équipes ont commencé les travaux de préparation du terrain. Tout se déroule selon le planning prévu.',
              created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 'update-2',
              project_id: 'proj-demo-1',
              title: 'Avancement des travaux',
              description: 'Les travaux de terrassement sont à 65% d\'avancement. La météo favorable nous permet de respecter les délais.',
              created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            }
          ];
          setProjectUpdates(fallbackUpdates);
        }

        // Ajouter des documents fictifs si aucun n'est trouvé
        if (documents.length === 0) {
          const fallbackDocs = [
            {
              id: 'doc-demo-1',
              project_id: 'proj-demo-1',
              label: 'Contrat de terrassement',
              type: 'contract' as const,
              file_path: '/documents/contrat-terrassement.pdf',
              file_size: 2048000,
              created_at: new Date().toISOString()
            },
            {
              id: 'doc-demo-2',
              project_id: 'proj-demo-1',
              label: 'Facture matériaux',
              type: 'invoice' as const,
              file_path: '/documents/facture-materiaux.pdf',
              file_size: 1024000,
              created_at: new Date().toISOString()
            }
          ];
          setDocuments(fallbackDocs);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        // En cas d'erreur, utiliser des données fictives complètes
        const fallbackUser = {
          id: 'client-demo',
          name: 'Client Démo',
          email: 'demo@client.com',
          role: 'client',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setCurrentUser(fallbackUser);

        const fallbackProjects = [
          {
            id: 'proj-demo-1',
            name: 'Terrassement Villa Moderne',
            client_id: 'client-demo',
            status: 'in_progress' as const,
            progress: 65,
            budget: 25000,
            spent: 16250,
            start_date: '2024-01-15',
            end_date: '2024-03-15',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        setProjects(fallbackProjects);

        const fallbackUpdates = [
          {
            id: 'update-1',
            project_id: 'proj-demo-1',
            title: 'Début des travaux',
            description: 'Les travaux ont commencé selon le planning prévu.',
            created_at: new Date().toISOString()
          }
        ];
        setProjectUpdates(fallbackUpdates);

        const fallbackDocs = [
           {
             id: 'doc-demo-1',
             project_id: 'proj-demo-1',
             label: 'Contrat de terrassement',
             type: 'contract' as const,
             file_path: '/documents/contrat.pdf',
             file_size: 2048000,
             created_at: new Date().toISOString()
           }
         ];
         setDocuments(fallbackDocs);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const userProjects = projects;
  const totalBudget = userProjects.reduce((sum: number, project: Project) => sum + project.budget, 0);
  const avgProgress = userProjects.length > 0 ? Math.round(userProjects.reduce((sum: number, project: Project) => sum + project.progress, 0) / userProjects.length) : 0;
  
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement des données...</p>
        </div>
      </div>
    )
  }

  if (selectedProject) {
    // Pour l'instant, pas de mises à jour de projet ni de documents spécifiques
    const projectUpdates: ProjectUpdate[] = []
    const projectDocs: Document[] = []
    
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
                        <p className="text-sm text-gray-600 mt-1">{update.description}</p>
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
                              {doc.type} • {doc.file_size ? (doc.file_size / 1024).toFixed(1) + ' KB' : 'Taille inconnue'}
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
                <p className="text-sm text-gray-500">Espace Client - {currentUser?.name || 'Utilisateur'}</p>
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
                  <p>Vous consultez l'espace client avec les données de: <strong>{currentUser?.name || 'Utilisateur'}</strong></p>
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
                  {projectUpdates.length > 0 ? projectUpdates.map((update) => {
                    const project = userProjects.find(p => p.id === update.project_id)
                    return (
                      <div key={update.id} className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-medium text-gray-900">{update.title}</h4>
                        <p className="text-xs text-blue-600 mb-1">{project?.name}</p>
                        <p className="text-sm text-gray-600">{update.description.substring(0, 100)}...</p>
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