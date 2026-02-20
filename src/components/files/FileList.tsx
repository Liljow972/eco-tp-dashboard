'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Download, Trash2, FileText, File, Image, FileSpreadsheet, Eye, PenTool, X, Loader2, CheckCircle } from 'lucide-react'
import SignatureModal from '@/components/documents/SignatureModal'

interface FileListProps {
  searchQuery?: string
  selectedOwner?: string
  selectedDate?: string
}

interface FileItem {
  id: string
  name: string
  file_path: string
  file_url: string        // URL publique Supabase (full URL)
  file_size: number
  mime_type: string
  uploaded_by: string
  created_at: string
  is_signed?: boolean
  signed_by_name?: string
  profiles?: {
    name: string
    company: string
  }
}

export default function FileList({ searchQuery, selectedOwner, selectedDate }: FileListProps) {
  const [items, setItems] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null)
  const [signingFile, setSigningFile] = useState<FileItem | null>(null)

  const fetchDocuments = async () => {
    try {
      setLoading(true)

      // Timeout de 10s pour éviter le loading infini
      const timeoutPromise = new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), 10000)
      )

      const queryPromise = supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })

      const result = await Promise.race([queryPromise, timeoutPromise])

      if (!result) {
        console.warn('Timeout chargement documents')
        setItems([])
        return
      }

      const { data, error } = result as Awaited<typeof queryPromise>

      if (error) {
        console.error('Erreur chargement documents:', JSON.stringify(error))
        setItems([])
      } else {
        // Normaliser : gérer les deux schémas (ancien: label/url, nouveau: name/file_url)
        const normalized = (data || []).map((doc: any) => ({
          ...doc,
          name: doc.name || doc.label || 'Sans titre',
          file_url: doc.file_url || doc.url || '',
          file_size: doc.file_size || doc.size || 0,
          mime_type: doc.mime_type || doc.type || '',
          file_path: doc.file_path || '',
        }))
        setItems(normalized)
      }
    } catch (err) {
      console.error('Erreur fetch:', err)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  // Filtres
  const filteredItems = items.filter(item => {
    let matches = true
    if (searchQuery?.trim()) {
      matches = matches && item.name.toLowerCase().includes(searchQuery.toLowerCase())
    }
    if (selectedOwner && selectedOwner !== 'Tous') {
      matches = matches && item.profiles?.name === selectedOwner
    }
    if (selectedDate?.trim()) {
      const itemDate = new Date(item.created_at).toISOString().split('T')[0]
      matches = matches && itemDate === selectedDate
    }
    return matches
  })

  const handleDownload = async (item: FileItem) => {
    try {
      if (item.file_url && item.file_url.startsWith('http')) {
        // Téléchargement via URL publique
        const link = document.createElement('a')
        link.href = item.file_url
        link.download = item.name
        link.target = '_blank'
        link.click()
      } else if (item.file_path) {
        // Téléchargement via Supabase Storage
        const { data, error } = await supabase.storage
          .from('documents')
          .download(item.file_path)
        if (error) throw error
        const url = URL.createObjectURL(data)
        const link = document.createElement('a')
        link.href = url
        link.download = item.name
        link.click()
        URL.revokeObjectURL(url)
      }
    } catch (err) {
      console.error('Erreur téléchargement:', err)
      alert('Impossible de télécharger ce fichier')
    }
  }

  const handleDelete = async (item: FileItem) => {
    if (!confirm(`Supprimer "${item.name}" ?`)) return
    try {
      // Supprimer du Storage
      if (item.file_path) {
        await supabase.storage.from('documents').remove([item.file_path])
      }
      // Supprimer de la BDD
      const { error } = await supabase.from('documents').delete().eq('id', item.id)
      if (error) throw error
      setItems(prev => prev.filter(i => i.id !== item.id))
    } catch (err) {
      console.error('Erreur suppression:', err)
      alert('Erreur lors de la suppression')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '–'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getFileIcon = (name: string, mimeType?: string) => {
    const ext = name.split('.').pop()?.toLowerCase()
    if (mimeType?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      return <Image className="w-5 h-5 text-blue-600" />
    }
    if (mimeType?.includes('pdf') || ext === 'pdf') {
      return <FileText className="w-5 h-5 text-red-600" />
    }
    if (mimeType?.includes('spreadsheet') || mimeType?.includes('excel') || ['xlsx', 'xls', 'csv'].includes(ext || '')) {
      return <FileSpreadsheet className="w-5 h-5 text-green-600" />
    }
    return <File className="w-5 h-5 text-gray-600" />
  }

  // Obtenir l'URL de prévisualisation (toujours l'URL publique Supabase)
  const getPreviewUrl = (item: FileItem): string | null => {
    if (item.file_url && item.file_url.startsWith('http')) {
      return item.file_url
    }
    if (item.file_path) {
      const { data } = supabase.storage.from('documents').getPublicUrl(item.file_path)
      return data.publicUrl || null
    }
    return null
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-ecotp-green-600 mx-auto mb-3" />
        <p className="text-gray-500">Chargement des documents...</p>
      </div>
    )
  }

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="font-medium">Aucun document trouvé</p>
        <p className="text-sm text-gray-400 mt-1">Uploadez un fichier pour commencer</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propriétaire</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taille</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredItems.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {getFileIcon(item.name, item.mime_type)}
                  <span className="text-sm font-medium text-gray-900 max-w-[200px] truncate">{item.name}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <p className="text-sm text-gray-900">{item.profiles?.name || '–'}</p>
                <p className="text-xs text-gray-500">{item.profiles?.company || ''}</p>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{formatFileSize(item.file_size)}</td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {new Date(item.created_at).toLocaleDateString('fr-FR')}
              </td>
              <td className="px-4 py-3">
                {item.is_signed ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3" /> Signé
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    En attente
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  {/* Aperçu */}
                  <button
                    onClick={() => setPreviewFile(item)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Aperçu"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {/* Signer (si pas déjà signé) */}
                  {!item.is_signed && (
                    <button
                      onClick={() => setSigningFile(item)}
                      className="p-2 text-ecotp-green-600 hover:bg-ecotp-green-50 rounded-lg transition-colors"
                      title="Signer"
                    >
                      <PenTool className="w-4 h-4" />
                    </button>
                  )}
                  {/* Télécharger */}
                  <button
                    onClick={() => handleDownload(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Télécharger"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  {/* Supprimer */}
                  <button
                    onClick={() => handleDelete(item)}
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

      {/* Modal Aperçu PDF */}
      {previewFile && (() => {
        const url = getPreviewUrl(previewFile)
        const isPdf = previewFile.mime_type?.includes('pdf') || previewFile.name.endsWith('.pdf')
        const isImage = previewFile.mime_type?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(previewFile.name.split('.').pop()?.toLowerCase() || '')

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setPreviewFile(null)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold text-lg text-gray-900">{previewFile.name}</h3>
                <div className="flex items-center gap-3">
                  {url && (
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-ecotp-green-600 hover:underline"
                    >
                      Ouvrir dans un nouvel onglet ↗
                    </a>
                  )}
                  <button onClick={() => setPreviewFile(null)} className="p-1 hover:bg-gray-100 rounded-full">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-gray-100 min-h-[500px] flex items-center justify-center overflow-auto p-4">
                {!url ? (
                  <div className="text-center">
                    <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Aperçu non disponible</p>
                  </div>
                ) : isPdf ? (
                  <iframe
                    src={`${url}#toolbar=0&navpanes=0`}
                    className="w-full h-full min-h-[500px] rounded"
                    title="Aperçu PDF"
                  />
                ) : isImage ? (
                  <img
                    src={url}
                    alt={previewFile.name}
                    className="max-w-full max-h-[500px] object-contain rounded shadow"
                  />
                ) : (
                  <div className="text-center">
                    <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600 mb-4">Aperçu non disponible pour ce type de fichier.</p>
                    <a
                      href={url}
                      download={previewFile.name}
                      className="px-4 py-2 bg-ecotp-green-600 text-white rounded-lg hover:bg-ecotp-green-700 transition-colors text-sm"
                    >
                      Télécharger pour voir
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })()}

      {/* Modal Signature */}
      {signingFile && (() => {
        const url = getPreviewUrl(signingFile)
        return (
          <SignatureModal
            document={{
              id: signingFile.id,
              name: signingFile.name,
              url: url || ''
            }}
            onClose={() => setSigningFile(null)}
            onSuccess={() => {
              setSigningFile(null)
              fetchDocuments()
            }}
          />
        )
      })()}
    </div>
  )
}