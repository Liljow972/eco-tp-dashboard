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
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="space-y-6">
      <Card className="bg-ecotp-white" title="Upload de fichiers" subtitle="Glissez-déposez ou cliquez pour sélectionner">
        <FileUploader onUploaded={() => setRefreshKey(prev => prev + 1)} />
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
            />
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
          <div className="flex items-end">
            <button
              onClick={() => setRefreshKey(prev => prev + 1)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-ecotp-green-600 text-white rounded-lg text-sm font-medium hover:bg-ecotp-green-700 transition-colors shadow-sm"
            >
              <Search className="w-4 h-4" />
              Actualiser
            </button>
          </div>
        </div>
      </Card>

      <Card className="bg-ecotp-white" title="Documents">
        <FileList
          key={refreshKey}
          searchQuery={searchQuery}
          selectedOwner={selectedOwner}
          selectedDate={selectedDate}
        />
      </Card>
    </div>
  )
}