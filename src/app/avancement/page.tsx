'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import Card from '@/components/Card'
import { CheckCircle, Circle, Play, Truck, Recycle } from 'lucide-react'

interface Project {
  id: string
  name: string
  status: string
  progress: number
}

interface TimelineStep {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  completed: boolean
  current: boolean
}

// Données de démonstration
const demoProject: Project = {
  id: 'demo-project',
  name: 'Terrassement Résidence Les Chênes',
  status: 'in_progress',
  progress: 65
}

const AvancementPage = () => {
  const [project] = useState<Project | null>(demoProject)


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

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Avancement</h1>
            <Card>
              <div className="text-center py-12">
                <p className="text-gray-500">Aucun projet trouvé</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const timelineSteps = getTimelineSteps(project.progress)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Avancement du projet</h1>
          
          {/* Barre de progression globale */}
          <Card className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{project.name}</h2>
                <p className="text-sm text-gray-600">
                  Statut: <span className="font-medium">{getStatusText(project.status)}</span>
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-600">{project.progress}%</div>
                <div className="text-sm text-gray-500">Terminé</div>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${getStatusColor(project.status)}`}
                style={{ width: `${project.progress}%` }}
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