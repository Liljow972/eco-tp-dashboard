"use client"
import Card from '@/components/Card'
import FileUploader from '@/components/files/FileUploader'
import FileList from '@/components/files/FileList'

export default function FilesPage() {
  return (
    <div className="space-y-6">
      <Card className="bg-ecotp-white" title="Upload de fichiers" subtitle="Drag-and-drop + bouton, progression visible">
        <FileUploader onUploaded={() => { /* rafraîchi par FileList via mount */ }} />
      </Card>

      <Card className="bg-ecotp-white" title="Recherche & Filtres">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="file-search" className="text-black font-medium">Recherche</label>
            <input id="file-search" className="mt-1 w-full border border-ecotp-gray-200 rounded px-3 py-2 placeholder-black" placeholder="Nom de fichier" />
          </div>
          <div>
            <label htmlFor="owner" className="text-black font-medium">Propriétaire</label>
            <select id="owner" className="mt-1 w-full border border-ecotp-gray-200 rounded px-3 py-2">
              <option>Tous</option>
              <option>Marie Dupont</option>
              <option>Jean Martin</option>
              <option>Sophie Bernard</option>
            </select>
          </div>
          <div>
            <label htmlFor="date" className="text-black font-medium">Date</label>
            <input id="date" type="date" className="mt-1 w-full border border-ecotp-gray-200 rounded px-3 py-2" />
          </div>
        </div>
      </Card>

      <Card className="bg-ecotp-white" title="Fichiers">
        <FileList />
      </Card>
    </div>
  )
}