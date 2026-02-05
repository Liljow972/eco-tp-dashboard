"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import {
    Calendar, TrendingUp, DollarSign, Clock, ArrowRight, CheckCircle, AlertCircle
} from 'lucide-react'

interface ClientProject {
    id: string
    name: string
    status: string
    progress: number
    start_date: string
    end_date: string
    budget: number
    spent: number
}

export default function ClientDashboard() {
    const router = useRouter()
    const [userName, setUserName] = useState<string>('')
    const [projects, setProjects] = useState<ClientProject[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const init = async () => {
            const user = AuthService.getCurrentUser()
            if (!user) {
                router.push('/login')
                return
            }

            setUserName(user.name || 'Client')
            await fetchClientProjects(user.id)
        }
        init()
    }, [router])

    const fetchClientProjects = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('client_id', userId)
                .order('created_at', { ascending: false })

            if (error) throw error

            // Fallback avec projet de démo
            if (!data || data.length === 0) {
                setProjects([{
                    id: 'demo-1',
                    name: 'Terrassement Villa Moderne (Démo)',
                    status: 'in_progress',
                    progress: 65,
                    start_date: '2024-01-15',
                    end_date: '2024-03-15',
                    budget: 25000,
                    spent: 16250
                }])
            } else {
                setProjects(data)
            }
        } catch (err) {
            console.error('Error fetching projects:', err)
            // Projet de démo en cas d'erreur
            setProjects([{
                id: 'demo-1',
                name: 'Terrassement Villa Moderne (Démo)',
                status: 'in_progress',
                progress: 65,
                start_date: '2024-01-15',
                end_date: '2024-03-15',
                budget: 25000,
                spent: 16250
            }])
        } finally {
            setLoading(false)
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'in_progress': return 'En cours'
            case 'completed': return 'Terminé'
            case 'pending': return 'En attente'
            default: return status
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'in_progress': return 'bg-blue-100 text-blue-800'
            case 'completed': return 'bg-green-100 text-green-800'
            case 'pending': return 'bg-gray-100 text-gray-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    if (loading) {
        return <div className="p-8 text-center text-gray-500 animate-pulse">Chargement...</div>
    }

    // Calcul des stats basées sur les projets du client
    const activeProjects = projects.filter(p => p.status === 'in_progress').length
    const totalBudget = projects.reduce((acc, p) => acc + (p.budget || 0), 0)
    const totalSpent = projects.reduce((acc, p) => acc + (p.spent || 0), 0)
    const avgProgress = projects.length > 0
        ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)
        : 0

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Bonjour {userName} 👋</h1>
                <p className="text-gray-500 mt-2">Suivez l'avancement de vos travaux en temps réel.</p>
            </div>

            {/* KPIs - Version Client */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">Projets en cours</p>
                    <p className="text-3xl font-bold text-gray-900">{activeProjects}</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-50 rounded-xl">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">Avancement moyen</p>
                    <p className="text-3xl font-bold text-gray-900">{avgProgress}%</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-50 rounded-xl">
                            <DollarSign className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">Budget total</p>
                    <p className="text-3xl font-bold text-gray-900">{(totalBudget / 1000).toFixed(0)}k€</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-orange-50 rounded-xl">
                            <Clock className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">Dépensé</p>
                    <p className="text-3xl font-bold text-gray-900">{(totalSpent / 1000).toFixed(0)}k€</p>
                </div>
            </div>

            {/* Mes Projets */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Mes Projets</h2>
                    <p className="text-sm text-gray-500 mt-1">Cliquez sur un projet pour voir les détails</p>
                </div>

                <div className="divide-y divide-gray-100">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            onClick={() => router.push(`/avancement?project=${project.id}`)}
                            className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-ecotp-green-700 transition-colors">
                                            {project.name}
                                        </h3>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                            {getStatusLabel(project.status)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-6 text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>
                                                {project.start_date ? new Date(project.start_date).toLocaleDateString('fr-FR') : '—'}
                                                {' → '}
                                                {project.end_date ? new Date(project.end_date).toLocaleDateString('fr-FR') : '—'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4" />
                                            <span>{(project.spent / 1000).toFixed(1)}k€ / {(project.budget / 1000).toFixed(1)}k€</span>
                                        </div>
                                    </div>
                                </div>

                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-ecotp-green-600 group-hover:translate-x-1 transition-all" />
                            </div>

                            {/* Barre de progression */}
                            <div>
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-gray-600 font-medium">Avancement</span>
                                    <span className="text-gray-900 font-bold">{project.progress}%</span>
                                </div>
                                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-ecotp-green-500 to-ecotp-green-600 rounded-full transition-all duration-500"
                                        style={{ width: `${project.progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {projects.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>Aucun projet en cours</p>
                    </div>
                )}
            </div>
        </div>
    )
}
