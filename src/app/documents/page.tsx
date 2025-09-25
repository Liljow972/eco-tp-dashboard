'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import Card from '@/components/Card'
import { FileText, Download, Upload, Calendar, User, FolderOpen } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Document {
  id: string
  project_id: string
  label: string
  type: 'contract' | 'invoice' | 'deliverable' | 'other'
  file_path: string
  file_size?: number
  mime_type?: string
  created_at: string
}

interface Project {
  id: string
  name: string
  status: string
  client_id: string
}

interface Client {
  id: string
  name: string
  company: string
}

const DocumentsPage = () => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Récupérer les documents
      const { data: documentsData, error: documentsError } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })

      if (documentsError) throw documentsError

      // Récupérer les projets
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')

      if (projectsError) throw projectsError

      // Récupérer les clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'client')

      if (clientsError) throw clientsError

      // Données fictives de fallback si la base de données est vide
      const fallbackProjects = [
        { id: 'proj-1', name: 'Terrassement Villa Moderne', status: 'in_progress', client_id: 'client-1' },
        { id: 'proj-2', name: 'Aménagement Paysager', status: 'pending', client_id: 'client-2' },
        { id: 'proj-3', name: 'Rénovation Terrain', status: 'completed', client_id: 'client-1' }
      ]

      const fallbackClients = [
        { id: 'client-1', name: 'Jean Dupont', company: 'Dupont Construction' },
        { id: 'client-2', name: 'Marie Martin', company: 'Martin Immobilier' }
      ]

      const fallbackDocuments = [
        {
          id: 'doc-1',
          project_id: 'proj-1',
          label: 'Contrat de terrassement',
          type: 'contract' as const,
          file_path: '/documents/contrat-terrassement.pdf',
          file_size: 2048000,
          created_at: new Date().toISOString()
        },
        {
          id: 'doc-2',
          project_id: 'proj-1',
          label: 'Facture matériaux',
          type: 'invoice' as const,
          file_path: '/documents/facture-materiaux.pdf',
          file_size: 1024000,
          created_at: new Date().toISOString()
        },
        {
          id: 'doc-3',
          project_id: 'proj-2',
          label: 'Plans d\'aménagement',
          type: 'deliverable' as const,
          file_path: '/documents/plans-amenagement.pdf',
          file_size: 5120000,
          created_at: new Date().toISOString()
        }
      ]

      setDocuments(documentsData?.length ? documentsData : fallbackDocuments)
      setProjects(projectsData?.length ? projectsData : fallbackProjects)
      setClients(clientsData?.length ? clientsData : fallbackClients)
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
      // En cas d'erreur, utiliser les données fictives
      const fallbackProjects = [
        { id: 'proj-1', name: 'Terrassement Villa Moderne', status: 'in_progress', client_id: 'client-1' },
        { id: 'proj-2', name: 'Aménagement Paysager', status: 'pending', client_id: 'client-2' }
      ]
      const fallbackClients = [
        { id: 'client-1', name: 'Jean Dupont', company: 'Dupont Construction' },
        { id: 'client-2', name: 'Marie Martin', company: 'Martin Immobilier' }
      ]
      const fallbackDocuments = [
        {
          id: 'doc-1',
          project_id: 'proj-1',
          label: 'Contrat de terrassement',
          type: 'contract' as const,
          file_path: '/documents/contrat-terrassement.pdf',
          file_size: 2048000,
          created_at: new Date().toISOString()
        }
      ]
      setDocuments(fallbackDocuments)
      setProjects(fallbackProjects)
      setClients(fallbackClients)
    } finally {
      setLoading(false)
    }
  }

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    return project ? project.name : 'Projet inconnu'
  }

  const getClientName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    if (!project) return 'Client inconnu'
    
    const client = clients.find(c => c.id === project.client_id)
    return client ? client.name || client.company : 'Client inconnu'
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    // Simulation d'upload
    setTimeout(() => {
      alert('Mode démonstration : Upload simulé avec succès !')
      setUploading(false)
      event.target.value = ''
    }, 2000)
  }

  const handleDownload = (document: Document) => {
    alert(`Mode démonstration : Téléchargement de "${document.label}" simulé`)
  }

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'contract': return 'Contrat'
      case 'invoice': return 'Facture'
      case 'deliverable': return 'Livrable'
      default: return 'Autre'
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Taille inconnue'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Documents</h1>
            <Card>
              <div className="text-center py-12">
                <p className="text-gray-500">Chargement des documents...</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
            
            <div className="relative">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <label
                htmlFor="file-upload"
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Upload en cours...' : 'Uploader un fichier'}
              </label>
            </div>
          </div>

          <Card>
            <div className="space-y-4">
              {documents.length > 0 ? (
                documents.map((document) => (
                  <div
                    key={document.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <FileText className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {document.label}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {getDocumentTypeLabel(document.type)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatFileSize(document.file_size)}
                          </span>
                          <span className="flex items-center text-xs text-gray-500">
                            <FolderOpen className="w-3 h-3 mr-1" />
                            {getProjectName(document.project_id)}
                          </span>
                          <span className="flex items-center text-xs text-gray-500">
                            <User className="w-3 h-3 mr-1" />
                            {getClientName(document.project_id)}
                          </span>
                          <span className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(document.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(document)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Aucun document
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Les documents seront affichés ici une fois que des projets auront été créés et que des fichiers auront été uploadés.
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Note: Cette fonctionnalité nécessite la configuration du stockage Supabase.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DocumentsPage