"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import ProjectTimeline, { Project, TimelineStep } from '@/components/ProjectTimeline'
import Modal from '@/components/ui/Modal'
import ProjectForm from '@/components/admin/ProjectForm'
import PremiumCard from '@/components/premium/PremiumCard'

import { ArrowLeft, Search, Filter, Plus, Edit, Wand2, Image as ImageIcon, MessageSquare, Lock, Eye, CloudSun } from 'lucide-react'

// Teaser Components
const PremiumTeaser = ({ title, description, icon: Icon, onDemoClick, isUnlocked }: any) => {
  if (isUnlocked) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center animate-fade-in">
        <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-ecotp-green-400 to-ecotp-green-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-ecotp-green-200">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title} (Mode Démo)</h3>
        <p className="text-gray-500 mb-6">Voici à quoi ressemblera le module une fois activé.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 opacity-50 pointer-events-none select-none">
          {/* Fake Content for background feel */}
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
        Module Premium
      </div>

      <button onClick={onDemoClick} className="absolute top-4 right-4 text-gray-200 hover:text-gray-400">
        <Eye className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function AvancementPage() {
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list')
  const [currentTab, setCurrentTab] = useState<'timeline' | 'photos' | 'messages' | 'weather'>('timeline')
  const [demoPremium, setDemoPremium] = useState(false) // Secret toggle

  const [projects, setProjects] = useState<any[]>([]) // Using any to accomodate mixed types during initial dev
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<any>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
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
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching projects:', error)
      }

      if (data && data.length > 0) {
        setProjects(data)
      } else {
        const fallbackProjects: Project[] = [
          {
            id: 'demo-1',
            name: 'Terrassement Villa Moderne (Démo)',
            status: 'in_progress',
            progress: 65,
            client_id: 'client-1',
            budget: 25000,
            spent: 16250,
            start_date: '2024-01-15',
            end_date: '2024-03-15',
            profiles: { name: 'Jean Dupont' },
            project_steps: []
          },
        ]
        setProjects(fallbackProjects)
      }
    } catch (err) {
      console.error("Unexpected error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id)
    setViewMode('detail')
    setCurrentTab('timeline') // Reset tab
    setDemoPremium(false) // Reset demo
  }

  const handleBack = () => {
    setViewMode('list')
    setSelectedProjectId('')
  }

  // STEP INTERACTION
  const handleStepClick = async (step: TimelineStep) => {
    // Toggle logic: pending -> in_progress -> completed -> pending
    const current = step.status
    let next: 'pending' | 'in_progress' | 'completed' = 'in_progress'
    if (current === 'in_progress') next = 'completed'
    if (current === 'completed') next = 'pending'

    // Optimistic Update (Optional)

    try {
      // Check if step is real (has ID and belongs to DB)
      if (step.id && (parseInt(step.id) > 1000 || step.id.length > 10)) { // UUID check roughly
        const { error } = await supabase
          .from('project_steps')
          .update({ status: next })
          .eq('id', step.id)

        if (error) throw error

        // Refresh data
        fetchProjects()
      } else {
        alert("Impossible de modifier une étape de démonstration.")
      }
    } catch (err) {
      console.error("Error updating step", err)
    }
  }

  const handleGenerateSteps = async () => {
    if (!selectedProjectId) return

    const defaultSteps = [
      { name: 'Préparation du terrain', description: 'Implantation, sécurisation et balisage', status: 'completed', order_index: 0 },
      { name: 'Terrassement', description: 'Décapage et excavation des terres', status: 'in_progress', order_index: 1 },
      { name: 'Assainissement', description: 'Pose des réseaux et raccordements', status: 'pending', order_index: 2 },
      { name: 'Remblaiement', description: 'Mise à niveau du sol', status: 'pending', order_index: 3 },
      { name: 'Finitions', description: 'Nettoyage et repli du chantier', status: 'pending', order_index: 4 },
    ]

    try {
      const stepsToInsert = defaultSteps.map(s => ({
        project_id: selectedProjectId,
        ...s
      }))

      const { error } = await supabase.from('project_steps').insert(stepsToInsert)
      if (error) throw error

      fetchProjects()
    } catch (err) {
      console.error("Error generating steps:", err)
      alert("Erreur lors de la génération des étapes.")
    }
  }

  // FORM HANDLERS
  const handleCreate = () => {
    setEditingProject(null)
    setIsModalOpen(true)
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setIsModalOpen(true)
  }

  const handleFormSuccess = () => {
    setIsModalOpen(false)
    fetchProjects()
  }

  const selectedProject = projects.find(p => p.id === selectedProjectId)

  if (loading) return <div className="p-8 text-center text-gray-500">Chargement...</div>

  return (
    <>
      {/* GLOBAL LIST VIEW */}
      {viewMode === 'list' && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Suivi Global des Chantiers</h1>
              <p className="text-sm text-gray-500 mt-1">Vue d'ensemble de tous les projets en cours.</p>
            </div>
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-ecotp-green-600 text-white rounded-lg text-sm font-medium hover:bg-ecotp-green-700 transition-colors shadow-lg shadow-ecotp-green-900/20"
            >
              <Plus className="w-4 h-4" />
              Nouveau Chantier
            </button>
          </div>

          {/* Project List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un projet..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ecotp-green-500/20 focus:border-ecotp-green-500 transition-all"
                />
              </div>
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtres
              </button>
            </div>
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 font-medium">
                  <th className="px-6 py-3">Projet</th>
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Statut</th>
                  <th className="px-6 py-3">Progression</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer" onClick={() => handleSelectProject(proj.id)}>
                    <td className="px-6 py-4 font-medium text-gray-900">{proj.name}</td>
                    <td className="px-6 py-4 text-gray-500">{proj.profiles?.name || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${proj.status === 'completed' ? 'bg-green-100 text-green-800' :
                        proj.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                        {proj.status === 'in_progress' ? 'En cours' : proj.status === 'completed' ? 'Terminé' : 'En attente'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full w-24">
                          <div className="h-2 bg-ecotp-green-500 rounded-full" style={{ width: `${proj.progress}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-600 font-medium">{proj.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-ecotp-green-600 hover:text-ecotp-green-700 font-medium text-xs">
                        Voir détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAILED VIEW */}
      {viewMode === 'detail' && selectedProject && (
        <div className="space-y-6">
          {/* HEADER NAV */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">{selectedProject.name}</h1>
            </div>

            <div className="flex gap-2">
              {/* Generation Button */}
              {(!selectedProject.project_steps || selectedProject.project_steps.length === 0) && (
                <button
                  onClick={handleGenerateSteps}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <Wand2 className="w-4 h-4" />
                  Générer étapes
                </button>
              )}
              <button
                onClick={() => handleEdit(selectedProject)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-ecotp-green-700 bg-ecotp-green-50 rounded-lg hover:bg-ecotp-green-100 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </button>
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
                Timeline & Avancement
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
                showProjectSelector={false} // Hidden in detail mode
                steps={selectedProject.project_steps}
                onStepClick={handleStepClick}
                isEditable={true}
              />
            )}

            {currentTab === 'photos' && (
              <PremiumTeaser
                title="Galerie Chantier"
                description="Permettez à vos clients de suivre l'évolution de leur chantier en images, étape par étape. Un gage de confiance absolu."
                icon={ImageIcon}
                isUnlocked={demoPremium}
                onDemoClick={() => setDemoPremium(!demoPremium)}
              />
            )}

            {currentTab === 'messages' && (
              <PremiumTeaser
                title="Messagerie Contextuelle"
                description="Centralisez tous les échanges liés à ce chantier. Fini les SMS perdus, gardez une trace professionnelle de chaque décision."
                icon={MessageSquare}
                isUnlocked={demoPremium}
                onDemoClick={() => setDemoPremium(!demoPremium)}
              />
            )}

            {currentTab === 'weather' && (
              <PremiumCard />
            )}
          </div>
        </div>
      )}

      {/* MODAL & FORM */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? "Modifier le chantier" : "Nouveau chantier"}
      >
        <ProjectForm
          initialData={editingProject}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  )
}