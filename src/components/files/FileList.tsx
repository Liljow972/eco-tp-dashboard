'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Download, Trash2, FileText, Image as ImageIcon, File } from 'lucide-react'

export default function FileList() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('documents')
        .select(`
            *,
            profiles (name, company)
        `)
        .order('created_at', { ascending: false })

      if (error) console.error('Error fetching files:', error)
      else setItems(data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh() }, [])

  const handleDelete = async (id: string, path: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) return

    try {
      // 1. Remove from Storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([path])

      if (storageError) throw storageError

      // 2. Remove from DB
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)

      if (dbError) throw dbError

      refresh()
    } catch (err) {
      console.error('Error deleting file:', err)
      alert('Erreur lors de la suppression')
    }
  }

  const handleDownload = async (path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(path, 60) // 1 minute expiry

      if (error) throw error
      if (data) window.open(data.signedUrl, '_blank')
    } catch (err) {
      console.error('Error downloading file:', err)
      alert('Erreur de téléchargement')
    }
  }

  if (loading) return <div className="text-center p-4 text-gray-500">Chargement...</div>
  if (items.length === 0) return <p className="text-center p-4 text-gray-500">Aucun fichier pour le moment.</p>

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
            <th className="px-4 py-3">Nom</th>
            <th className="px-4 py-3">Taille</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Propriétaire</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((f) => (
            <tr key={f.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                {f.name}
              </td>
              <td className="px-4 py-3 text-gray-500">{(f.size / 1024).toFixed(0)} Ko</td>
              <td className="px-4 py-3 text-gray-500">{new Date(f.created_at).toLocaleDateString()}</td>
              <td className="px-4 py-3 text-gray-500">
                {f.profiles?.name || 'Inconnu'}
                {f.profiles?.company ? ` (${f.profiles.company})` : ''}
              </td>
              <td className="px-4 py-3 text-right space-x-2">
                <button onClick={() => handleDownload(f.file_path)} className="inline-flex items-center gap-1 text-ecotp-green-600 hover:text-ecotp-green-700 font-medium">
                  <Download className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(f.id, f.file_path)} className="inline-flex items-center gap-1 text-red-400 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}