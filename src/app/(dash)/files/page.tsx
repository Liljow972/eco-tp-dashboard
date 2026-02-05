"use client"
import { useState } from 'react'
import Card from '@/components/Card'
import FileUploader from '@/components/files/FileUploader'
import FileList from '@/components/files/FileList'
import { Search } from 'lucide-react'

export default function FilesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOwner, setSelectedOwner] = useState('Tous')
  const [selectedDate, setSelectedDate] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSearch = () => {
    setIsSearching(true)
    console.log('Recherche:', { searchQuery, selectedOwner, selectedDate })
    setTimeout(() => setIsSearching(false), 500)
  }

  const handleFileUploaded = (file: any) => {
    // Récupérer les fichiers existants de localStorage
    const localFiles = localStorage.getItem('demo_files')
    let files = []

    if (localFiles) {
      files = JSON.parse(localFiles)
    }

    // Ajouter le nouveau fichier avec un ID unique
    const newFile = {
      id: `file-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      created_at: file.created_at,
      file_path: file.file_path,
      profiles: {
        name: 'Admin EcoTP',
        company: 'Eco TP'
      }
    }

    files.unshift(newFile) // Ajouter au début de la liste

    // Sauvegarder dans localStorage
    localStorage.setItem('demo_files', JSON.stringify(files))

    console.log('✅ Fichier ajouté à localStorage:', newFile)

    // Forcer le refresh de FileList
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-ecotp-white" title="Upload de fichiers" subtitle="Drag-and-drop + bouton, progression visible">
        <FileUploader onUploaded={handleFileUploaded} />
      </Card>

      <Card className="bg-ecotp-white" title="Recherche & Filtres">
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="file-search" className="text-black font-medium">Recherche</label>
            <input
              id="file-search"
              className="mt-1 w-full border border-ecotp-gray-200 rounded px-3 py-2 placeholder-black"
              placeholder="Nom de fichier"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div>
            <label htmlFor="owner" className="text-black font-medium">Propriétaire</label>
            <select
              id="owner"
              className="mt-1 w-full border border-ecotp-gray-200 rounded px-3 py-2"
              value={selectedOwner}
              onChange={(e) => setSelectedOwner(e.target.value)}
            >
              <option>Tous</option>
              <option>Marie Dupont</option>
              <option>Jean Martin</option>
              <option>Sophie Bernard</option>
            </select>
          </div>
          <div>
            <label htmlFor="date" className="text-black font-medium">Date</label>
            <input
              id="date"
              type="date"
              className="mt-1 w-full border border-ecotp-gray-200 rounded px-3 py-2"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        {/* Bouton Rechercher */}
        <div className="flex justify-end">
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-ecotp-green-600 text-white rounded-lg text-sm font-medium hover:bg-ecotp-green-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search className="w-4 h-4" />
            {isSearching ? 'Recherche...' : 'Rechercher'}
          </button>
        </div>
      </Card>

      <Card className="bg-ecotp-white" title="Fichiers">
        <FileList key={refreshKey} searchQuery={searchQuery} selectedOwner={selectedOwner} selectedDate={selectedDate} />
      </Card>
    </div>
  )
}