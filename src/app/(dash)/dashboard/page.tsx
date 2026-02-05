"use client"

import { useEffect, useState } from 'react'
import {
  Leaf, Activity, Users, ArrowUpRight, TrendingUp,
  FileText, DollarSign, Clock, MoreHorizontal, Calendar, PlusCircle
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { AuthService } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import ClientDashboard from '@/components/ClientDashboard'

// Types
interface KPIStats {
  activeProjects: number
  budget: number
  collaborators: number
  co2Saved: number
}

const dataArea = [
  { name: 'Jan', avancement: 10, budget: 15 },
  { name: 'Fév', avancement: 25, budget: 20 },
  { name: 'Mar', avancement: 45, budget: 35 },
  { name: 'Avr', avancement: 60, budget: 50 },
  { name: 'Mai', avancement: 75, budget: 65 },
  { name: 'Juin', avancement: 85, budget: 70 },
  { name: 'Juil', avancement: 100, budget: 90 },
];

const dataPie = [
  { name: 'Terrassement', value: 400 },
  { name: 'Fondations', value: 300 },
  { name: 'Finitions', value: 300 },
  { name: 'Autres', value: 200 },
];

const COLORS = ['#166534', '#22c55e', '#86efac', '#dcfce7'];

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>('')
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [stats, setStats] = useState<KPIStats>({ activeProjects: 0, budget: 0, collaborators: 0, co2Saved: 0 })
  const [recentProjects, setRecentProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = AuthService.getCurrentUser()
    setUserName(user?.name || 'Utilisateur')
    setIsAdmin(user?.role === 'admin')

    // Si client, on ne charge pas les stats admin
    if (user?.role !== 'admin') {
      setIsLoading(false)
      return
    }

    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch Projects
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*')

      if (projectsError) throw projectsError

      // 2. Calculate Stats
      const active = projects?.filter(p => p.status === 'in_progress').length || 0
      const totalBudget = projects?.reduce((acc, curr) => acc + (curr.budget || 0), 0) || 0

      // 3. CO2 calculation (mock logic based on progress/budget for demo)
      // 1000€ budget = ~0.5 Tonne CO2 saved via eco-methods (just a metric)
      const co2 = Math.round((totalBudget / 1000) * 0.5)

      // 4. Counts
      // Collaborators would typically be another query, for now use number of distinct clients
      const clients = new Set(projects?.map(p => p.client_id)).size || 0

      setStats({
        activeProjects: active,
        budget: totalBudget,
        collaborators: clients > 0 ? clients : 1, // At least the user
        co2Saved: co2
      })

      // 5. Recent Activity
      setRecentProjects(projects?.slice(0, 5) || [])

    } catch (error) {
      console.error("Error loading dashboard:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fallback / Loading State
  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Mise à jour du tableau de bord...</div>
  }

  // Si client, afficher le dashboard client
  if (!isAdmin) {
    return <ClientDashboard />
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-down">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 mt-1">
            Bienvenue, <span className="font-semibold text-ecotp-green-700">{userName}</span>. Voici ce qui se passe aujourd'hui.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 hover:shadow hover:-translate-y-0.5 shadow-sm active:translate-y-0">
            <Calendar className="w-4 h-4" />
            Cette semaine
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-ecotp-green-600 text-white rounded-lg text-sm font-medium hover:bg-ecotp-green-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 shadow-sm shadow-ecotp-green-900/20 active:translate-y-0">
            <PlusCircle className="w-4 h-4" />
            Nouveau projet
          </button>
        </div>
      </div>

      {/* KPI BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group hover:-translate-y-1 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-green-50 rounded-xl transition-all duration-300 group-hover:scale-110">
              <Leaf className="w-6 h-6 text-ecotp-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-gray-500 text-sm font-medium">CO2 Économisé</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.co2Saved} Tonnes</p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group hover:-translate-y-1 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-blue-50 rounded-xl transition-all duration-300 group-hover:scale-110">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <span className="flex items-center text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full animate-pulse-slow">
              En cours
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-gray-500 text-sm font-medium">Projets Actifs</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeProjects} Chantiers</p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group hover:-translate-y-1 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-orange-50 rounded-xl transition-all duration-300 group-hover:scale-110">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-gray-500 text-sm font-medium">Budget Engagé</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{(stats.budget / 1000).toFixed(1)}k €</p>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group hover:-translate-y-1 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-purple-50 rounded-xl transition-all duration-300 group-hover:scale-110">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-gray-500 text-sm font-medium">Clients / Acteurs</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.collaborators}</p>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
        {/* Main Chart (Area) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Performance Globale</h3>
              <p className="text-sm text-gray-500">Avancement cumulé vs Budget consommé</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-50 rounded-lg">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataArea} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAvancement" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#166534" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#166534" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <CartesianGrid vertical={false} stroke="#f3f4f6" />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="avancement" stroke="#166534" strokeWidth={3} fillOpacity={1} fill="url(#colorAvancement)" />
                <Area type="monotone" dataKey="budget" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorBudget)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Chart (Pie) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Répartition Budget</h3>
            <button className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-50 rounded-lg">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <div className="h-[300px] w-full flex flex-col justify-center items-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={dataPie}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ACTIVITY & DOCUMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Activité Récente</h3>
            <button className="text-sm text-ecotp-green-600 font-medium hover:text-ecotp-green-700">Voir tout</button>
          </div>

          {recentProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <FileText className="w-12 h-12 mb-2 opacity-50" />
              <p>Aucune activité récente.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {recentProjects.map((proj, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${proj.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                    <Activity className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900">{proj.name}</h4>
                    <p className="text-sm text-gray-500">Mise à jour: {proj.progress}% effectué</p>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">
                    {new Date(proj.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>


        {/* Projets Récents */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Projets Récents</h3>
            <a href="/avancement" className="text-sm text-ecotp-green-600 hover:text-ecotp-green-700 font-medium flex items-center gap-1">
              Voir tout
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {recentProjects.length > 0 ? (
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-ecotp-green-200 hover:bg-ecotp-green-50/30 transition-all cursor-pointer group">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 group-hover:text-ecotp-green-700 transition-colors">{project.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {project.start_date ? new Date(project.start_date).toLocaleDateString('fr-FR') : 'Date non définie'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{project.progress || 0}%</div>
                      <div className="w-24 h-2 bg-gray-100 rounded-full mt-1">
                        <div
                          className="h-2 bg-ecotp-green-500 rounded-full transition-all"
                          style={{ width: `${project.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${project.status === 'completed' ? 'bg-green-100 text-green-800' :
                      project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                      {project.status === 'in_progress' ? 'En cours' :
                        project.status === 'completed' ? 'Terminé' :
                          'En attente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Aucun projet récent</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}