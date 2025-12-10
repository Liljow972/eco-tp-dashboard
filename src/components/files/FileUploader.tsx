'use client'

import { useState, DragEvent, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { FileUp, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

export default function FileUploader({ onUploaded }: { onUploaded: () => void }) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = async (file: File) => {
    setUploading(true)
    setError(null)
    setSuccess(false)

    try {
      // 1. Upload to Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${fileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 2. Insert Metadata
      const { data: { user } } = await supabase.auth.getUser()

      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          name: file.name,
          file_path: filePath,
          size: file.size,
          type: file.type,
          owner_id: user?.id
        })

      if (dbError) throw dbError

      setSuccess(true)
      onUploaded()

      setTimeout(() => setSuccess(false), 3000)

    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || "Erreur lors de l'upload")
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) await processFile(file)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) await processFile(file)
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragging ? 'border-ecotp-green-500 bg-ecotp-green-50' : 'border-gray-200 bg-gray-50/50'
          }`}
      >
        <div className="mx-auto w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
          {uploading ? (
            <Loader2 className="h-6 w-6 text-ecotp-green-600 animate-spin" />
          ) : success ? (
            <CheckCircle className="h-6 w-6 text-green-500" />
          ) : error ? (
            <AlertCircle className="h-6 w-6 text-red-500" />
          ) : (
            <FileUp className="h-6 w-6 text-ecotp-green-600" />
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900">
            {uploading ? 'Upload en cours...' : success ? 'Fichier envoyé !' : 'Glissez votre fichier ici'}
          </h3>
          <p className="text-sm text-gray-500">
            {error ? <span className="text-red-500">{error}</span> : "PDF, Images, Excel (Max 10Mo)"}
          </p>
        </div>

        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileSelect}
        />

        {!uploading && !success && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-6 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            Parcourir les fichiers
          </button>
        )}
      </div>
    </div>
  )
}