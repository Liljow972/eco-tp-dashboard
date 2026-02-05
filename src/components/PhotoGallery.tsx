"use client"

import { useState, useRef } from 'react'
import { X, Upload, ZoomIn, ChevronLeft, ChevronRight, Calendar, Trash2, Plus, Download } from 'lucide-react'
import { AuthService } from '@/lib/auth'

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

export default function PhotoGallery({ projectId }: PhotoGalleryProps) {
    const [photos, setPhotos] = useState<Photo[]>([
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

    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
    const [filter, setFilter] = useState<'all' | 'before' | 'progress' | 'after'>('all')
    const [uploading, setUploading] = useState(false)
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [photoType, setPhotoType] = useState<'before' | 'progress' | 'after'>('progress')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const currentUser = AuthService.getCurrentUser()
    const isAdmin = currentUser?.role === 'admin'

    const filteredPhotos = filter === 'all'
        ? photos
        : photos.filter(p => p.type === filter)

    const handlePhotoClick = (index: number) => {
        console.log('📸 Photo clicked! Index:', index)
        setCurrentPhotoIndex(index)
        setLightboxOpen(true)
        console.log('✅ Lightbox should be open now')
    }

    const closeLightbox = () => {
        console.log('❌ Closing lightbox')
        setLightboxOpen(false)
    }

    const nextPhoto = () => {
        setCurrentPhotoIndex((prev) => (prev + 1) % filteredPhotos.length)
    }

    const prevPhoto = () => {
        setCurrentPhotoIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length)
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

    const deletePhoto = (photoId: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) return

        setPhotos(photos.filter(p => p.id !== photoId))
        if (lightboxOpen && filteredPhotos[currentPhotoIndex]?.id === photoId) {
            closeLightbox()
        }
        alert('Photo supprimée avec succès !')
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setSelectedFiles(Array.from(files))
        setShowUploadModal(true)
    }

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return

        setUploading(true)
        try {
            for (const file of selectedFiles) {
                if (file.size > 10 * 1024 * 1024) {
                    alert(`${file.name} est trop volumineux (max 10MB)`)
                    continue
                }

                const newPhoto: Photo = {
                    id: Date.now().toString() + Math.random(),
                    url: URL.createObjectURL(file),
                    title: file.name.replace(/\.[^/.]+$/, ''),
                    date: new Date().toISOString(),
                    type: photoType
                }

                setPhotos(prev => [...prev, newPhoto])
            }

            alert(`${selectedFiles.length} photo(s) ajoutée(s) avec succès !`)
            setShowUploadModal(false)
            setSelectedFiles([])
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        } catch (err) {
            console.error('Error uploading photos:', err)
            alert('Erreur lors de l\'upload des photos')
        } finally {
            setUploading(false)
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

    const currentPhoto = filteredPhotos[currentPhotoIndex]

    return (
        <div className="space-y-6">
            {/* Header avec filtres */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Galerie Photos</h3>
                    <p className="text-sm text-gray-500 mt-1">{filteredPhotos.length} photo(s)</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filter === 'all' ? 'bg-ecotp-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Toutes
                    </button>
                    <button
                        onClick={() => setFilter('before')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filter === 'before' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Avant
                    </button>
                    <button
                        onClick={() => setFilter('progress')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filter === 'progress' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        En cours
                    </button>
                    <button
                        onClick={() => setFilter('after')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filter === 'after' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                            onClick={() => handlePhotoClick(index)}
                        />

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center pointer-events-none">
                            <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        <div className="absolute top-2 left-2">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTypeBadgeClass(photo.type)}`}>
                                {getTypeLabel(photo.type)}
                            </span>
                        </div>

                        {isAdmin && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    deletePhoto(photo.id)
                                }}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                                title="Supprimer"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}

                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-xs font-medium truncate">{photo.title}</p>
                            <p className="text-white/80 text-xs flex items-center gap-1 mt-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(photo.date).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                    </div>
                ))}

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
                            onChange={handleFileInputChange}
                        />
                        <Plus className="w-8 h-8 text-gray-400 group-hover:text-ecotp-green-600 transition-colors" />
                        <span className="text-sm text-gray-500 group-hover:text-ecotp-green-700 font-medium">Ajouter</span>
                    </div>
                )}
            </div>

            {/* Modal Upload */}
            {showUploadModal && (
                <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Ajouter des photos</h3>

                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">{selectedFiles.length} fichier(s) sélectionné(s)</p>
                            <div className="max-h-32 overflow-y-auto space-y-1">
                                {selectedFiles.map((file, i) => (
                                    <p key={i} className="text-xs text-gray-500 truncate">• {file.name}</p>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Type de photo</label>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => setPhotoType('before')}
                                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${photoType === 'before' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Avant
                                </button>
                                <button
                                    onClick={() => setPhotoType('progress')}
                                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${photoType === 'progress' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    En cours
                                </button>
                                <button
                                    onClick={() => setPhotoType('after')}
                                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${photoType === 'after' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                disabled={uploading}
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleUpload}
                                className="flex-1 px-4 py-2 bg-ecotp-green-600 text-white rounded-lg hover:bg-ecotp-green-700 transition-colors disabled:opacity-50"
                                disabled={uploading}
                            >
                                {uploading ? 'Upload...' : 'Ajouter'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* LIGHTBOX */}
            {lightboxOpen && currentPhoto && (
                <div
                    className="fixed inset-0 z-[10000] bg-black/95 flex items-center justify-center p-4"
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
                            downloadPhoto(currentPhoto)
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
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    nextPhoto()
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    <div
                        className="max-w-5xl max-h-[80vh] flex flex-col items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={currentPhoto.url}
                            alt={currentPhoto.title}
                            className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
                        />

                        <div className="mt-6 text-center">
                            <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full mb-3 ${getTypeBadgeClass(currentPhoto.type)}`}>
                                {getTypeLabel(currentPhoto.type)}
                            </span>
                            <h3 className="text-xl font-semibold text-white mb-2">{currentPhoto.title}</h3>
                            <p className="text-gray-300 text-sm flex items-center justify-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(currentPhoto.date).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                            <p className="text-gray-400 text-xs mt-2">
                                {currentPhotoIndex + 1} / {filteredPhotos.length}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
