"use client"
import { useEffect, useState } from 'react'
import { AuthService } from '@/lib/auth'
import ProjectTimeline, { Project, TimelineStep } from '@/components/ProjectTimeline'
import { supabase } from '@/lib/supabase'
import { Image as ImageIcon, MessageSquare } from 'lucide-react'
import PhotoGallery from '@/components/PhotoGallery'
import Messaging from '@/components/Messaging'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  const [currentTab, setCurrentTab] = useState<'timeline' | 'photos' | 'messages'>('timeline')

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
          <PhotoGallery projectId={selectedProjectId} />
        )}

        {currentTab === 'messages' && (
          <Messaging
            projectId={selectedProjectId}
            clientId={selectedProject.client_id}
            clientName={selectedProject.profiles?.name}
          />
        )}
      </div>
    </div>
  )
}