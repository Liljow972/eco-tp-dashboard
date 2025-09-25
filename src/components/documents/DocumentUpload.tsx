'use client';

import { useState, useRef } from 'react';
import { Upload, File, X, Check, AlertCircle } from 'lucide-react';
import { createSupabaseClient } from '@/lib/supabase';

interface DocumentUploadProps {
  clientId: string;
  projectId?: string;
  onUploadComplete?: (document: any) => void;
  className?: string;
}

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export default function DocumentUpload({ 
  clientId, 
  projectId, 
  onUploadComplete,
  className = '' 
}: DocumentUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createSupabaseClient();

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: UploadFile[] = Array.from(selectedFiles).map(file => ({
      file,
      id: generateId(),
      progress: 0,
      status: 'pending'
    }));

    setFiles(prev => [...prev, ...newFiles]);
  };

  const uploadFile = async (uploadFile: UploadFile) => {
    try {
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, status: 'uploading', progress: 0 }
          : f
      ));

      const fileExt = uploadFile.file.name.split('.').pop();
      const fileName = `${Date.now()}-${uploadFile.file.name}`;
      const filePath = `documents/${clientId}/${fileName}`;

      // Upload vers Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, uploadFile.file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Simuler la progression
      for (let i = 0; i <= 100; i += 10) {
        setFiles(prev => prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, progress: i }
            : f
        ));
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Obtenir l'URL publique
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Enregistrer les métadonnées en base
      const { data: documentData, error: dbError } = await supabase
        .from('documents')
        .insert({
          client_id: clientId,
          project_id: projectId || null,
          name: uploadFile.file.name,
          file_path: filePath,
          file_url: urlData.publicUrl,
          file_size: uploadFile.file.size,
          mime_type: uploadFile.file.type,
          uploaded_by: 'admin' // À remplacer par l'utilisateur connecté
        })
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, status: 'success', progress: 100 }
          : f
      ));

      if (onUploadComplete) {
        onUploadComplete(documentData);
      }

    } catch (error) {
      console.error('Erreur upload:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, status: 'error', error: errorMessage }
          : f
      ));
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Zone de drop */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Glissez vos fichiers ici
        </h3>
        <p className="text-gray-500 mb-4">
          ou cliquez pour sélectionner des fichiers
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Sélectionner des fichiers
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
        />
      </div>

      {/* Liste des fichiers */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Fichiers sélectionnés</h4>
          {files.map((fileItem) => (
            <div key={fileItem.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <File className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{fileItem.file.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(fileItem.file.size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {fileItem.status === 'success' && (
                    <Check className="w-5 h-5 text-green-500" />
                  )}
                  {fileItem.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  {fileItem.status === 'pending' && (
                    <button
                      onClick={() => uploadFile(fileItem)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Upload
                    </button>
                  )}
                  <button
                    onClick={() => removeFile(fileItem.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {fileItem.status === 'uploading' && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${fileItem.progress}%` }}
                  ></div>
                </div>
              )}
              
              {fileItem.status === 'error' && fileItem.error && (
                <p className="text-sm text-red-600 mt-1">{fileItem.error}</p>
              )}
            </div>
          ))}
          
          {files.some(f => f.status === 'pending') && (
            <button
              onClick={() => {
                files
                  .filter(f => f.status === 'pending')
                  .forEach(f => uploadFile(f));
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
            >
              Uploader tous les fichiers
            </button>
          )}
        </div>
      )}
    </div>
  );
}