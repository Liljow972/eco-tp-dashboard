'use client'

import { useState, DragEvent } from 'react'
import { uploadFileMock } from '@/lib/mock'
import { FileUp } from 'lucide-react'

export default function FileUploader({ onUploaded }: { onUploaded: () => void }) {
  const [isDragging, setIsDragging] = useState(false)
  const [progress, setProgress] = useState<number | null>(null)

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    setProgress(10)
    await uploadFileMock(file.name, file.size, 'Utilisateur')
    setProgress(100)
    setTimeout(() => setProgress(null), 500)
    onUploaded()
  }

  const handleUploadClick = async () => {
    // Mock simple d\'upload
    setProgress(10)
    await uploadFileMock('Nouveau_fichier.pdf', 120000, 'Utilisateur')
    setProgress(100)
    setTimeout(() => setProgress(null), 500)
    onUploaded()
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-md p-6 text-center ${isDragging ? 'border-ecotp-green bg-ecotp-gray-50' : 'border-ecotp-gray-200'}`}
        role="region"
        aria-label="Zone de dépôt de fichier"
      >
        <FileUp className="mx-auto h-8 w-8 text-ecotp-green" aria-hidden />
        <p className="mt-2 text-black">Glissez-déposez un fichier ici</p>
        <button onClick={handleUploadClick} className="mt-3 px-3 py-2 bg-ecotp-green text-white rounded focus:outline-none focus:ring-2 focus:ring-ecotp-green/60">
          Choisir un fichier
        </button>
        {progress !== null && (
          <div className="mt-3 h-2 bg-ecotp-gray-200 rounded">
            <div className="h-2 bg-ecotp-green rounded" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </div>
  )
}