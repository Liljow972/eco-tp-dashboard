"use client"

import { useState, useRef } from 'react'
import { Upload, Check, AlertCircle, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface FileUploaderProps {
  onUploaded?: () => void
}

export default function FileUploader({ onUploaded }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MAX_SIZE = 10 * 1024 * 1024 // 10MB

  const processFile = async (file: File) => {
    setUploading(true)
    setError(null)
    setSuccess(false)

    if (file.size > MAX_SIZE) {
      setError(`Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum : 10MB`)
      setUploading(false)
      return
    }

    try {
      // 1. Session utilisateur (non-bloquant)
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id || (() => {
        try { return JSON.parse(localStorage.getItem('auth_user') || '{}').id } catch { return null }
      })()

      if (!userId) {
        setError('Session expirée. Veuillez vous reconnecter.')
        setUploading(false)
        return
      }

      // 2. Générer le chemin de stockage
      const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const filePath = `${userId}/${Date.now()}-${safeFileName}`

      // 3. Upload vers Supabase Storage (avec timeout 30s)
      const uploadPromise = supabase.storage
        .from('documents')
        .upload(filePath, file, { cacheControl: '3600', upsert: false })

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Upload timeout — vérifiez votre connexion')), 30000)
      )

      const { error: uploadError } = await Promise.race([uploadPromise, timeoutPromise]) as any

      if (uploadError) throw new Error(`Erreur stockage: ${uploadError.message}`)

      // 4. URL publique
      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(filePath)
      const publicUrl = urlData?.publicUrl || ''

      // 5. Insérer en BDD - essai avec colonnes complètes d'abord, fallback minimal
      let dbError = null

      // Tentative 1 : colonnes complètes (après FIX_DOCUMENTS_COLUMNS.sql)
      const { error: err1 } = await supabase
        .from('documents')
        .insert({
          name: file.name,
          label: file.name,
          file_path: filePath,
          file_url: publicUrl,
          file_size: file.size,
          mime_type: file.type || 'application/octet-stream',
          type: file.type?.split('/')[0] || 'document',
          uploaded_by: userId,
        })
      dbError = err1

      // Tentative 2 fallback : colonnes minimales (schéma original uniquement)
      if (dbError) {
        console.warn('Insert complet échoué, tentative minimale:', dbError.message)
        const { error: err2 } = await supabase
          .from('documents')
          .insert({
            label: file.name,
            file_path: filePath,
            file_size: file.size,
            mime_type: file.type || 'application/octet-stream',
            type: file.type?.split('/')[0] || 'document',
          })
        dbError = err2
      }

      if (dbError) {
        // Nettoyage storage si BDD échoue
        await supabase.storage.from('documents').remove([filePath]).catch(() => { })
        throw new Error(
          `Erreur base de données: ${dbError.message}\n` +
          `→ Exécutez FIX_DOCUMENTS_COLUMNS.sql dans Supabase SQL Editor`
        )
      }

      setSuccess(true)
      if (onUploaded) onUploaded()

      setTimeout(() => {
        setSuccess(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }, 3000)

    } catch (err: any) {
      console.error('Erreur upload:', err)
      setError(err.message || "Erreur lors de l'upload")
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) processFile(files[0])
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files && files.length > 0) processFile(files[0])
  }

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${uploading
            ? 'border-ecotp-green-300 bg-ecotp-green-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-ecotp-green-500 hover:bg-ecotp-green-50/30 cursor-pointer'
          } group`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-12 h-12 text-ecotp-green-600 animate-spin" />
            <p className="text-ecotp-green-700 font-medium">Upload en cours...</p>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-ecotp-green-600 transition-colors" />
            <p className="text-gray-700 font-medium mb-1">Cliquez ou glissez-déposez</p>
            <p className="text-sm text-gray-500">PDF, Word, Excel, Images (max 10MB)</p>
          </>
        )}
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-green-800 font-medium">✅ Fichier uploadé avec succès !</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800 font-medium text-sm">Erreur upload</p>
              <p className="text-sm text-red-600 whitespace-pre-line">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600 text-xs underline flex-shrink-0"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}