'use client';

import { useState, useEffect } from 'react';
import { File, Download, Trash2, Eye, Calendar, User } from 'lucide-react';
import { createSupabaseClient } from '@/lib/supabase';

interface Document {
  id: string;
  client_id: string;
  project_id?: string;
  name: string;
  file_path: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  uploaded_by: string;
  created_at: string;
}

interface DocumentListProps {
  clientId: string;
  projectId?: string;
  onDocumentDeleted?: (documentId: string) => void;
  className?: string;
}

export default function DocumentList({ 
  clientId, 
  projectId, 
  onDocumentDeleted,
  className = '' 
}: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseClient();

  useEffect(() => {
    fetchDocuments();
  }, [clientId, projectId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('documents')
        .select('*')
        .eq('client_id', clientId);

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des documents:', error);
        return;
      }

      setDocuments(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(doc.file_path);

      if (error) {
        console.error('Erreur téléchargement:', error);
        return;
      }

      // Créer un lien de téléchargement
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (doc: Document) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${doc.name}" ?`)) {
      return;
    }

    try {
      // Supprimer le fichier du storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([doc.file_path]);

      if (storageError) {
        console.error('Erreur suppression storage:', storageError);
      }

      // Supprimer l'enregistrement de la base
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', doc.id);

      if (dbError) {
        console.error('Erreur suppression DB:', dbError);
        return;
      }

      // Mettre à jour la liste locale
      setDocuments(prev => prev.filter(d => d.id !== doc.id));
      
      if (onDocumentDeleted) {
        onDocumentDeleted(doc.id);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('image')) return '🖼️';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📈';
    return '📁';
  };

  if (loading) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Chargement des documents...</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun document</h3>
        <p className="text-gray-500">
          {projectId 
            ? 'Aucun document n\'a été uploadé pour ce projet.'
            : 'Aucun document n\'a été uploadé pour ce client.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Documents ({documents.length})
        </h3>
      </div>

      <div className="space-y-3">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className="text-2xl">
                  {getFileIcon(doc.mime_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{doc.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <span>{formatFileSize(doc.file_size)}</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(doc.created_at)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{doc.uploaded_by}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.open(doc.file_url, '_blank')}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Prévisualiser"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDownload(doc)}
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Télécharger"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(doc)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}