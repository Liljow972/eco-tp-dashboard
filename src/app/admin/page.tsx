'use client'

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

export default function AdminDashboardPage() {
  const [userName, setUserName] = useState<string>('')
  const [stats, setStats] = useState<KPIStats>({ activeProjects: 0, budget: 0, collaborators: 0, co2Saved: 0 })
  const [recentProjects, setRecentProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const user = await AuthService.getCurrentUser()
      setUserName(user?.name || 'Administrateur')

      // Sécurité basique : redirection si non admin (devrait être géré par middleware idéalement)
      if (user?.role !== 'admin') {
        // window.location.href = '/client' // Commenté pour éviter boucle si erreur, mais logique
      }
    }
    checkUser()
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch Projects
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (projectsError) throw projectsError

      // 2. Calculate Stats
      const active = projects?.filter(p => p.status === 'in_progress').length || 0
      const totalBudget = projects?.reduce((acc, curr) => acc + (curr.budget || 0), 0) || 0

      // 3. CO2 calculation (mock logic)
      const co2 = Math.round((totalBudget / 1000) * 0.5)

      // 4. Counts
      const clients = new Set(projects?.map(p => p.client_id)).size || 0

      setStats({
        activeProjects: active,
        budget: totalBudget,
        collaborators: clients > 0 ? clients : 0,
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-ecotp-green-600">
        <Activity className="w-8 h-8 animate-spin mr-2" />
        Chargement du tableau de bord...
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6 lg:p-10 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Tableau de bord Admin</h1>
          <p className="text-gray-500 mt-2 text-lg">
            Bienvenue, <span className="font-semibold text-ecotp-green-700">{userName}</span>. Voici la situation à ce jour.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
            <Calendar className="w-4 h-4" />
            Cette semaine
          </button>
          <a href="/avancement" className="inline-flex items-center gap-2 px-4 py-2 bg-ecotp-green-600 text-white rounded-lg text-sm font-medium hover:bg-ecotp-green-700 transition-all shadow-md hover:shadow-lg shadow-ecotp-green-900/20">
            <PlusCircle className="w-4 h-4" />
            Nouveau projet
          </a>
        </div>
      </div>

      {/* KPI BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1 - CO2 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-green-50 rounded-xl transition-all duration-300 group-hover:scale-110">
              <Leaf className="w-6 h-6 text-ecotp-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">CO2 Économisé</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.co2Saved} T</p>
          </div>
        </div>

        {/* KPI 2 - Projets */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-blue-50 rounded-xl transition-all duration-300 group-hover:scale-110">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <span className="flex items-center text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              En cours
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Chantiers Actifs</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeProjects}</p>
          </div>
        </div>

        {/* KPI 3 - Budget */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-orange-50 rounded-xl transition-all duration-300 group-hover:scale-110">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Budget Engagé</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{(stats.budget / 1000).toFixed(1)}k €</p>
          </div>
        </div>

        {/* KPI 4 - Clients */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-purple-50 rounded-xl transition-all duration-300 group-hover:scale-110">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Clients</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.collaborators}</p>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart (Area) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Performance Globale</h3>
              <p className="text-sm text-gray-500 mt-1">Avancement vs Budget (6 derniers mois)</p>
            </div>
          </div>
          <div className="h-[320px] w-full">
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
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#374151', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="avancement" stroke="#166534" strokeWidth={3} fillOpacity={1} fill="url(#colorAvancement)" name="Avancement %" />
                <Area type="monotone" dataKey="budget" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorBudget)" name="Budget k€" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Derniers Projets</h3>
            <a href="/avancement" className="text-sm text-ecotp-green-600 font-medium hover:text-ecotp-green-700 hover:underline">Voir tout</a>
          </div>

          <div className="flex-1 overflow-auto pr-2 custom-scrollbar">
            {recentProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <FileText className="w-12 h-12 mb-2 opacity-50" />
                <p>Aucun projet trouvé.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentProjects.map((proj, i) => (
                  <div key={i} className="flex gap-4 items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${proj.status === 'completed' ? 'bg-green-100 text-green-600' :
                        proj.status === 'in_progress' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">{proj.name}</h4>
                      <div className="flex items-center mt-1">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full mr-2">
                          <div className="h-1.5 bg-ecotp-green-500 rounded-full" style={{ width: `${proj.progress || 0}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-500">{proj.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}