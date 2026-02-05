'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Download, Trash2, FileText, File, Image, FileSpreadsheet } from 'lucide-react'

interface FileListProps {
  searchQuery?: string
  selectedOwner?: string
  selectedDate?: string
}

interface FileItem {
  id: string
  name: string
  size: number
  created_at: string
  file_path: string
  type?: string
  profiles?: {
    name: string
    company: string
  }
}

export default function FileList({ searchQuery, selectedOwner, selectedDate }: FileListProps) {
  const [items, setItems] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    try {
      setLoading(true)

      // 1. Récupérer les fichiers de localStorage (mode démo)
      const localFiles = localStorage.getItem('demo_files')
      let demoFiles: FileItem[] = []

      if (localFiles) {
        demoFiles = JSON.parse(localFiles)
      } else {
        // Fichiers de démo par défaut
        demoFiles = [
          {
            id: 'demo-1',
            name: 'Plan_Terrassement.pdf',
            size: 2048000,
            type: 'application/pdf',
            created_at: new Date().toISOString(),
            file_path: 'demo/plan.pdf',
            profiles: { name: 'Admin Demo', company: 'Eco TP' }
          },
          {
            id: 'demo-2',
            name: 'Devis_Villa.xlsx',
            size: 512000,
            type: 'application/vnd.ms-excel',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            file_path: 'demo/devis.xlsx',
            profiles: { name: 'Client Demo', company: 'Particulier' }
          }
        ]
        localStorage.setItem('demo_files', JSON.stringify(demoFiles))
      }

      // 2. Essayer de récupérer depuis Supabase
      try {
        const { data, error } = await supabase
          .from('documents')
          .select(`
              *,
              profiles (name, company)
          `)
          .order('created_at', { ascending: false })

        if (!error && data && data.length > 0) {
          // Si Supabase fonctionne, on utilise ses données
          setItems(data)
        } else {
          // Sinon, on utilise les fichiers locaux
          setItems(demoFiles)
        }
      } catch (supabaseError) {
        // Supabase non configuré, on utilise les fichiers locaux
        console.log('📁 Mode démo : Utilisation de localStorage')
        setItems(demoFiles)
      }
    } finally {
      setLoading(false)
    }
  }

  // Rafraîchir au montage
  useEffect(() => {
    refresh()
  }, [])

  // Filtrer les fichiers
  const filteredItems = items.filter(item => {
    let matches = true

    // Filtre par recherche
    if (searchQuery && searchQuery.trim() !== '') {
      matches = matches && item.name.toLowerCase().includes(searchQuery.toLowerCase())
    }

    // Filtre par propriétaire
    if (selectedOwner && selectedOwner !== 'Tous') {
      matches = matches && item.profiles?.name === selectedOwner
    }

    // Filtre par date
    if (selectedDate && selectedDate.trim() !== '') {
      const itemDate = new Date(item.created_at).toISOString().split('T')[0]
      matches = matches && itemDate === selectedDate
    }

    return matches
  })

  const handleDownload = (item: FileItem) => {
    // Simulation de téléchargement
    const link = document.createElement('a')
    link.href = '#'
    link.download = item.name
    alert(`Téléchargement de ${item.name} (simulation)`)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) return

    // Supprimer de localStorage
    const updatedItems = items.filter(item => item.id !== id)
    setItems(updatedItems)
    localStorage.setItem('demo_files', JSON.stringify(updatedItems))

    // Essayer de supprimer de Supabase
    supabase
      .from('documents')
      .delete()
      .eq('id', id)
      .then(() => console.log('Fichier supprimé de Supabase'))
      .catch(() => console.log('Supabase non configuré'))

    alert('Fichier supprimé avec succès !')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getFileIcon = (fileName: string, fileType?: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()

    if (fileType?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      return <Image className="w-5 h-5 text-blue-600" />
    }
    if (fileType?.includes('pdf') || ext === 'pdf') {
      return <FileText className="w-5 h-5 text-red-600" />
    }
    if (fileType?.includes('spreadsheet') || fileType?.includes('excel') || ['xlsx', 'xls', 'csv'].includes(ext || '')) {
      return <FileSpreadsheet className="w-5 h-5 text-green-600" />
    }
    return <File className="w-5 h-5 text-gray-600" />
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block w-8 h-8 border-4 border-ecotp-green-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-2 text-gray-600">Chargement...</p>
      </div>
    )
  }

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>Aucun fichier pour le moment.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nom
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Propriétaire
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Taille
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredItems.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {getFileIcon(item.name, item.type)}
                  <span className="text-sm font-medium text-gray-900">{item.name}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div>
                  <p className="text-sm text-gray-900">{item.profiles?.name || 'Inconnu'}</p>
                  <p className="text-xs text-gray-500">{item.profiles?.company || '-'}</p>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {formatFileSize(item.size)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {new Date(item.created_at).toLocaleDateString('fr-FR')}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleDownload(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Télécharger"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}