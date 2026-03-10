"use client"

import { useState, useRef } from 'react'
import { Upload, Check, AlertCircle, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useEffect } from 'react'

interface FileUploaderProps {
  onUploaded?: () => void
}

// Mappe le MIME type vers une valeur acceptée par la contrainte documents_type_check
const getDocType = (mimeType: string, fileName: string): string => {
  if (!mimeType) return 'document'
  if (mimeType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf'))
    return 'pdf'
  if (mimeType.startsWith('image/'))
    return 'image'
  if (
    mimeType.includes('word') ||
    mimeType.includes('document') ||
    fileName.toLowerCase().match(/\.(doc|docx|odt|txt|rtf)$/)
  )
    return 'document'
  if (
    mimeType.includes('excel') ||
    mimeType.includes('spreadsheet') ||
    fileName.toLowerCase().match(/\.(xls|xlsx|csv|ods)$/)
  )
    return 'document'
  // Valeur par défaut safe
  return 'document'
}

export default function FileUploader({ onUploaded }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MAX_SIZE = 10 * 1024 * 1024 // 10MB
  const PRIMARY = '#524f3d'

  const [clients, setClients] = useState<any[]>([])
  const [selectedClientId, setSelectedClientId] = useState<string>('')
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const user = session?.user || (() => {
          try { return JSON.parse(localStorage.getItem('auth_user') || '{}') } catch { return null }
        })()

        if (user && user.role === 'admin' || user?.user_metadata?.role === 'admin' || user?.app_metadata?.role === 'admin') {
          // Verify role from profiles just to be sure
          const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
          if (profile?.role === 'admin') {
            setIsAdmin(true)
            const { data } = await supabase.from('profiles').select('id, name').eq('role', 'client').order('name')
            if (data) setClients(data)
          }
        } else {
          const localUser = localStorage.getItem('auth_user')
          if (localUser) {
            const parsed = JSON.parse(localUser);
            if (parsed.role === 'admin') {
              setIsAdmin(true);
              const { data } = await supabase.from('profiles').select('id, name').eq('role', 'client').order('name')
              if (data) setClients(data)
            }
          }
        }
      } catch (err) {
        console.error('Erreur chargement clients', err)
      }
    }
    fetchClients()
  }, [])

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
      // 1. Session utilisateur
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id || (() => {
        try { return JSON.parse(localStorage.getItem('auth_user') || '{}').id } catch { return null }
      })()

      if (!userId) {
        setError('Session expirée. Veuillez vous reconnecter.')
        setUploading(false)
        return
      }

      // 2. Chemin de stockage sécurisé
      const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const filePath = `${userId}/${Date.now()}-${safeFileName}`

      // 3. Upload Storage avec timeout 30s
      const uploadPromise = supabase.storage
        .from('documents')
        .upload(filePath, file, { cacheControl: '3600', upsert: false })

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Délai dépassé — vérifiez votre connexion')), 30000)
      )

      const { error: uploadError } = await Promise.race([uploadPromise, timeoutPromise]) as any

      if (uploadError) throw new Error(`Erreur stockage: ${uploadError.message}`)

      // 4. URL publique
      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(filePath)
      const publicUrl = urlData?.publicUrl || ''

      // 5. Type document mappé correctement (évite la contrainte documents_type_check)
      const docType = getDocType(file.type, file.name)

      // 6. Insertion BDD — tentative complète
      let dbError = null

      const insertData: any = {
        name: file.name,
        label: file.name,
        file_path: filePath,
        file_url: publicUrl,
        file_size: file.size,
        mime_type: file.type || 'application/octet-stream',
        type: docType,
        uploaded_by: userId,
      }

      if (isAdmin && selectedClientId) {
        insertData.client_id = selectedClientId
      } else if (!isAdmin) {
        insertData.client_id = userId
      }

      const { error: err1 } = await supabase
        .from('documents')
        .insert(insertData)
      dbError = err1

      // 7. Fallback : colonnes minimales (si certaines colonnes manquent)
      if (dbError) {
        console.warn('Insert complet échoué, tentative minimale:', dbError.message)
        const { error: err2 } = await supabase
          .from('documents')
          .insert({
            label: file.name,
            file_path: filePath,
            file_size: file.size,
            mime_type: file.type || 'application/octet-stream',
            type: docType,
          })
        dbError = err2
      }

      if (dbError) {
        // Nettoyage du fichier uploadé si BDD échoue
        await supabase.storage.from('documents').remove([filePath]).catch(() => { })
        throw new Error(`Erreur base de données: ${dbError.message}`)
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
      {isAdmin && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Attribuer ce document à un client (Optionnel)
          </label>
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            disabled={uploading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-ecotp-green-500 focus:border-ecotp-green-500"
          >
            <option value="">-- Aucun client (Général) --</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer group`}
        style={
          uploading
            ? { borderColor: '#c5bfad', backgroundColor: 'rgba(82,79,61,0.04)', cursor: 'not-allowed' }
            : { borderColor: '#d4cfc4', backgroundColor: 'transparent' }
        }
        onMouseEnter={e => {
          if (!uploading) {
            (e.currentTarget as HTMLElement).style.borderColor = PRIMARY
              ; (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(82,79,61,0.04)'
          }
        }}
        onMouseLeave={e => {
          if (!uploading) {
            (e.currentTarget as HTMLElement).style.borderColor = '#d4cfc4'
              ; (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt,.odt,.csv"
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-12 h-12 animate-spin" style={{ color: PRIMARY }} />
            <p className="font-medium" style={{ color: PRIMARY }}>Upload en cours...</p>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:transition-colors" style={{ color: '#b8b09e' }} />
            <p className="text-gray-700 font-medium mb-1">Cliquez ou glissez-déposez</p>
            <p className="text-sm text-gray-500">PDF, Word, Excel, Images (max 10MB)</p>
          </>
        )}
      </div>

      {success && (
        <div className="border rounded-xl p-4 flex items-center gap-3"
          style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
          <Check className="w-5 h-5 flex-shrink-0" style={{ color: '#15803d' }} />
          <p className="font-medium text-sm" style={{ color: '#15803d' }}>✅ Fichier uploadé avec succès !</p>
        </div>
      )}

      {error && (
        <div className="border rounded-xl p-4"
          style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
            <div className="flex-1">
              <p className="font-medium text-sm" style={{ color: '#dc2626' }}>Erreur upload</p>
              <p className="text-sm whitespace-pre-line mt-1" style={{ color: '#ef4444' }}>{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs underline flex-shrink-0 transition-opacity hover:opacity-70"
              style={{ color: '#ef4444' }}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}