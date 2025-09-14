'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import Card from '@/components/Card'
import { FileText, Download, Upload, Calendar, User } from 'lucide-react'

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

// Données de démonstration
const demoDocuments: Document[] = [
  {
    id: '1',
    project_id: 'demo-project',
    label: 'Contrat de terrassement',
    type: 'contract',
    file_path: 'contrat-terrassement.pdf',
    file_size: 245760,
    mime_type: 'application/pdf',
    created_at: '2024-01-10T10:00:00Z'
  },
  {
    id: '2',
    project_id: 'demo-project',
    label: 'Facture acompte',
    type: 'invoice',
    file_path: 'facture-acompte.pdf',
    file_size: 156432,
    mime_type: 'application/pdf',
    created_at: '2024-01-15T14:30:00Z'
  },
  {
    id: '3',
    project_id: 'demo-project',
    label: 'Plan de terrassement',
    type: 'deliverable',
    file_path: 'plan-terrassement.pdf',
    file_size: 892156,
    mime_type: 'application/pdf',
    created_at: '2024-01-20T09:15:00Z'
  }
]

const DocumentsPage = () => {
  const [documents] = useState<Document[]>(demoDocuments)
  const [uploading, setUploading] = useState(false)

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
                    Commencez par uploader votre premier document.
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