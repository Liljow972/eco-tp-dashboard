# 🚀 PLAN D'ACTION - ATTEINDRE 100% DE FONCTIONNALITÉ

**Date**: 11 février 2026  
**Objectif**: Rendre l'application Eco TP Dashboard 100% fonctionnelle  
**État actuel**: 75%  
**Temps estimé**: 8-10 heures

---

## 📊 PRIORITÉS

| Priorité | Tâche | Impact | Temps | Difficulté |
|----------|-------|--------|-------|------------|
| 🔴 **P0** | Vérifier configuration Supabase | Critique | 1h | Facile |
| 🔴 **P0** | Corriger uploaded_by dans DocumentUpload | Haute | 15min | Facile |
| 🟡 **P1** | Activer Realtime pour messagerie | Haute | 1h | Moyen |
| 🟡 **P1** | Ajouter validation taille fichiers | Moyenne | 30min | Facile |
| 🟡 **P1** | Implémenter sauvegarde statut timeline | Moyenne | 1h | Moyen |
| 🟢 **P2** | Ajouter pièces jointes messages | Moyenne | 2h | Moyen |
| 🟢 **P2** | Améliorer aperçu PDF (PDF.js) | Moyenne | 2h | Difficile |
| 🔵 **P3** | Support documents Office | Basse | 3h | Difficile |
| 🔵 **P3** | Signature manuscrite (canvas) | Basse | 2h | Moyen |

---

## 🔴 PHASE 0 : VÉRIFICATION (1-2h)

### Objectif
Vérifier que toute l'infrastructure Supabase est correctement configurée.

### Tâches

#### 1. Vérifier les tables Supabase (30min)

**Script SQL à exécuter dans Supabase SQL Editor:**

```sql
-- 1. Vérifier toutes les tables
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN (
    'profiles',
    'projects', 
    'project_steps',
    'documents',
    'messages',
    'notifications',
    'project_photos'
)
ORDER BY table_name;

-- 2. Vérifier le trigger de création de profil
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 3. Vérifier les politiques RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 4. Compter les données existantes
SELECT 'profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'projects', COUNT(*) FROM projects
UNION ALL
SELECT 'documents', COUNT(*) FROM documents
UNION ALL
SELECT 'messages', COUNT(*) FROM messages
UNION ALL
SELECT 'project_photos', COUNT(*) FROM project_photos;
```

**Résultats attendus:**
- ✅ Toutes les tables existent
- ✅ Trigger `on_auth_user_created` existe
- ✅ Politiques RLS configurées
- ✅ Au moins quelques données de test

#### 2. Vérifier les buckets Storage (15min)

**Dans Supabase Dashboard → Storage:**

- [ ] Bucket `documents` existe
- [ ] Bucket `photos` existe
- [ ] Politiques de bucket configurées (qui peut upload/download)

**Si manquants, créer:**

```sql
-- Créer bucket documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false);

-- Créer bucket photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true);

-- Politique: Tout le monde peut lire les photos
CREATE POLICY "Public photos read"
ON storage.objects FOR SELECT
USING (bucket_id = 'photos');

-- Politique: Utilisateurs authentifiés peuvent uploader
CREATE POLICY "Authenticated users upload"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id IN ('documents', 'photos') 
    AND auth.role() = 'authenticated'
);
```

#### 3. Tester l'inscription (30min)

**Test manuel:**

1. Ouvrir l'application en local: `npm run dev`
2. Aller sur `/register`
3. Créer un compte avec un vrai email
4. Vérifier dans Supabase:
   - Table `auth.users` → Nouvel utilisateur
   - Table `profiles` → Profil créé automatiquement
5. Se connecter avec ce compte
6. Vérifier l'accès au dashboard

**Problèmes possibles:**
- ❌ Profil non créé → Vérifier le trigger
- ❌ Erreur RLS → Vérifier les politiques
- ❌ Erreur email → Vérifier SMTP Supabase

#### 4. Tester l'upload de documents (15min)

1. Se connecter en tant qu'admin
2. Aller dans la GED
3. Uploader un fichier PDF
4. Vérifier:
   - Fichier dans bucket `documents`
   - Métadonnées dans table `documents`
   - Fichier visible dans la liste

---

## 🔴 PHASE 1 : CORRECTIONS CRITIQUES (2-3h)

### 1. Corriger `uploaded_by` dans DocumentUpload (15min)

**Fichier:** `src/components/documents/DocumentUpload.tsx`

**Problème:** Ligne 98, `uploaded_by: 'admin'` est hardcodé.

**Solution:**

```typescript
// Ligne 1: Ajouter l'import
import { AuthService } from '@/lib/auth';

// Ligne 88-99: Remplacer
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
    uploaded_by: 'admin' // ❌ PROBLÈME ICI
  })
  .select()
  .single();

// PAR:
const currentUser = await AuthService.getCurrentUser();

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
    uploaded_by: currentUser?.id || null // ✅ CORRIGÉ
  })
  .select()
  .single();
```

### 2. Ajouter validation de taille de fichiers (30min)

**Fichier:** `src/components/documents/DocumentUpload.tsx`

**Ajouter après la ligne 33:**

```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/gif'
];

const validateFile = (file: File): { valid: boolean; error?: string } => {
  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `${file.name} est trop volumineux (max 10MB)` 
    };
  }
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: `${file.name} : type de fichier non autorisé` 
    };
  }
  
  return { valid: true };
};
```

**Modifier `handleFileSelect` (ligne 35):**

```typescript
const handleFileSelect = (selectedFiles: FileList | null) => {
  if (!selectedFiles) return;

  const validFiles: UploadFile[] = [];
  const errors: string[] = [];

  Array.from(selectedFiles).forEach(file => {
    const validation = validateFile(file);
    
    if (validation.valid) {
      validFiles.push({
        file,
        id: generateId(),
        progress: 0,
        status: 'pending'
      });
    } else {
      errors.push(validation.error!);
    }
  });

  if (errors.length > 0) {
    alert(errors.join('\n'));
  }

  if (validFiles.length > 0) {
    setFiles(prev => [...prev, ...validFiles]);
  }
};
```

### 3. Implémenter sauvegarde statut timeline (1h)

**Fichier:** `src/components/ProjectTimeline.tsx`

**Ajouter après la ligne 3:**

```typescript
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
```

**Ajouter dans le composant (après ligne 57):**

```typescript
const [updating, setUpdating] = useState(false);

const handleStepClick = async (step: TimelineStep) => {
  if (!isEditable || !onStepClick) return;
  
  setUpdating(true);
  
  try {
    // Déterminer le prochain statut
    const nextStatus = 
      step.status === 'pending' ? 'in_progress' 
      : step.status === 'in_progress' ? 'completed' 
      : 'pending';
    
    // Mettre à jour en base
    const { error } = await supabase
      .from('project_steps')
      .update({ 
        status: nextStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', step.id);
    
    if (error) {
      console.error('Erreur mise à jour statut:', error);
      alert('Erreur lors de la mise à jour du statut');
      return;
    }
    
    // Callback pour rafraîchir
    onStepClick(step);
    
  } catch (err) {
    console.error('Erreur:', err);
  } finally {
    setUpdating(false);
  }
};
```

**Modifier la ligne 164:**

```typescript
// AVANT:
onClick={() => isEditable && onStepClick && onStepClick(step)}

// APRÈS:
onClick={() => handleStepClick(step)}
```

**Ajouter indicateur de chargement (ligne 166):**

```typescript
<div className={`
  relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 transition-colors duration-300
  ${updating ? 'opacity-50 cursor-wait' : ''}
  ${isCompleted ? 'border-ecotp-green-100 bg-ecotp-green-500' : isInProgress ? 'border-blue-100 bg-white ring-2 ring-blue-500' : 'border-gray-50 bg-gray-100 text-gray-400'}
`}>
```

---

## 🟡 PHASE 2 : MESSAGERIE TEMPS RÉEL (1-2h)

### Objectif
Remplacer le polling par Supabase Realtime pour des messages instantanés.

### 1. Activer Realtime dans Supabase (5min)

**Dans Supabase Dashboard:**
1. Aller dans **Database** → **Replication**
2. Activer la réplication pour la table `messages`
3. Sauvegarder

### 2. Modifier le composant Messaging (1h)

**Fichier:** `src/components/Messaging.tsx`

**Remplacer le useEffect (lignes 35-48) par:**

```typescript
useEffect(() => {
  // Initialiser l'user
  AuthService.getCurrentUser().then(user => {
    if (user) {
      setCurrentUserId(user.id);
      setCurrentUserRole(user.role);
      setCurrentUserName(user.name);
    }
  });

  // Charger les messages initiaux
  fetchMessages();

  // Vérifier si projectId est un UUID valide
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId);
  
  if (!isUUID) {
    // Mode démo: polling
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }

  // Mode production: Realtime
  const channel = supabase
    .channel(`messages:${projectId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `project_id=eq.${projectId}`
      },
      async (payload) => {
        console.log('📨 Nouveau message reçu:', payload);
        
        const user = await AuthService.getCurrentUser();
        const newMessage = {
          ...payload.new,
          is_own: payload.new.sender_id === user?.id
        } as Message;
        
        setMessages(prev => [...prev, newMessage]);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'messages',
        filter: `project_id=eq.${projectId}`
      },
      (payload) => {
        console.log('🗑️ Message supprimé:', payload);
        setMessages(prev => prev.filter(m => m.id !== payload.old.id));
      }
    )
    .subscribe((status) => {
      console.log('📡 Realtime status:', status);
    });

  return () => {
    console.log('🔌 Déconnexion Realtime');
    supabase.removeChannel(channel);
  };
}, [projectId]);
```

**Avantages:**
- ✅ Messages instantanés (pas de délai)
- ✅ Pas de polling inutile
- ✅ Moins de charge serveur
- ✅ Meilleure expérience utilisateur

### 3. Tester (15min)

1. Ouvrir 2 navigateurs différents
2. Se connecter avec 2 comptes différents
3. Envoyer un message depuis le premier
4. Vérifier qu'il apparaît instantanément dans le second

---

## 🟢 PHASE 3 : PIÈCES JOINTES (2h)

### 1. Créer le bucket pour pièces jointes (5min)

**SQL dans Supabase:**

```sql
-- Créer bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('message_attachments', 'message_attachments', false);

-- Politique de lecture
CREATE POLICY "Authenticated users can read attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'message_attachments');

-- Politique d'upload
CREATE POLICY "Authenticated users can upload attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'message_attachments');
```

### 2. Modifier la table messages (5min)

```sql
-- Ajouter colonne pour les pièces jointes
ALTER TABLE messages 
ADD COLUMN attachments JSONB DEFAULT '[]'::jsonb;

-- Exemple de structure:
-- [
--   {
--     "name": "document.pdf",
--     "url": "https://...",
--     "size": 123456,
--     "type": "application/pdf"
--   }
-- ]
```

### 3. Modifier le composant Messaging (1h30)

**Ajouter état pour les fichiers:**

```typescript
const [attachments, setAttachments] = useState<File[]>([]);
const fileInputRef = useRef<HTMLInputElement>(null);
```

**Fonction d'upload:**

```typescript
const uploadAttachments = async (files: File[]): Promise<any[]> => {
  const uploadedFiles = [];
  
  for (const file of files) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${projectId}/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('message_attachments')
      .upload(filePath, file);
    
    if (error) {
      console.error('Erreur upload:', error);
      continue;
    }
    
    const { data: urlData } = supabase.storage
      .from('message_attachments')
      .getPublicUrl(filePath);
    
    uploadedFiles.push({
      name: file.name,
      url: urlData.publicUrl,
      size: file.size,
      type: file.type
    });
  }
  
  return uploadedFiles;
};
```

**Modifier sendMessage:**

```typescript
const sendMessage = async () => {
  if (!newMessage.trim() && attachments.length === 0) return;
  
  setSending(true);
  setErrorMsg(null);
  
  try {
    const user = await AuthService.getCurrentUser() || { 
      id: 'client-me', 
      name: 'Moi (Démo)', 
      role: 'client' 
    };
    
    // Upload des pièces jointes
    const uploadedAttachments = attachments.length > 0 
      ? await uploadAttachments(attachments) 
      : [];
    
    const messageData = {
      project_id: projectId,
      sender_id: user.id,
      sender_name: user.name || 'Utilisateur',
      content: newMessage.trim(),
      attachments: uploadedAttachments, // ✅ NOUVEAU
      created_at: new Date().toISOString()
    };
    
    // ... reste du code
    
    // Réinitialiser
    setNewMessage('');
    setAttachments([]); // ✅ NOUVEAU
    
  } catch (err: any) {
    console.error('Error sending message:', err);
    setErrorMsg(`Erreur envoi: ${err.message}`);
  } finally {
    setSending(false);
  }
};
```

**Modifier l'UI (ligne 276-299):**

```typescript
<div className="border-t border-gray-200 p-4 bg-white">
  {/* Prévisualisation des pièces jointes */}
  {attachments.length > 0 && (
    <div className="mb-3 flex flex-wrap gap-2">
      {attachments.map((file, idx) => (
        <div 
          key={idx} 
          className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 text-sm"
        >
          <Paperclip className="w-4 h-4 text-gray-500" />
          <span className="text-gray-700">{file.name}</span>
          <button
            onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
            className="text-gray-400 hover:text-red-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )}
  
  <div className="flex items-center gap-3">
    <input
      ref={fileInputRef}
      type="file"
      multiple
      className="hidden"
      onChange={(e) => {
        if (e.target.files) {
          setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
        }
      }}
    />
    <button
      onClick={() => fileInputRef.current?.click()}
      className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
      title="Joindre un fichier"
    >
      <Paperclip className="w-5 h-5" />
    </button>
    {/* ... reste du code */}
  </div>
</div>
```

**Afficher les pièces jointes dans les messages (ligne 256):**

```typescript
<p className="text-sm whitespace-pre-wrap">{message.content}</p>

{/* ✅ NOUVEAU: Afficher les pièces jointes */}
{message.attachments && message.attachments.length > 0 && (
  <div className="mt-2 space-y-1">
    {message.attachments.map((attachment: any, idx: number) => (
      <a
        key={idx}
        href={attachment.url}
        target="_blank"
        rel="noreferrer"
        className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
          message.is_own 
            ? 'bg-ecotp-green-700 hover:bg-ecotp-green-800' 
            : 'bg-gray-100 hover:bg-gray-200'
        }`}
      >
        <Paperclip className="w-3 h-3" />
        <span>{attachment.name}</span>
        <span className="text-[10px] opacity-70">
          ({(attachment.size / 1024).toFixed(0)} KB)
        </span>
      </a>
    ))}
  </div>
)}
```

---

## 🟢 PHASE 4 : AMÉLIORER APERÇU PDF (2h)

### 1. Installer PDF.js (5min)

```bash
npm install pdfjs-dist
npm install --save-dev @types/pdfjs-dist
```

### 2. Créer composant PDFViewer (1h30)

**Nouveau fichier:** `src/components/documents/PDFViewer.tsx`

```typescript
'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Configurer le worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  url: string;
  fileName: string;
}

export default function PDFViewer({ url, fileName }: PDFViewerProps) {
  const [pdf, setPdf] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Charger le PDF
  useEffect(() => {
    const loadPDF = async () => {
      try {
        setLoading(true);
        const loadingTask = pdfjsLib.getDocument(url);
        const pdfDoc = await loadingTask.promise;
        setPdf(pdfDoc);
        setNumPages(pdfDoc.numPages);
      } catch (error) {
        console.error('Erreur chargement PDF:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPDF();
  }, [url]);

  // Rendre la page actuelle
  useEffect(() => {
    if (!pdf || !canvasRef.current) return;

    const renderPage = async () => {
      const page = await pdf.getPage(currentPage);
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current!;
      const context = canvas.getContext('2d')!;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      await page.render(renderContext).promise;
    };

    renderPage();
  }, [pdf, currentPage, scale]);

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(numPages, prev + 1));
  };

  const zoomIn = () => {
    setScale(prev => Math.min(3, prev + 0.2));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(0.5, prev - 0.2));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ecotp-green-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 bg-gray-100 border-b">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="p-2 hover:bg-gray-200 rounded disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium">
            {currentPage} / {numPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === numPages}
            className="p-2 hover:bg-gray-200 rounded disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            className="p-2 hover:bg-gray-200 rounded"
            title="Zoom arrière"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium w-16 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            className="p-2 hover:bg-gray-200 rounded"
            title="Zoom avant"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>

        <a
          href={url}
          download={fileName}
          className="flex items-center gap-2 px-3 py-2 bg-ecotp-green-600 text-white rounded-lg hover:bg-ecotp-green-700 text-sm"
        >
          <Download className="w-4 h-4" />
          Télécharger
        </a>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto bg-gray-50 p-4">
        <div className="flex justify-center">
          <canvas ref={canvasRef} className="shadow-lg" />
        </div>
      </div>
    </div>
  );
}
```

### 3. Utiliser PDFViewer dans SignatureModal (15min)

**Fichier:** `src/components/documents/SignatureModal.tsx`

**Ligne 1: Ajouter import:**

```typescript
import PDFViewer from './PDFViewer';
```

**Lignes 84-113: Remplacer:**

```typescript
{/* Preview Document */}
<div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm min-h-[400px] flex items-center justify-center relative overflow-hidden">
  {document.url.endsWith('.pdf') ? (
    <PDFViewer url={document.url} fileName={document.name} />
  ) : (
    <div className="text-center p-8">
      <img
        src={document.url}
        alt="Aperçu"
        className="max-w-full max-h-[400px] object-contain mx-auto rounded shadow-sm"
        onError={(e) => (e.currentTarget.style.display = 'none')}
      />
      <p className="mt-4 text-sm text-gray-500">
        Aperçu du document. Veuillez le télécharger pour une lecture complète si nécessaire.
      </p>
      <a
        href={document.url}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-block text-ecotp-green-600 hover:text-ecotp-green-700 underline text-sm"
      >
        Ouvrir dans un nouvel onglet
      </a>
    </div>
  )}
</div>
```

---

## 📋 CHECKLIST FINALE

### Configuration
- [ ] Toutes les tables Supabase vérifiées
- [ ] Tous les buckets Storage créés
- [ ] RLS configuré et testé
- [ ] Trigger de profil actif
- [ ] Realtime activé pour messages

### Corrections P0
- [ ] `uploaded_by` corrigé
- [ ] Validation taille fichiers
- [ ] Sauvegarde statut timeline

### Fonctionnalités P1
- [ ] Messagerie temps réel
- [ ] Pièces jointes messages

### Améliorations P2
- [ ] Aperçu PDF avancé (PDF.js)

### Tests
- [ ] Inscription testée
- [ ] Upload document testé
- [ ] Messagerie temps réel testée
- [ ] Pièces jointes testées
- [ ] Aperçu PDF testé
- [ ] Tests sur mobile
- [ ] Tests multi-navigateurs

---

## 🎯 RÉSULTAT ATTENDU

Après toutes ces phases:

**État final: 95-100% Fonctionnel** ✅

- ✅ Inscription/Connexion: 100%
- ✅ Messagerie temps réel: 100%
- ✅ Upload documents: 100%
- ✅ Signature: 100%
- ✅ Aperçu PDF: 100%
- ✅ Suivi chantier: 100%
- ✅ Galerie photos: 100%

**Temps total estimé:** 8-10 heures

**Prochaine étape:** Commencer par la Phase 0 (Vérification) 🚀
