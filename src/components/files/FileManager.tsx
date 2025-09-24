'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Upload, Download, File, FileText, Image, Archive, 
  Trash2, Eye, Share2, MoreVertical, Search, Filter,
  Calendar, User, FolderOpen, Plus, X
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'archive' | 'other';
  size: string;
  uploadDate: string;
  uploadedBy: string;
  category: 'contract' | 'invoice' | 'report' | 'photo' | 'other';
  url?: string;
}

interface FileManagerProps {
  userRole: 'client' | 'admin';
  projectId?: string;
  clientId?: string;
}

const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'Contrat_Terrassement_2024.pdf',
    type: 'pdf',
    size: '2.4 MB',
    uploadDate: '2024-01-15',
    uploadedBy: 'Admin',
    category: 'contract'
  },
  {
    id: '2',
    name: 'Facture_Janvier_2024.pdf',
    type: 'pdf',
    size: '1.2 MB',
    uploadDate: '2024-01-20',
    uploadedBy: 'Admin',
    category: 'invoice'
  },
  {
    id: '3',
    name: 'Photos_Chantier_Semaine1.zip',
    type: 'archive',
    size: '15.8 MB',
    uploadDate: '2024-01-22',
    uploadedBy: 'Client',
    category: 'photo'
  }
];

const fileIcons = {
  pdf: FileText,
  doc: File,
  image: Image,
  archive: Archive,
  other: File
};

const categoryLabels = {
  contract: 'Contrat',
  invoice: 'Facture',
  report: 'Rapport',
  photo: 'Photo',
  other: 'Autre'
};

const categoryColors = {
  contract: 'bg-blue-100 text-blue-800',
  invoice: 'bg-green-100 text-green-800',
  report: 'bg-purple-100 text-purple-800',
  photo: 'bg-orange-100 text-orange-800',
  other: 'bg-gray-100 text-gray-800'
};

export default function FileManager({ userRole, projectId, clientId }: FileManagerProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Charger les fichiers depuis l'API
  const loadFiles = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (projectId) params.append('projectId', projectId);
      if (clientId) params.append('clientId', clientId);
      
      const response = await fetch(`/api/files?${params.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        setFiles(result.files);
      } else {
        console.warn('Erreur lors du chargement des fichiers, utilisation des données de test');
        setFiles(mockFiles);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des fichiers:', error);
      setFiles(mockFiles);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [projectId, clientId]);

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('projectId', projectId || '');
        formData.append('clientId', clientId || '');
        formData.append('category', 'other');
        formData.append('uploadedBy', userRole === 'admin' ? 'Admin' : 'Client');

        const response = await fetch('/api/files', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        
        if (result.success) {
          setFiles(prev => [result.file, ...prev]);
          setUploadProgress(((i + 1) / selectedFiles.length) * 100);
        } else {
          throw new Error(result.error || 'Erreur lors de l\'upload');
        }
      }
      
      setIsUploading(false);
      setShowUploadModal(false);
      setUploadProgress(0);
    } catch (error) {
      console.error('Erreur upload:', error);
      setIsUploading(false);
      setUploadProgress(0);
      alert('Erreur lors de l\'upload du fichier');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleDownload = (file: FileItem) => {
    const link = document.createElement('a');
    link.href = '#';
    link.download = file.name;
    link.click();
  };

  const handleDeleteClick = (file: FileItem) => {
    setFileToDelete(file);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;

    try {
      const response = await fetch(`/api/files?id=${fileToDelete.id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        setFiles(prev => prev.filter(f => f.id !== fileToDelete.id));
        setShowDeleteModal(false);
        setFileToDelete(null);
      } else {
        alert('Erreur lors de la suppression du fichier');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du fichier');
    }
  };

  const canDeleteFile = (file: FileItem) => {
    return userRole === 'admin' || file.uploadedBy === 'Client';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des fichiers</h2>
          <p className="text-gray-600">
            {userRole === 'admin' ? 'Gérez tous les documents du projet' : 'Accédez à vos documents'}
          </p>
        </div>
        
        <button
          onClick={() => setShowUploadModal(true)}
          className="btn-primary"
        >
          <Upload className="w-4 h-4 mr-2" />
          Téléverser
        </button>
      </div>

      {/* Filters */}
      <div className="card-modern p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un fichier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-search pl-10 w-full"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-modern"
            >
              <option value="all">Toutes les catégories</option>
              <option value="contract">Contrats</option>
              <option value="invoice">Factures</option>
              <option value="report">Rapports</option>
              <option value="photo">Photos</option>
              <option value="other">Autres</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Chargement des fichiers...</span>
        </div>
      ) : (
        <>
          {/* Files Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFiles.map((file) => {
              const IconComponent = fileIcons[file.type];
              return (
                <div key={file.id} className="card-modern p-6 hover:shadow-lg transition-shadow group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{file.name}</h3>
                        <p className="text-sm text-gray-500">{file.size}</p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <button className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Catégorie</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[file.category]}`}>
                        {categoryLabels[file.category]}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Date</span>
                      <span className="text-gray-900">{new Date(file.uploadDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Par</span>
                      <span className="text-gray-900">{file.uploadedBy}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDownload(file)}
                      className="btn-secondary flex-1 text-sm"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Télécharger
                    </button>
                    
                    {canDeleteFile(file) && (
                      <button
                        onClick={() => handleDeleteClick(file)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer le fichier"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredFiles.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun fichier trouvé</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Aucun fichier ne correspond à vos critères de recherche.'
                  : 'Commencez par téléverser vos premiers documents.'
                }
              </p>
              {(!searchTerm && selectedCategory === 'all') && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="btn-primary"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Téléverser un fichier
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Téléverser des fichiers</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!isUploading ? (
                <div>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 hover:bg-green-50 transition-colors cursor-pointer"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      Glissez vos fichiers ici
                    </h4>
                    <p className="text-gray-500 mb-4">
                      ou cliquez pour sélectionner
                    </p>
                    <p className="text-sm text-gray-400">
                      PDF, DOC, Images, Archives (max 50MB)
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip,.rar"
                  />

                  <div className="mt-6 flex space-x-3">
                    <button
                      onClick={() => setShowUploadModal(false)}
                      className="btn-secondary flex-1"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-primary flex-1"
                    >
                      Sélectionner
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Téléversement en cours...
                  </h4>
                  <div className="progress-bar mb-4">
                    <div 
                      className="progress-fill"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500">{uploadProgress}% terminé</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && fileToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Supprimer le fichier
              </h3>
              
              <p className="text-gray-600 text-center mb-6">
                Êtes-vous sûr de vouloir supprimer le fichier <br />
                <span className="font-medium text-gray-900">"{fileToDelete.name}"</span> ?<br />
                Cette action est irréversible.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setFileToDelete(null);
                  }}
                  className="btn-secondary flex-1"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}