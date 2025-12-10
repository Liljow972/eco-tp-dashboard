"use client"
import { useEffect, useState } from 'react'
import { AuthService } from '@/lib/auth'
import ProjectTimeline, { Project, TimelineStep } from '@/components/ProjectTimeline'
import { supabase } from '@/lib/supabase'
import { Image as ImageIcon, MessageSquare, Lock, Eye, CloudSun } from 'lucide-react'
import PremiumCard from '@/components/premium/PremiumCard'

// Teaser Component (Client Version)
const PremiumTeaser = ({ title, description, icon: Icon, onDemoClick, isUnlocked }: any) => {
  if (isUnlocked) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center animate-fade-in">
        <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-ecotp-green-400 to-ecotp-green-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-ecotp-green-200">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title} (Aperçu)</h3>
        <p className="text-gray-500 mb-6">Demandez l'activation de ce module à votre chef de chantier.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 opacity-50 pointer-events-none select-none">
          {/* Fake Content */}
          {[1, 2, 3].map(i => <div key={i} className="aspect-square bg-gray-100 rounded-xl"></div>)}
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-8 text-center group">
      <div className="absolute inset-0 bg-grid-slate-50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <Lock className="w-8 h-8 text-gray-400" />
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-8">{description}</p>

      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium shadow-lg cursor-not-allowed opacity-80">
        <Lock className="w-4 h-4" />
        Option non activée
      </div>

      <button onClick={onDemoClick} className="absolute top-4 right-4 text-gray-200 hover:text-gray-400">
        <Eye className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  const [currentTab, setCurrentTab] = useState<'timeline' | 'photos' | 'messages' | 'weather'>('timeline')
  const [demoPremium, setDemoPremium] = useState(false)

  useEffect(() => {
    fetchClientProjects()
  }, [])

  const fetchClientProjects = async () => {
    try {
      // 1. Get current user
      const { data: { session } } = await supabase.auth.getSession()

      let fetchedProjects: Project[] = []

      if (session) {
        const { data, error } = await supabase
          .from('projects')
          .select(`
             *,
             profiles (
               name,
               company,
               email
             ),
             project_steps (*)
           `)
          .eq('client_id', session.user.id)
          .order('created_at', { ascending: false })

        if (data && !error) {
          fetchedProjects = data.map((p: any) => ({
            ...p,
            profiles: p.profiles // project_steps is already in p
          }))
        }
      }

      // 2. If no data/session, use Mock for Demo
      if (fetchedProjects.length === 0) {
        const mockProjects: any[] = [
          {
            id: 'proj-client-demo',
            name: 'Ma Villa - Terrassement (Démo)',
            status: 'in_progress',
            progress: 35,
            client_id: 'client-me',
            budget: 25000,
            spent: 8000,
            start_date: '2024-03-01',
            end_date: '2024-06-01',
            profiles: { name: 'Client Démo' },
            project_steps: []
          }
        ];
        fetchedProjects = mockProjects
      }

      setProjects(fetchedProjects)
      if (fetchedProjects.length > 0) setSelectedProjectId(fetchedProjects[0].id)
    } catch (err) {
      console.error("Error loading client projects:", err)
    } finally {
      setLoading(false)
    }
  }

  const selectedProject = projects.find(p => p.id === selectedProjectId)

  if (loading) return <div className="p-8 text-center text-gray-500">Chargement de votre dossier...</div>

  if (!selectedProject) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Aucun projet actif</h2>
        <p className="text-gray-500 mt-2">Vous n'avez pas encore de projet de terrassement en cours avec Eco TP.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon Espace Client</h1>
          <p className="text-sm text-gray-500 mt-1">Suivez l'avancement de vos travaux en temps réel.</p>
        </div>
      </div>

      {/* TABS Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setCurrentTab('timeline')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${currentTab === 'timeline'
              ? 'border-ecotp-green-500 text-ecotp-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Avancement
          </button>
          <button
            onClick={() => setCurrentTab('photos')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${currentTab === 'photos'
              ? 'border-ecotp-green-500 text-ecotp-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <ImageIcon className="w-4 h-4" />
            Photos
          </button>
          <button
            onClick={() => setCurrentTab('messages')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${currentTab === 'messages'
              ? 'border-ecotp-green-500 text-ecotp-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <MessageSquare className="w-4 h-4" />
            Messagerie
          </button>
          <button
            onClick={() => setCurrentTab('weather')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${currentTab === 'weather'
              ? 'border-ecotp-green-500 text-ecotp-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <CloudSun className="w-4 h-4" />
            Météo (Premium)
          </button>
        </nav>
      </div>

      {/* CONTENT AREA */}
      <div className="min-h-[400px]">
        {currentTab === 'timeline' && (
          <ProjectTimeline
            project={selectedProject}
            allProjects={projects}
            onProjectChange={setSelectedProjectId}
            showProjectSelector={projects.length > 1}
            steps={selectedProject.project_steps}
            isEditable={false} // Client Read-Only
          />
        )}

        {currentTab === 'photos' && (
          <PremiumTeaser
            title="Galerie Chantier"
            description="Cette option n'est pas activée sur votre dossier. Suivez l'évolution visuelle de votre chantier."
            icon={ImageIcon}
            isUnlocked={demoPremium}
            onDemoClick={() => setDemoPremium(!demoPremium)}
          />
        )}

        {currentTab === 'messages' && (
          <PremiumTeaser
            title="Messagerie Directe"
            description="Cette option n'est pas activée. Communiquez en direct avec votre chef de chantier ici."
            icon={MessageSquare}
            isUnlocked={demoPremium}
            onDemoClick={() => setDemoPremium(!demoPremium)}
          />
        )}

        {currentTab === 'weather' && (
          <PremiumCard
            title="Météo Predictive"
            description="Optimisez vos chantiers avec notre module d'analyse prédictive. Anticipez les retards météo et les coûts."
            buttonText="Passer en Premium"
            href="/premium-client-info" // Or modal, for now just reuse or custom
          />
        )}
      </div>
    </div>
  )
}