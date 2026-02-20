'use client';

import { useState, useEffect } from 'react';
import {
  Search, Download, Eye, FileText, Image as ImageIcon, Archive,
  Calendar, FolderOpen, File, AlertCircle, RefreshCw
} from 'lucide-react';
import ModernLayout from '@/components/layout/ModernLayout';
import { supabase } from '@/lib/supabase';

interface Document {
  id: string;
  name: string;
  file_url: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  created_at: string;
  is_signed: boolean;
}

export default function ClientDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    // Lire l'utilisateur depuis localStorage (non-bloquant)
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setCurrentUser({ name: u.name || u.email || 'Client', role: u.role || 'client' });
      } catch { }
    }
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setError('Vous devez être connecté pour voir vos documents.');
        return;
      }

      // Charger les documents de l'utilisateur connecté
      const { data, error: dbError } = await supabase
        .from('documents')
        .select('*')
        .or(`uploaded_by.eq.${session.user.id},client_id.eq.${session.user.id}`)
        .order('created_at', { ascending: false });

      if (dbError) {
        console.error('Erreur chargement documents:', dbError);
        // Essai avec select simple si le filtre échoue
        const { data: allData, error: err2 } = await supabase
          .from('documents')
          .select('*')
          .order('created_at', { ascending: false });

        if (err2) {
          setError(`Impossible de charger les documents: ${err2.message}`);
          return;
        }
        setDocuments(allData || []);
      } else {
        setDocuments(data || []);
      }
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc =>
    (doc.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFileIcon = (mimeType: string) => {
    if (!mimeType) return File;
    if (mimeType.includes('image')) return ImageIcon;
    if (mimeType.includes('zip') || mimeType.includes('archive')) return Archive;
    if (mimeType.includes('pdf') || mimeType.includes('word') || mimeType.includes('spreadsheet')) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '—';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleDownload = (doc: Document) => {
    if (doc.file_url) {
      const a = document.createElement('a');
      a.href = doc.file_url;
      a.download = doc.name;
      a.target = '_blank';
      a.click();
    }
  };

  const handlePreview = (doc: Document) => {
    if (doc.file_url) setPreviewUrl(doc.file_url);
  };

  return (
    <ModernLayout
      title="Mes Documents"
      subtitle="Consultez et téléchargez vos documents de projet"
      userRole="client"
      userName={currentUser?.name}
    >
      <div className="space-y-6">
        {/* Recherche + Actualiser */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={fetchDocuments}
              className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-700"
            >
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </button>
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Chargement des documents...</p>
          </div>
        )}

        {/* Liste */}
        {!loading && (
          <div className="grid gap-4">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => {
                const FileIcon = getFileIcon(doc.mime_type);
                return (
                  <div key={doc.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileIcon className="w-6 h-6 text-gray-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">{doc.name}</h3>
                          {doc.is_signed && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Signé
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{doc.created_at ? new Date(doc.created_at).toLocaleDateString('fr-FR') : '—'}</span>
                          </div>
                          <span>{formatFileSize(doc.file_size)}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {doc.file_url && (
                          <button
                            onClick={() => handlePreview(doc)}
                            className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                            title="Prévisualiser"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-3 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition-colors"
                          title="Télécharger"
                          disabled={!doc.file_url}
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
                  {searchTerm
                    ? 'Aucun document ne correspond à votre recherche.'
                    : "Vous n'avez pas encore de documents disponibles."}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Modal prévisualisation */}
        {previewUrl && (
          <div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
            onClick={() => setPreviewUrl(null)}
          >
            <div className="bg-white rounded-2xl p-2 max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center p-4">
                <h3 className="font-semibold text-gray-900">Aperçu</h3>
                <button onClick={() => setPreviewUrl(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
              </div>
              {previewUrl.includes('.pdf') ? (
                <iframe src={previewUrl} className="w-full h-[70vh] rounded-xl" title="Aperçu PDF" />
              ) : (
                <img src={previewUrl} alt="Aperçu" className="max-w-full max-h-[70vh] object-contain mx-auto rounded-xl" />
              )}
            </div>
          </div>
        )}
      </div>
    </ModernLayout>
  );
}