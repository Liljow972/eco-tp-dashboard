"use client"

import { Calendar, ChevronDown, CheckCircle, Circle, Play, Truck, Recycle, AlertCircle, RefreshCw } from 'lucide-react'

// Types
export interface Project {
    id: string
    name: string
    status: string
    progress: number
    client_id: string
    budget: number
    spent: number
    start_date: string
    end_date: string
    profiles?: {
        name: string
        email?: string
        company?: string
    }
    project_steps?: any[]
}

export interface TimelineStep {
    id: string
    name: string
    description: string
    status: 'pending' | 'in_progress' | 'completed'
    order_index: number
    project_id?: string
}

interface ProjectTimelineProps {
    project: Project
    allProjects?: Project[]
    onProjectChange?: (projectId: string) => void
    showProjectSelector?: boolean
    steps?: TimelineStep[]
    onStepClick?: (step: TimelineStep) => void
    isEditable?: boolean
}

const DEFAULT_STEPS: TimelineStep[] = [
    { id: '1', name: 'Lancement', description: 'Validation du projet', status: 'completed', order_index: 1 },
    { id: '2', name: 'Travaux', description: 'Exécution', status: 'in_progress', order_index: 2 },
    { id: '3', name: 'Livraison', description: 'Réception finale', status: 'pending', order_index: 3 },
]

export default function ProjectTimeline({
    project,
    allProjects = [],
    onProjectChange,
    showProjectSelector = false,
    steps = [],
    onStepClick,
    isEditable = false
}: ProjectTimelineProps) {

    // Use provided steps or default if empty (legacy support)
    const timelineSteps = steps.length > 0 ? steps : DEFAULT_STEPS

    // Sort steps by order
    const sortedSteps = [...timelineSteps].sort((a, b) => (a.order_index || 0) - (b.order_index || 0))

    // Determine current global status based on steps if not strictly provided? 
    // Actually, let's stick to the visual representation.

    const clientName = project.profiles?.name || project.profiles?.company || "Client"

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Suivi de Chantier</h1>
                    <p className="text-sm text-gray-500 mt-1">Détails et avancement en temps réel.</p>
                </div>

                {showProjectSelector && allProjects.length > 1 && (
                    <div className="relative min-w-[240px]">
                        <select
                            value={project.id}
                            onChange={(e) => onProjectChange?.(e.target.value)}
                            className="w-full appearance-none bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-ecotp-green-500 focus:border-ecotp-green-500 block p-2.5 pr-8 shadow-sm"
                        >
                            {allProjects.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                )}
            </div>

            {/* Main Progress Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                    <div className="space-y-4">
                        <div>
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-2">
                                {project.status === 'in_progress' ? "En cours d'exécution" : project.status === 'completed' ? "Terminé" : "En attente"}
                            </span>
                            <h2 className="text-3xl font-bold text-gray-900">{project.name}</h2>
                        </div>

                        <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-ecotp-green-100 flex items-center justify-center text-ecotp-green-700 font-bold">
                                    {clientName.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-gray-900 font-medium">Client</p>
                                    <p>{clientName}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 border-l border-gray-200 pl-6">
                                <Calendar className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-gray-900 font-medium">Début</p>
                                    <p>{project.start_date ? new Date(project.start_date).toLocaleDateString('fr-FR') : '-'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 border-l border-gray-200 pl-6">
                                <Calendar className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-gray-900 font-medium">Fin estimée</p>
                                    <p>{project.end_date ? new Date(project.end_date).toLocaleDateString('fr-FR') : '-'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end justify-center bg-gray-50 rounded-xl p-4 min-w-[200px]">
                        <p className="text-sm font-medium text-gray-500 mb-1">Progression globale</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-ecotp-green-600">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                                className="bg-ecotp-green-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${project.progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Timeline Steps */}
                <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-100"></div>
                    <div className="space-y-8 relative">
                        {sortedSteps.map((step, idx) => {
                            const isCompleted = step.status === 'completed'
                            const isInProgress = step.status === 'in_progress'
                            const isLast = idx === sortedSteps.length - 1

                            // Choose icon based on index or content? For now simple logic
                            const Icon = isCompleted ? CheckCircle : isInProgress ? RefreshCw : Circle

                            return (
                                <div
                                    key={step.id || idx}
                                    className={`relative flex items-start gap-4 group ${isEditable ? 'cursor-pointer hover:bg-gray-50 p-2 rounded-lg -ml-2 transition-colors' : ''}`}
                                    onClick={() => isEditable && onStepClick && onStepClick(step)}
                                >
                                    <div className={`
                            relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 transition-colors duration-300
                            ${isCompleted ? 'border-ecotp-green-100 bg-ecotp-green-500' : isInProgress ? 'border-blue-100 bg-white ring-2 ring-blue-500' : 'border-gray-50 bg-gray-100 text-gray-400'}
                         `}>
                                        <Icon className={`h-5 w-5 ${isCompleted ? 'text-white' : isInProgress ? 'text-blue-600 animate-spin-slow' : 'text-gray-400'}`} />
                                    </div>
                                    <div className={`flex-1 pt-1.5 ${!isLast ? 'pb-8 border-b border-gray-50' : ''}`}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className={`text-base font-semibold ${isCompleted || isInProgress ? 'text-gray-900' : 'text-gray-400'}`}>
                                                    {step.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                {isCompleted && (
                                                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                        Terminé
                                                    </span>
                                                )}
                                                {isInProgress && (
                                                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                        En cours
                                                    </span>
                                                )}
                                                {isEditable && (
                                                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                                                        {isCompleted ? 'Cliquez pour changer' : 'Cliquez pour avancer'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Alerts / Info Grid - MASQUÉ (non dynamique) 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-6 w-6 text-orange-500 shrink-0" />
                        <div>
                            <h3 className="font-semibold text-orange-900">Points d'attention</h3>
                            <p className="text-sm text-orange-700 mt-1">Le sol semble plus meuble que prévu sur la zone Nord. Une étude complémentaire rapide est en cours.</p>
                        </div>
                    </div>
                </div>
                <div className="bg-ecotp-green-50 rounded-2xl p-6 border border-ecotp-green-100">
                    <div className="flex items-start gap-3">
                        <Recycle className="h-6 w-6 text-ecotp-green-600 shrink-0" />
                        <div>
                            <h3 className="font-semibold text-ecotp-green-900">Impact Écologique</h3>
                            <p className="text-sm text-ecotp-green-700 mt-1">12 tonnes de terre excavée ont déjà été réutilisées pour le remblai local, économisant 4 trajets camion.</p>
                        </div>
                    </div>
                </div>
            </div>
            */}
        </div>
    )
}
