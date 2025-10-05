'use client'

import { useEffect, useState } from 'react'
import { getFiles, deleteFileMock, downloadFileMock, FileItem } from '@/lib/mock'
import { Download, Trash2 } from 'lucide-react'

export default function FileList() {
  const [items, setItems] = useState<FileItem[]>([])

  const refresh = async () => {
    const list = await getFiles()
    setItems(list)
  }

  useEffect(() => { refresh() }, [])

  const handleDelete = async (id: string) => {
    await deleteFileMock(id)
    await refresh()
  }

  const handleDownload = async (id: string) => {
    const url = await downloadFileMock(id)
    window.open(url, '_blank')
  }

  if (items.length === 0) {
    return <p className="text-black">Aucun fichier pour le moment.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-ecotp-white border border-ecotp-gray-200 rounded">
        <thead>
          <tr className="text-left">
            <th className="px-4 py-2 border-b border-ecotp-gray-200">Nom</th>
            <th className="px-4 py-2 border-b border-ecotp-gray-200">Taille</th>
            <th className="px-4 py-2 border-b border-ecotp-gray-200">Date</th>
            <th className="px-4 py-2 border-b border-ecotp-gray-200">Propriétaire</th>
            <th className="px-4 py-2 border-b border-ecotp-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((f) => (
            <tr key={f.id} className="odd:bg-ecotp-gray-50">
              <td className="px-4 py-2 border-b border-ecotp-gray-200 text-black">{f.name}</td>
              <td className="px-4 py-2 border-b border-ecotp-gray-200 text-black">{(f.size / 1000).toFixed(0)} Ko</td>
              <td className="px-4 py-2 border-b border-ecotp-gray-200 text-black">{f.date}</td>
              <td className="px-4 py-2 border-b border-ecotp-gray-200 text-black">{f.owner}</td>
              <td className="px-4 py-2 border-b border-ecotp-gray-200">
                <button onClick={() => handleDownload(f.id)} className="mr-2 inline-flex items-center gap-1 px-2 py-1 bg-ecotp-green text-white rounded focus:outline-none focus:ring-2 focus:ring-ecotp-green/60">
                  <Download className="h-4 w-4" /> Télécharger
                </button>
                <button onClick={() => handleDelete(f.id)} className="inline-flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600/60">
                  <Trash2 className="h-4 w-4" /> Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}