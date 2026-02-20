"use client"

import { useState, useEffect, useRef } from 'react'
import { X, Upload, ZoomIn, ChevronLeft, ChevronRight, Calendar, Trash2, Plus, Download, Loader2 } from 'lucide-react'
import { AuthService } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

interface Photo {
    id: string
    url: string
    title: string
    date: string
    type: 'before' | 'progress' | 'after'
    file_path?: string // For deletion from storage
}

interface PhotoGalleryProps {
    projectId: string
}

const MAX_PHOTOS = 20
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export default function PhotoGallery({ projectId }: PhotoGalleryProps) {
    const [photos, setPhotos] = useState<Photo[]>([])
    const [loading, setLoading] = useState(true)

    // Lightbox State
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

    // Upload State
    const [filter, setFilter] = useState<'all' | 'before' | 'progress' | 'after'>('all')
    const [uploading, setUploading] = useState(false)
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [photoType, setPhotoType] = useState<'before' | 'progress' | 'after'>('progress')
    const fileInputRef = useRef<HTMLInputElement>(null)

    // User Role
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        const init = async () => {
            const user = await AuthService.getCurrentUser()
            setIsAdmin(user?.role === 'admin')
            fetchPhotos()
        }
        init()
    }, [projectId])

    const fetchPhotos = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('project_photos') // Assuming table exists now
                .select('*')
                .eq('project_id', projectId)
                .order('created_at', { ascending: false })

            if (error) {
                // If table doesn't exist yet, fallback to empty to avoid crash
                console.warn("Table project_photos check failed (likely waiting for migration)", error)
                setPhotos([])
            } else {
                setPhotos(data?.map(p => ({
                    id: p.id,
                    url: p.url,
                    title: p.title || 'Sans titre',
                    date: p.created_at,
                    type: p.type || 'progress',
                    file_path: p.file_path
                })) || [])
            }
        } catch (err) {
            console.error("Error fetching photos:", err)
        } finally {
            setLoading(false)
        }
    }

    const filteredPhotos = filter === 'all'
        ? photos
        : photos.filter(p => p.type === filter)

    // --- Actions ---

    const handlePhotoClick = (index: number) => {
        // Map filtered index to global filtered list
        setCurrentPhotoIndex(index)
        setLightboxOpen(true)
    }

    const closeLightbox = () => setLightboxOpen(false)

    const nextPhoto = () => setCurrentPhotoIndex((prev) => (prev + 1) % filteredPhotos.length)
    const prevPhoto = () => setCurrentPhotoIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length)

    const deletePhoto = async (photoId: string, filePath?: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) return

        try {
            // 1. Delete from Storage if path exists
            if (filePath) {
                const { error: storageError } = await supabase.storage
                    .from('photos')
                    .remove([filePath])

                if (storageError) console.error("Storage delete error:", storageError)
            }

            // 2. Delete from DB
            const { error } = await supabase
                .from('project_photos')
                .delete()
                .eq('id', photoId)

            if (error) throw error

            setPhotos(photos.filter(p => p.id !== photoId))
            if (lightboxOpen && filteredPhotos[currentPhotoIndex]?.id === photoId) {
                closeLightbox()
            }
            // toast.success('Photo supprimée')
        } catch (err) {
            console.error('Error deleting photo:', err)
            alert('Erreur lors de la suppression')
        }
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        // Validate count
        if (photos.length + files.length > MAX_PHOTOS) {
            alert(`Attention : Maximum ${MAX_PHOTOS} photos autorisé par projet.`)
            return
        }

        setSelectedFiles(Array.from(files))
        setShowUploadModal(true)
    }

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return

        setUploading(true)
        try {
            for (const file of selectedFiles) {
                // Validate Size
                if (file.size > MAX_FILE_SIZE) {
                    alert(`${file.name} est trop volumineux (max 10MB)`)
                    continue
                }

                // 1. Upload to Storage
                const fileExt = file.name.split('.').pop()
                const fileName = `${projectId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

                const { data: storageData, error: storageError } = await supabase.storage
                    .from('photos') // Make sure this bucket exists!
                    .upload(fileName, file)

                if (storageError) throw storageError

                // 2. Insert into DB
                const publicUrl = supabase.storage.from('photos').getPublicUrl(fileName).data.publicUrl

                const { data: dbData, error: dbError } = await supabase
                    .from('project_photos')
                    .insert([{
                        project_id: projectId,
                        url: publicUrl,
                        file_path: fileName,
                        title: file.name.replace(/\.[^/.]+$/, ''),
                        type: photoType
                    }])
                    .select()
                    .single()

                if (dbError) throw dbError

                if (dbData) {
                    setPhotos(prev => [...prev, {
                        id: dbData.id,
                        url: dbData.url,
                        title: dbData.title,
                        date: dbData.created_at,
                        type: dbData.type,
                        file_path: dbData.file_path
                    }])
                }
            }

            setShowUploadModal(false)
            setSelectedFiles([])
            if (fileInputRef.current) fileInputRef.current.value = ''

            // Refetch to be safe
            fetchPhotos()

        } catch (err: any) {
            console.error('Error uploading photos:', err)
            const msg = err?.message || err?.error_description || JSON.stringify(err) || 'Erreur inconnue'
            alert(`Erreur upload photo: ${msg}\n\nSi le bucket "photos" n'existe pas, exécutez FIX_DOCUMENTS_COLUMNS.sql dans Supabase SQL Editor.`)
        } finally {
            setUploading(false)
        }
    }

    // --- Render Helpers ---

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'before': return 'Avant'
            case 'progress': return 'En cours'
            case 'after': return 'Après'
            default: return type
        }
    }

    const getTypeBadgeClass = (type: string) => {
        switch (type) {
            case 'before': return 'bg-blue-100 text-blue-800'
            case 'progress': return 'bg-yellow-100 text-yellow-800'
            case 'after': return 'bg-green-100 text-green-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }


    const currentPhoto = filteredPhotos.length > 0 ? filteredPhotos[currentPhotoIndex] : null


    if (loading && photos.length === 0) {
        return <div className="p-8 text-center text-gray-400">Chargement de la galerie...</div>
    }

    return (
        <div className="space-y-6">
            {/* Header avec filtres */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Galerie Photos</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {filteredPhotos.length} photo(s)
                        {filter === 'all' && ` / ${MAX_PHOTOS} max`}
                    </p>
                </div>

                <div className="flex gap-2 flex-wrap">
                    <button onClick={() => setFilter('all')} className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filter === 'all' ? 'bg-ecotp-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Toutes</button>
                    <button onClick={() => setFilter('before')} className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filter === 'before' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Avant</button>
                    <button onClick={() => setFilter('progress')} className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filter === 'progress' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>En cours</button>
                    <button onClick={() => setFilter('after')} className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filter === 'after' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Après</button>
                </div>
            </div>

            {/* Grille de photos */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredPhotos.map((photo, index) => (
                    <div
                        key={photo.id}
                        className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                    >
                        <img
                            src={photo.url}
                            alt={photo.title}
                            className="w-full h-full object-cover cursor-pointer group-hover:scale-110 transition-transform duration-500"
                            onClick={() => handlePhotoClick(index)}
                        />

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all pointer-events-none" />

                        <div className="absolute top-2 left-2">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full shadow-sm backdrop-blur-sm ${getTypeBadgeClass(photo.type)}`}>
                                {getTypeLabel(photo.type)}
                            </span>
                        </div>

                        {isAdmin && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    deletePhoto(photo.id, photo.file_path)
                                }}
                                className="absolute top-2 right-2 p-2 bg-red-500/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10 shadow-sm"
                                title="Supprimer"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}

                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-xs font-medium truncate">{photo.title}</p>
                            <p className="text-white/80 text-xs flex items-center gap-1 mt-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(photo.date).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Bouton Ajouter (Admin + Limite non atteinte) */}
                {isAdmin && photos.length < MAX_PHOTOS && (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-ecotp-green-500 hover:bg-ecotp-green-50/30 transition-all cursor-pointer group animate-fade-in"
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleFileInputChange}
                        />
                        <div className="p-3 bg-gray-100 rounded-full group-hover:bg-white group-hover:shadow-sm transition-all">
                            <Plus className="w-6 h-6 text-gray-400 group-hover:text-ecotp-green-600 transition-colors" />
                        </div>
                        <span className="text-sm text-gray-500 group-hover:text-ecotp-green-700 font-medium">Ajouter photo</span>
                    </div>
                )}
            </div>

            {photos.length === 0 && !loading && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-500">Aucune photo pour le moment.</p>
                </div>
            )}

            {/* Modal Upload */}
            {showUploadModal && (
                <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scale-in">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Ajouter des photos</h3>
                            <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2 font-medium">{selectedFiles.length} fichier(s) prêt(s) à l'envoi</p>
                            <div className="max-h-32 overflow-y-auto space-y-2 pr-2">
                                {selectedFiles.map((file, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center shrink-0">
                                            <Upload className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <span className="truncate flex-1">{file.name}</span>
                                        <span className="text-gray-400">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Étape du chantier</label>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => setPhotoType('before')}
                                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all border ${photoType === 'before'
                                        ? 'bg-blue-50 border-blue-200 text-blue-700 ring-2 ring-blue-500/20'
                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    Avant
                                </button>
                                <button
                                    onClick={() => setPhotoType('progress')}
                                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all border ${photoType === 'progress'
                                        ? 'bg-yellow-50 border-yellow-200 text-yellow-700 ring-2 ring-yellow-500/20'
                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    En cours
                                </button>
                                <button
                                    onClick={() => setPhotoType('after')}
                                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all border ${photoType === 'after'
                                        ? 'bg-green-50 border-green-200 text-green-700 ring-2 ring-green-500/20'
                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    Après
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowUploadModal(false)
                                    setSelectedFiles([])
                                    if (fileInputRef.current) fileInputRef.current.value = ''
                                }}
                                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
                                disabled={uploading}
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleUpload}
                                className="flex-1 px-4 py-2.5 bg-ecotp-green-600 text-white rounded-xl hover:bg-ecotp-green-700 transition-all shadow-lg shadow-ecotp-green-900/20 font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                disabled={uploading}
                            >
                                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                {uploading ? 'Envoi...' : 'Confirmer l\'ajout'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* LIGHTBOX (Idem qu'avant avec z-index fix) */}
            {lightboxOpen && currentPhoto && (
                <div
                    className="fixed inset-0 z-[10000] bg-black/95 flex items-center justify-center p-4 animate-fade-in"
                    onClick={closeLightbox}
                >
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            // Assuming download logic exists
                        }}
                        className="absolute top-4 right-16 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
                        title="Télécharger"
                    >
                        <Download className="w-6 h-6" />
                    </button>

                    {filteredPhotos.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    prevPhoto()
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10 backdrop-blur-sm"
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    nextPhoto()
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10 backdrop-blur-sm"
                            >
                                <ChevronRight className="w-8 h-8" />
                            </button>
                        </>
                    )}

                    <div
                        className="max-w-7xl w-full max-h-[85vh] flex flex-col items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={currentPhoto?.url || ''}
                            alt={currentPhoto?.title || ''}
                            className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"

                        />

                        <div className="mt-6 text-center">
                            <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full mb-3 ${getTypeBadgeClass(currentPhoto.type)}`}>
                                {getTypeLabel(currentPhoto.type)}
                            </span>
                            <h3 className="text-xl font-semibold text-white mb-2">{currentPhoto.title}</h3>
                            <p className="text-gray-400 text-sm">
                                {currentPhotoIndex + 1} / {filteredPhotos.length}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
