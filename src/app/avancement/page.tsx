'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import Card from '@/components/Card'
import { CheckCircle, Circle, Play, Truck, Recycle, ChevronDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Project {
  id: string
  name: string
  status: string
  progress: number
  client_id: string
  budget: number
  spent: number
  start_date: string
  end_date: string
}

interface Client {
  id: string
  name: string
  email: string
  company: string
}

interface TimelineStep {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  completed: boolean
  current: boolean
}

const AvancementPage = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Récupérer les projets
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (projectsError) throw projectsError

      // Récupérer les clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'client')

      if (clientsError) throw clientsError

      // Données fictives de fallback si la base de données est vide
      const fallbackProjects = [
        {
          id: 'proj-1',
          name: 'Terrassement Villa Moderne',
          status: 'in_progress',
          progress: 65,
          client_id: 'client-1',
          budget: 25000,
          spent: 16250,
          start_date: '2024-01-15',
          end_date: '2024-03-15'
        },
        {
          id: 'proj-2',
          name: 'Aménagement Paysager',
          status: 'pending',
          progress: 15,
          client_id: 'client-2',
          budget: 18000,
          spent: 2700,
          start_date: '2024-02-01',
          end_date: '2024-04-01'
        },
        {
          id: 'proj-3',
          name: 'Rénovation Terrain',
          status: 'completed',
          progress: 100,
          client_id: 'client-1',
          budget: 12000,
          spent: 11800,
          start_date: '2023-11-01',
          end_date: '2024-01-01'
        }
      ]

      const fallbackClients = [
        { id: 'client-1', name: 'Jean Dupont', email: 'jean.dupont@email.com', company: 'Dupont Construction' },
        { id: 'client-2', name: 'Marie Martin', email: 'marie.martin@email.com', company: 'Martin Immobilier' }
      ]

      const finalProjects = projectsData?.length ? projectsData : fallbackProjects
      const finalClients = clientsData?.length ? clientsData : fallbackClients

      setProjects(finalProjects)
      setClients(finalClients)
      
      // Sélectionner le premier projet par défaut
      if (finalProjects && finalProjects.length > 0) {
        setSelectedProject(finalProjects[0])
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
      // En cas d'erreur, utiliser les données fictives
      const fallbackProjects = [
        {
          id: 'proj-1',
          name: 'Terrassement Villa Moderne',
          status: 'in_progress',
          progress: 65,
          client_id: 'client-1',
          budget: 25000,
          spent: 16250,
          start_date: '2024-01-15',
          end_date: '2024-03-15'
        }
      ]
      const fallbackClients = [
        { id: 'client-1', name: 'Jean Dupont', email: 'jean.dupont@email.com', company: 'Dupont Construction' }
      ]
      setProjects(fallbackProjects)
      setClients(fallbackClients)
      setSelectedProject(fallbackProjects[0])
    } finally {
      setLoading(false)
    }
  }

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId)
    return client ? client.name || client.company : 'Client inconnu'
  }


  const getTimelineSteps = (progress: number): TimelineStep[] => {
    return [
      {
        id: '1',
        name: 'Lancement',
        description: 'Validation du projet et préparation',
        icon: Play,
        completed: progress >= 20,
        current: progress >= 0 && progress < 20
      },
      {
        id: '2',
        name: 'Travaux',
        description: 'Réalisation des travaux de terrassement',
        icon: Circle,
        completed: progress >= 60,
        current: progress >= 20 && progress < 60
      },
      {
        id: '3',
        name: 'Finalisation',
        description: 'Finitions et contrôles qualité',
        icon: CheckCircle,
        completed: progress >= 80,
        current: progress >= 60 && progress < 80
      },
      {
        id: '4',
        name: 'Tri écologique',
        description: 'Tri et recyclage des matériaux',
        icon: Recycle,
        completed: progress >= 95,
        current: progress >= 80 && progress < 95
      },
      {
        id: '5',
        name: 'Livraison',
        description: 'Livraison finale du projet',
        icon: Truck,
        completed: progress >= 100,
        current: progress >= 95 && progress < 100
      }
    ]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'in_progress':
        return 'bg-blue-500'
      default:
        return 'bg-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Terminé'
      case 'in_progress':
        return 'En cours'
      case 'pending':
        return 'En attente'
      default:
        return 'Inconnu'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Avancement</h1>
            <Card>
              <div className="text-center py-12">
                <p className="text-gray-500">Chargement des projets...</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!selectedProject) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Avancement</h1>
            <Card>
              <div className="text-center py-12">
                <p className="text-gray-500">Aucun projet trouvé</p>
                <p className="text-sm text-gray-400 mt-2">
                  Créez un projet depuis la page d'administration pour voir son avancement ici.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const timelineSteps = getTimelineSteps(selectedProject.progress)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Avancement du projet</h1>
            
            {/* Sélecteur de projet */}
            {projects.length > 1 && (
              <div className="relative">
                <select
                  value={selectedProject.id}
                  onChange={(e) => {
                    const project = projects.find(p => p.id === e.target.value)
                    setSelectedProject(project || null)
                  }}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            )}
          </div>
          
          {/* Barre de progression globale */}
          <Card className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{selectedProject.name}</h2>
                <p className="text-sm text-gray-600">
                  Client: <span className="font-medium">{getClientName(selectedProject.client_id)}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Statut: <span className="font-medium">{getStatusText(selectedProject.status)}</span>
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-600">{selectedProject.progress}%</div>
                <div className="text-sm text-gray-500">Terminé</div>
                <div className="text-xs text-gray-400 mt-1">
                  Budget: {selectedProject.budget.toLocaleString()}€
                </div>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${getStatusColor(selectedProject.status)}`}
                style={{ width: `${selectedProject.progress}%` }}
              ></div>
            </div>
          </Card>

          {/* Timeline */}
          <Card title="Étapes du projet">
            <div className="flow-root">
              <ul className="-mb-8">
                {timelineSteps.map((step, stepIdx) => {
                  const Icon = step.icon
                  return (
                    <li key={step.id}>
                      <div className="relative pb-8">
                        {stepIdx !== timelineSteps.length - 1 ? (
                          <span
                            className={`absolute top-4 left-4 -ml-px h-full w-0.5 ${
                              step.completed ? 'bg-primary-600' : 'bg-gray-300'
                            }`}
                            aria-hidden="true"
                          />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span
                              className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                step.completed
                                  ? 'bg-primary-600'
                                  : step.current
                                  ? 'bg-blue-600'
                                  : 'bg-gray-400'
                              }`}
                            >
                              <Icon
                                className="h-4 w-4 text-white"
                                aria-hidden="true"
                              />
                            </span>
                          </div>
                          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                            <div>
                              <p className={`text-sm font-medium ${
                                step.completed || step.current ? 'text-gray-900' : 'text-gray-500'
                              }`}>
                                {step.name}
                                {step.current && (
                                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    En cours
                                  </span>
                                )}
                                {step.completed && (
                                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Terminé
                                  </span>
                                )}
                              </p>
                              <p className="text-sm text-gray-500">{step.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AvancementPage