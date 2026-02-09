'use client';

import { useState, useEffect } from 'react';
import { 
  Search, Filter, Download, Eye, FileText, Image, Archive, 
  Calendar, User, FolderOpen, File
} from 'lucide-react';
import { mockDocuments, mockProjects, getCurrentUserDynamic, type Document } from '@/lib/mockData';
import ModernLayout from '@/components/layout/ModernLayout';

export default function ClientDocumentsPage() {
  const [currentUser] = useState(getCurrentUserDynamic());
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    // Filtrer les documents pour les projets du client actuel
    const userProjects = mockProjects.filter(project => 
      project.client_id === currentUser?.id
    );
    const projectIds = userProjects.map(project => project.id);
    const userDocuments = mockDocuments.filter(doc => 
      projectIds.includes(doc.project_id)
    );
    setDocuments(userDocuments);
  }, [currentUser]);

  const filteredDocuments = documents.filter(document => {
    const matchesSearch = document.label.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || document.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getFileIcon = (type: string, mimeType: string) => {
    if (mimeType.includes('image')) return Image;
    if (mimeType.includes('zip') || mimeType.includes('archive')) return Archive;
    if (mimeType.includes('pdf') || type === 'contract' || type === 'invoice') return FileText;
    return File;
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'contract':
        return 'Contrat';
      case 'invoice':
        return 'Facture';
      case 'deliverable':
        return 'Livrable';
      case 'other':
        return 'Autre';
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'contract':
        return 'bg-blue-100 text-blue-800';
      case 'invoice':
        return 'bg-green-100 text-green-800';
      case 'deliverable':
        return 'bg-purple-100 text-purple-800';
      case 'other':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getProjectName = (projectId: string) => {
    const project = mockProjects.find(p => p.id === projectId);
    return project?.name || 'Projet inconnu';
  };

  return (
    <ModernLayout 
      title="Mes Documents" 
      subtitle="Consultez et téléchargez vos documents de projet"
      userRole="client"
      userName={currentUser?.name}
    >
      <div className="space-y-6">
        {/* Header avec recherche et filtres */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un document..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Tous les types</option>
                <option value="contract">Contrats</option>
                <option value="invoice">Factures</option>
                <option value="deliverable">Livrables</option>
                <option value="other">Autres</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des documents */}
        <div className="grid gap-4">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((document) => {
              const FileIcon = getFileIcon(document.type, document.mime_type);
              return (
                <div key={document.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileIcon className="w-6 h-6 text-gray-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {document.label}
                        </h3>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(document.type)}`}>
                          {getTypeLabel(document.type)}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <FolderOpen className="w-4 h-4" />
                          <span>{getProjectName(document.project_id)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(document.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>{formatFileSize(document.file_size)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button
                        className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                        title="Prévisualiser"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        className="p-3 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition-colors"
                        title="Télécharger"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun document trouvé</h3>
              <p className="text-gray-500">
                {searchTerm || typeFilter !== 'all' 
                  ? 'Aucun document ne correspond à vos critères de recherche.'
                  : 'Vous n\'avez pas encore de documents disponibles.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Statistiques */}
        {documents.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques des documents</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {documents.filter(d => d.type === 'contract').length}
                </div>
                <div className="text-sm text-gray-500">Contrats</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {documents.filter(d => d.type === 'invoice').length}
                </div>
                <div className="text-sm text-gray-500">Factures</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {documents.filter(d => d.type === 'deliverable').length}
                </div>
                <div className="text-sm text-gray-500">Livrables</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {documents.filter(d => d.type === 'other').length}
                </div>
                <div className="text-sm text-gray-500">Autres</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModernLayout>
  );
}