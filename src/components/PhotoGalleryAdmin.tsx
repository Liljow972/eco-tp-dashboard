"use client"

import { useState, useRef } from 'react'
import { X, Upload, Image as ImageIcon, ZoomIn, ChevronLeft, ChevronRight, Calendar, Trash2, Plus, Download } from 'lucide-react'
import { AuthService } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

interface Photo {
    id: string
    url: string
    title: string
    date: string
    type: 'before' | 'progress' | 'after'
}

interface PhotoGalleryProps {
    projectId: string
}

export default function PhotoGalleryAdmin({ projectId }: PhotoGalleryProps) {
    const [photos, setPhotos] = useState<Photo[]>([
        // Photos de démonstration
        {
            id: '1',
            url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
            title: 'État initial du terrain',
            date: '2024-01-15',
            type: 'before'
        },
        {
            id: '2',
            url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800',
            title: 'Début des travaux',
            date: '2024-01-20',
            type: 'progress'
        },
        {
            id: '3',
            url: 'https://images.unsplash.com/photo-1590496793907-4b0e5e8c7e5f?w=800',
            title: 'Terrassement en cours',
            date: '2024-02-01',
            type: 'progress'
        },
        {
            id: '4',
            url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800',
            title: 'Chantier terminé',
            date: '2024-03-15',
            type: 'after'
        }
    ])

    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [filter, setFilter] = useState<'all' | 'before' | 'progress' | 'after'>('all')
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const currentUser = AuthService.getCurrentUser()
    const isAdmin = currentUser?.role === 'admin'

    const filteredPhotos = filter === 'all'
        ? photos
        : photos.filter(p => p.type === filter)

    const openLightbox = (photo: Photo, index: number) => {
        setSelectedPhoto(photo)
        setCurrentIndex(index)
    }

    const closeLightbox = () => {
        setSelectedPhoto(null)
    }

    const nextPhoto = () => {
        const newIndex = (currentIndex + 1) % filteredPhotos.length
        setCurrentIndex(newIndex)
        setSelectedPhoto(filteredPhotos[newIndex])
    }

    const prevPhoto = () => {
        const newIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length
        setCurrentIndex(newIndex)
        setSelectedPhoto(filteredPhotos[newIndex])
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setUploading(true)
        try {
            for (const file of Array.from(files)) {
                // Validation taille (10MB max pour les photos)
                if (file.size > 10 * 1024 * 1024) {
                    alert(`${file.name} est trop volumineux (max 10MB)`)
                    continue
                }

                // Upload vers Supabase Storage
                const fileExt = file.name.split('.').pop()
                const fileName = `${projectId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('project-photos')
                    .upload(fileName, file)

                if (uploadError) throw uploadError

                // Obtenir l'URL publique
                const { data: { publicUrl } } = supabase.storage
                    .from('project-photos')
                    .getPublicUrl(fileName)

                // Ajouter à la base de données
                const newPhoto = {
                    project_id: projectId,
                    url: publicUrl,
                    title: file.name.replace(/\.[^/.]+$/, ''),
                    type: 'progress', // Par défaut
                    created_at: new Date().toISOString()
                }

                const { data, error: dbError } = await supabase
                    .from('project_photos')
                    .insert([newPhoto])
                    .select()
                    .single()

                if (dbError) throw dbError

                // Ajouter localement
                setPhotos([...photos, {
                    id: data.id,
                    url: publicUrl,
                    title: newPhoto.title,
                    date: newPhoto.created_at,
                    type: newPhoto.type as any
                }])
            }

            alert('Photo(s) ajoutée(s) avec succès !')
        } catch (err) {
            console.error('Error uploading photos:', err)
            alert('Erreur lors de l\'upload des photos')
        } finally {
            setUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const deletePhoto = async (photoId: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) return

        try {
            const { error } = await supabase
                .from('project_photos')
                .delete()
                .eq('id', photoId)

            if (error) throw error

            setPhotos(photos.filter(p => p.id !== photoId))
            if (selectedPhoto?.id === photoId) {
                closeLightbox()
            }
            alert('Photo supprimée avec succès !')
        } catch (err) {
            console.error('Error deleting photo:', err)
            alert('Erreur lors de la suppression')
        }
    }

    const downloadPhoto = async (photo: Photo) => {
        try {
            const response = await fetch(photo.url)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `${photo.title}.jpg`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (err) {
            console.error('Error downloading photo:', err)
            alert('Erreur lors du téléchargement')
        }
    }

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

    return (
        <div className="space-y-6">
            {/* Header avec filtres */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Galerie Photos</h3>
                    <p className="text-sm text-gray-500 mt-1">{filteredPhotos.length} photo(s)</p>
                </div>

                {/* Filtres */}
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filter === 'all'
                            ? 'bg-ecotp-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Toutes
                    </button>
                    <button
                        onClick={() => setFilter('before')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filter === 'before'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Avant
                    </button>
                    <button
                        onClick={() => setFilter('progress')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filter === 'progress'
                            ? 'bg-yellow-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        En cours
                    </button>
                    <button
                        onClick={() => setFilter('after')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filter === 'after'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Après
                    </button>
                </div>
            </div>

            {/* Grille de photos */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredPhotos.map((photo, index) => (
                    <div
                        key={photo.id}
                        className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden"
                    >
                        <img
                            src={photo.url}
                            alt={photo.title}
                            className="w-full h-full object-cover cursor-pointer group-hover:scale-110 transition-transform duration-300"
                            onClick={() => openLightbox(photo, index)}
                        />

                        {/* Overlay au survol */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                            <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {/* Badge type */}
                        <div className="absolute top-2 left-2">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTypeBadgeClass(photo.type)}`}>
                                {getTypeLabel(photo.type)}
                            </span>
                        </div>

                        {/* Bouton supprimer (Admin uniquement) */}
                        {isAdmin && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    deletePhoto(photo.id)
                                }}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                title="Supprimer"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}

                        {/* Date */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-xs font-medium truncate">{photo.title}</p>
                            <p className="text-white/80 text-xs flex items-center gap-1 mt-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(photo.date).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Bouton Upload (Admin uniquement) */}
                {isAdmin && (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-ecotp-green-500 hover:bg-ecotp-green-50/30 transition-all cursor-pointer group"
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleFileSelect}
                            disabled={uploading}
                        />
                        {uploading ? (
                            <>
                                <div className="w-8 h-8 border-4 border-ecotp-green-600 border-t-transparent rounded-full animate-spin" />
                                <span className="text-sm text-gray-500 font-medium">Upload...</span>
                            </>
                        ) : (
                            <>
                                <Plus className="w-8 h-8 text-gray-400 group-hover:text-ecotp-green-600 transition-colors" />
                                <span className="text-sm text-gray-500 group-hover:text-ecotp-green-700 font-medium">Ajouter</span>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {selectedPhoto && (
                <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in">
                    {/* Bouton Fermer */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Bouton Télécharger */}
                    <button
                        onClick={() => downloadPhoto(selectedPhoto)}
                        className="absolute top-4 right-16 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
                        title="Télécharger"
                    >
                        <Download className="w-6 h-6" />
                    </button>

                    {/* Navigation Précédent */}
                    {filteredPhotos.length > 1 && (
                        <button
                            onClick={prevPhoto}
                            className="absolute left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    )}

                    {/* Image */}
                    <div className="max-w-5xl max-h-[80vh] flex flex-col items-center">
                        <img
                            src={selectedPhoto.url}
                            alt={selectedPhoto.title}
                            className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
                        />

                        {/* Info */}
                        <div className="mt-6 text-center">
                            <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full mb-3 ${getTypeBadgeClass(selectedPhoto.type)}`}>
                                {getTypeLabel(selectedPhoto.type)}
                            </span>
                            <h3 className="text-xl font-semibold text-white mb-2">{selectedPhoto.title}</h3>
                            <p className="text-gray-300 text-sm flex items-center justify-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(selectedPhoto.date).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                            <p className="text-gray-400 text-xs mt-2">
                                {currentIndex + 1} / {filteredPhotos.length}
                            </p>
                        </div>
                    </div>

                    {/* Navigation Suivant */}
                    {filteredPhotos.length > 1 && (
                        <button
                            onClick={nextPhoto}
                            className="absolute right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    )}
                </div>
            )}

            {/* Message si aucune photo */}
            {filteredPhotos.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Aucune photo dans cette catégorie</p>
                </div>
            )}
        </div>
    )
}
