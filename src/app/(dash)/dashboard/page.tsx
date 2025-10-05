"use client"
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Leaf, Activity, Users, ArrowRight, TrendingUp, FileText, User as UserIcon, Download, Play, Circle, CheckCircle, Recycle, Truck } from 'lucide-react'
import Card from '@/components/Card'
import { AuthService } from '@/lib/auth'
import { useSearchParams } from 'next/navigation'

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>('')
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'avancement'>('overview')
  const [projects, setProjects] = useState<any[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const searchParams = useSearchParams()

  useEffect(() => {
    const user = AuthService.getCurrentUser()
    setUserName(user?.name || 'Utilisateur')
    setIsAdmin(user?.role === 'admin')
    const tabParam = searchParams.get('tab')
    if (tabParam === 'avancement') setActiveTab('avancement')
  }, [])

  useEffect(() => {
    if (!isAdmin) return
    // Charger les projets pour l'aperçu et l'onglet avancement
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : []
        setProjects(list)
        setSelectedProjectId(list?.[0]?.id || '')
      })
      .catch(() => {})
  }, [isAdmin])

  const selectedProject = useMemo(() => {
    const list = Array.isArray(projects) ? projects : []
    return list.find((p: any) => p.id === selectedProjectId)
  }, [projects, selectedProjectId])

  // Éviter l'itération directe sur Set (compatibilité TS target)
  const uniqueClientNames = useMemo(() => {
    const names: string[] = []
    projects.forEach((p: any) => {
      const n = p?.profiles?.name
      if (n && !names.includes(n)) names.push(n)
    })
    return names
  }, [projects])

  if (isAdmin) {
    // Admin: reproduire le visuel demandé (bannière + KPI + fichiers)
    const heroURL = encodeURIComponent(
      'https://images.unsplash.com/photo-1602204097741-b2f8ef1c6845?q=80&w=1200&auto=format&fit=crop'
    )
    return (
      <div className="space-y-6">
        {/* Bannière de bienvenue */}
        <div
          className="relative rounded-xl overflow-hidden"
          aria-label="Bienvenue sur votre espace Eco TP"
        >
          <div className="bg-ecotp-green text-ecotp-white p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="sm:col-span-2">
              <h2 className="text-2xl sm:text-3xl font-bold">Bienvenue sur votre espace Eco TP</h2>
              <p className="mt-2 opacity-90">Gérez vos projets de terrassement écologique en toute simplicité</p>
            </div>
            <div
              className="rounded-lg h-28 sm:h-32 bg-center bg-cover"
              style={{ backgroundImage: `url('/api/image-proxy?url=${heroURL}')` }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg text-sm ${activeTab === 'overview' ? 'bg-ecotp-green text-white' : 'bg-ecotp-white text-black'} border border-ecotp-gray-200`}
          >
            Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveTab('avancement')}
            className={`px-4 py-2 rounded-lg text-sm ${activeTab === 'avancement' ? 'bg-ecotp-green text-white' : 'bg-ecotp-white text-black'} border border-ecotp-gray-200`}
          >
            Suivi en temps réel
          </button>
        </div>

        {activeTab === 'overview' && (
        <>
        {/* KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Projets actifs', value: 12 },
            { label: 'Tâches en cours', value: 28 },
            { label: 'Fichiers partagés', value: 164 },
            { label: 'Collaborateurs', value: 8 },
          ].map((kpi) => (
            <Card key={kpi.label} className="bg-ecotp-white">
              <p className="text-black/70 text-sm">{kpi.label}</p>
              <p className="text-ecotp-green text-2xl font-semibold mt-2">{kpi.value}</p>
            </Card>
          ))}
        </div>

        {/* Suivi des projets & Fichiers récents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-ecotp-white" title="Suivi des projets">
            <div className="h-40 md:h-56 rounded border border-ecotp-gray-200 flex items-center justify-center text-black/60">
              Graphiques et progression (placeholder)
            </div>
          </Card>
          <Card className="bg-ecotp-white" title="Fichiers récents">
            <ul className="space-y-3">
              {[
                { name: 'Plan_Terrassement_2023.pdf', type: 'pdf', color: 'text-red-600' },
                { name: 'Budget_Q1_2023.xlsx', type: 'xlsx', color: 'text-green-600' },
              ].map((file) => (
                <li key={file.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${file.type === 'pdf' ? 'bg-red-500' : 'bg-green-500'}`} />
                    <span className="text-black">{file.name}</span>
                  </div>
                  <button className="p-1 rounded hover:bg-ecotp-gray-100" title="Télécharger">
                    <Download className="h-4 w-4 text-ecotp-green" />
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </div>
        {/* Filtres + Aperçu table projets pour ressembler au visuel */}
        <Card className="bg-ecotp-white" title="Filtres">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-black font-medium">Statut</label>
              <select className="mt-1 w-full border border-ecotp-gray-200 rounded px-3 py-2">
                <option>Tous</option>
                <option>En cours</option>
                <option>Terminé</option>
              </select>
            </div>
            <div>
              <label className="text-black font-medium">Depuis</label>
              <input type="date" className="mt-1 w-full border border-ecotp-gray-200 rounded px-3 py-2" />
            </div>
            <div>
              <label className="text-black font-medium">Jusqu'à</label>
              <input type="date" className="mt-1 w-full border border-ecotp-gray-200 rounded px-3 py-2" />
            </div>
            <div>
              <label className="text-black font-medium">Client</label>
              <select className="mt-1 w-full border border-ecotp-gray-200 rounded px-3 py-2">
                <option>Tous</option>
                {uniqueClientNames.map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>
        <Card className="bg-ecotp-white" title="Projets">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-black">
                  <th className="px-4 py-2">Projet</th>
                  <th className="px-4 py-2">Statut</th>
                  <th className="px-4 py-2">Avancement</th>
                  <th className="px-4 py-2">Début</th>
                  <th className="px-4 py-2">Client</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(projects) ? projects : []).map((p) => (
                  <tr key={p.id} className="border-t border-ecotp-gray-200">
                    <td className="px-4 py-3 text-black">{p.name}</td>
                    <td className="px-4 py-3 text-black/80 capitalize">{p.status?.replace('_', ' ')}</td>
                    <td className="px-4 py-3">
                      <div className="w-56 h-2 bg-ecotp-gray-200 rounded-full">
                        <div className="h-2 bg-ecotp-green rounded-full" style={{ width: `${p.progress || 0}%` }} />
                      </div>
                      <div className="text-ecotp-green text-xs mt-1">{p.progress || 0}%</div>
                    </td>
                    <td className="px-4 py-3 text-black/80">{p.start_date || '-'}</td>
                    <td className="px-4 py-3 text-black">{p.profiles?.name || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        </>
        )}

        {activeTab === 'avancement' && (
          <>
            <Card className="bg-ecotp-white" title={selectedProject ? selectedProject.name : 'Avancement du projet'}>
              <div className="flex items-center justify-between">
                <div className="text-black/80">
                  Client: {selectedProject?.profiles?.name || '—'}<br />
                  Statut: {selectedProject?.status || '—'}
                </div>
                <div className="text-right">
                  <p className="text-ecotp-green text-2xl font-semibold">{selectedProject?.progress || 0}%</p>
                  <p className="text-black/60 text-sm">Terminé</p>
                </div>
              </div>
              <div className="mt-3 w-full bg-ecotp-gray-200 rounded-full h-3">
                <div className="h-3 bg-ecotp-green rounded-full" style={{ width: `${selectedProject?.progress || 0}%` }} />
              </div>
            </Card>
            <Card className="bg-ecotp-white" title="Étapes du projet">
              <div className="space-y-6">
                {[
                  { name: 'Lancement', desc: 'Validation du projet et préparation', icon: Play, threshold: 20 },
                  { name: 'Travaux', desc: 'Réalisation des travaux de terrassement', icon: Circle, threshold: 60 },
                  { name: 'Finalisation', desc: 'Finitions et contrôles qualité', icon: CheckCircle, threshold: 80 },
                  { name: 'Tri écologique', desc: 'Tri et recyclage des matériaux', icon: Recycle, threshold: 95 },
                  { name: 'Livraison', desc: 'Livraison finale du projet', icon: Truck, threshold: 100 },
                ].map((step, idx) => {
                  const Icon = step.icon
                  const progress = selectedProject?.progress || 0
                  const completed = progress >= step.threshold
                  const current = progress < step.threshold && (idx === 0 || progress >= (step.threshold - 40))
                  return (
                    <div key={step.name} className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${completed ? 'bg-ecotp-green/20 text-ecotp-green' : current ? 'bg-ecotp-green/10 text-ecotp-green' : 'bg-ecotp-gray-200 text-black/50'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="text-black font-medium">{step.name}</p>
                          {completed && (
                            <span className="text-xs bg-ecotp-green/15 text-ecotp-green px-2 py-0.5 rounded-full">Terminé</span>
                          )}
                          {current && !completed && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">En cours</span>
                          )}
                        </div>
                        <p className="text-black/70">{step.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </>
        )}
      </div>
    )
  }

  // Client: vue d'ensemble simple (projets, documents, paramètres)
  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-bold text-ecotp-green">Bonjour, {userName} 👋</h2>
        <p className="text-black/70">Voici un aperçu rapide de votre plateforme.</p>
      </div>

      {/* Héros / raccourcis */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="bg-ecotp-white">
          <div className="flex items-start gap-3">
            <Activity className="h-6 w-6 text-ecotp-green" aria-hidden />
            <div>
              <h3 className="text-ecotp-green font-semibold">Mes Projets</h3>
              <p className="text-black/80">Suivi d’avancement et planning.</p>
              <Link href="/projects" className="mt-3 inline-flex items-center gap-2 px-3 py-2 bg-ecotp-green text-white rounded focus:outline-none focus:ring-2 focus:ring-ecotp-green/60">
                Ouvrir <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Card>
        <Card className="bg-ecotp-white">
          <div className="flex items-start gap-3">
            <FileText className="h-6 w-6 text-ecotp-green" aria-hidden />
            <div>
              <h3 className="text-ecotp-green font-semibold">Documents</h3>
              <p className="text-black/80">Contrats, devis, livrables.</p>
              <Link href="/files" className="mt-3 inline-flex items-center gap-2 px-3 py-2 bg-ecotp-green text-white rounded focus:outline-none focus:ring-2 focus:ring-ecotp-green/60">
                Ouvrir <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Card>
        <Card className="bg-ecotp-white">
          <div className="flex items-start gap-3">
            <UserIcon className="h-6 w-6 text-ecotp-green" aria-hidden />
            <div>
              <h3 className="text-ecotp-green font-semibold">Paramètres</h3>
              <p className="text-black/80">Profil et préférences.</p>
              <Link href="/settings" className="mt-3 inline-flex items-center gap-2 px-3 py-2 bg-ecotp-green text-white rounded focus:outline-none focus:ring-2 focus:ring-ecotp-green/60">
                Ouvrir <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}