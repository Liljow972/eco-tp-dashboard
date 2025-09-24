'use client'

import { useState, useEffect } from 'react'
import ModernLayout from '@/components/layout/ModernLayout'
import { TrendingUp, TrendingDown, DollarSign, Users, Calendar, Target, BarChart3, PieChart, Activity } from 'lucide-react'
import { getAllProjects, getAllClients } from '@/lib/mockData'

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

interface Client {
  id: string
  name: string
  email: string
  created_at: string
}

export default function AdminAnalyticsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [timeRange, setTimeRange] = useState('month')

  useEffect(() => {
    setProjects(getAllProjects())
    setClients(getAllClients())
  }, [])

  // Calculs des métriques
  const totalRevenue = projects.reduce((sum, p) => sum + p.spent, 0)
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)
  const avgProgress = projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) : 0
  const completedProjects = projects.filter(p => p.status === 'completed').length
  const activeProjects = projects.filter(p => p.status === 'in_progress').length
  const pendingProjects = projects.filter(p => p.status === 'pending').length

  // Données pour les graphiques (simulées)
  const monthlyData = [
    { month: 'Jan', revenue: 45000, projects: 8 },
    { month: 'Fév', revenue: 52000, projects: 12 },
    { month: 'Mar', revenue: 48000, projects: 10 },
    { month: 'Avr', revenue: 61000, projects: 15 },
    { month: 'Mai', revenue: 55000, projects: 13 },
    { month: 'Juin', revenue: 67000, projects: 18 },
  ]

  const projectsByStatus = [
    { status: 'Terminés', count: completedProjects, color: 'bg-green-500' },
    { status: 'En cours', count: activeProjects, color: 'bg-blue-500' },
    { status: 'En attente', count: pendingProjects, color: 'bg-yellow-500' },
  ]

  const topClients = clients.slice(0, 5).map(client => {
    const clientProjects = projects.filter(p => p.client_id === client.id)
    const clientRevenue = clientProjects.reduce((sum, p) => sum + p.spent, 0)
    return {
      ...client,
      projectCount: clientProjects.length,
      revenue: clientRevenue
    }
  }).sort((a, b) => b.revenue - a.revenue)

  return (
    <ModernLayout userRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics</h1>
                <p className="text-gray-600">Analysez les performances de votre entreprise</p>
              </div>
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="quarter">Ce trimestre</option>
                <option value="year">Cette année</option>
              </select>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Chiffre d'Affaires</p>
                  <p className="text-3xl font-bold text-gray-900">{(totalRevenue / 1000).toFixed(0)}K€</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-500 font-medium">+12.5%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Clients Actifs</p>
                  <p className="text-3xl font-bold text-gray-900">{clients.length}</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-blue-500 font-medium">+8.2%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Projets Actifs</p>
                  <p className="text-3xl font-bold text-gray-900">{activeProjects}</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-500 font-medium">-2.1%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Taux de Réussite</p>
                  <p className="text-3xl font-bold text-gray-900">{Math.round((completedProjects / projects.length) * 100)}%</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-500 font-medium">+5.3%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Évolution du Chiffre d'Affaires</h3>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {monthlyData.map((data, index) => (
                  <div key={data.month} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 w-12">{data.month}</span>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${(data.revenue / 70000) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-900 w-16 text-right">
                      {(data.revenue / 1000).toFixed(0)}K€
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects by Status */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Répartition des Projets</h3>
                <PieChart className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {projectsByStatus.map((item, index) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                      <span className="text-sm font-medium text-gray-600">{item.status}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${item.color} transition-all duration-300`}
                          style={{ width: `${(item.count / projects.length) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 w-8 text-right">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Clients */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Top Clients</h3>
                <Users className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {topClients.map((client, index) => (
                  <div key={client.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {client.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{client.name}</p>
                        <p className="text-sm text-gray-500">{client.projectCount} projet(s)</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{(client.revenue / 1000).toFixed(0)}K€</p>
                      <p className="text-sm text-gray-500">#{index + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Métriques de Performance</h3>
                <Activity className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Progression Moyenne</span>
                    <span className="text-sm font-bold text-gray-900">{avgProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${avgProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Utilisation Budget</span>
                    <span className="text-sm font-bold text-gray-900">{Math.round((totalRevenue / totalBudget) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(totalRevenue / totalBudget) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Taux de Completion</span>
                    <span className="text-sm font-bold text-gray-900">{Math.round((completedProjects / projects.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(completedProjects / projects.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{(totalBudget / 1000).toFixed(0)}K€</p>
                      <p className="text-sm text-gray-500">Budget Total</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{(totalRevenue / 1000).toFixed(0)}K€</p>
                      <p className="text-sm text-gray-500">Revenus</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModernLayout>
  )
}