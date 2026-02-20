# 🚨 PLAN URGENT - 100% FONCTIONNEL POUR DEMAIN

**Date**: 12 février 2026  
**Deadline**: Demain (13 février)  
**Temps disponible**: ~6-8 heures  
**Objectif**: Application 100% fonctionnelle

---

## ⚡ STRATÉGIE EXPRESS

On se concentre sur les **corrections critiques** uniquement pour avoir une app 100% opérationnelle rapidement.

**Pas de temps pour les améliorations optionnelles** (pièces jointes, PDF.js, etc.)

---

## 📋 PLAN D'ACTION (6-8h)

### ✅ PHASE 1: VÉRIFICATION SUPABASE (1h) - PRIORITÉ ABSOLUE

#### Problème détecté
❌ Erreur: `relation "storage.policies" does not exist`

#### Solution

**Étape 1.1: Vérifier les tables essentielles (15 min)**

Exécutez ce script SQL simplifié dans Supabase SQL Editor:

```sql
-- Vérifier les tables principales
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'projects', 'documents', 'messages', 'project_photos', 'project_steps')
ORDER BY table_name;

-- Compter les données
SELECT 'profiles' as table_name, COUNT(*) FROM profiles
UNION ALL SELECT 'projects', COUNT(*) FROM projects
UNION ALL SELECT 'documents', COUNT(*) FROM documents
UNION ALL SELECT 'messages', COUNT(*) FROM messages;
```

**Résultat attendu**: Toutes les tables doivent exister.

**Si des tables manquent**, exécutez `FIX_ALL_TABLES.sql`

---

**Étape 1.2: Vérifier les buckets Storage (10 min)**

1. Aller dans **Supabase Dashboard** → **Storage**
2. Vérifier que ces buckets existent:
   - ✅ `documents`
   - ✅ `photos`

**Si manquants**, créez-les:

```sql
-- Créer bucket documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false);

-- Créer bucket photos  
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true);
```

---

**Étape 1.3: Configurer les politiques Storage (15 min)**

Dans **Supabase Dashboard** → **Storage** → Chaque bucket → **Policies**:

**Pour `documents`:**
```sql
-- Lecture pour utilisateurs authentifiés
CREATE POLICY "Authenticated users can read documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents');

-- Upload pour utilisateurs authentifiés
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');
```

**Pour `photos`:**
```sql
-- Lecture publique
CREATE POLICY "Public can read photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'photos');

-- Upload pour authentifiés
CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'photos');
```

---

**Étape 1.4: Vérifier le trigger de profil (10 min)**

```sql
-- Vérifier le trigger
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

**Si absent**, créez-le:

```sql
-- Fonction de création de profil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'Utilisateur'),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'client')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

**Étape 1.5: Tester l'inscription (10 min)**

1. Lancer l'app: `npm run dev`
2. Aller sur `/register`
3. Créer un compte test
4. Vérifier dans Supabase:
   - Table `auth.users` → Utilisateur créé
   - Table `profiles` → Profil créé automatiquement

---

### ✅ PHASE 2: CORRECTIONS CRITIQUES CODE (2-3h)

#### 2.1: Corriger `uploaded_by` (20 min)

**Fichier**: `src/components/documents/DocumentUpload.tsx`

**Ligne 1 - Ajouter l'import:**
```typescript
import { AuthService } from '@/lib/auth';
```

**Ligne 48 - Modifier la fonction `uploadFile`:**

Cherchez cette section (autour de la ligne 88-101):
```typescript
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
    uploaded_by: 'admin' // ❌ PROBLÈME ICI
  })
```

**Remplacez par:**
```typescript
// Récupérer l'utilisateur actuel
const currentUser = await AuthService.getCurrentUser();

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
    uploaded_by: currentUser?.id || null // ✅ CORRIGÉ
  })
```

---

#### 2.2: Ajouter validation de fichiers (30 min)

**Fichier**: `src/components/documents/DocumentUpload.tsx`

**Après la ligne 33 (après `const generateId = ...`), ajouter:**

```typescript
// Constantes de validation
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

// Fonction de validation
const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Vérifier la taille
  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `${file.name} est trop volumineux (max 10MB)` 
    };
  }
  
  // Vérifier le type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: `${file.name}: type de fichier non autorisé` 
    };
  }
  
  return { valid: true };
};
```

**Modifier la fonction `handleFileSelect` (ligne 35):**

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

  // Afficher les erreurs
  if (errors.length > 0) {
    alert(errors.join('\n'));
  }

  // Ajouter les fichiers valides
  if (validFiles.length > 0) {
    setFiles(prev => [...prev, ...validFiles]);
  }
};
```

---

#### 2.3: Activer Realtime pour la messagerie (1h)

**Étape A: Activer dans Supabase (5 min)**

1. Aller dans **Supabase Dashboard** → **Database** → **Replication**
2. Trouver la table `messages`
3. Activer la réplication (toggle ON)
4. Sauvegarder

**Étape B: Modifier le code (55 min)**

**Fichier**: `src/components/Messaging.tsx`

**Remplacer le `useEffect` (lignes 35-48) par:**

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
    console.log('📱 Mode démo: polling activé');
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }

  // Mode production: Realtime
  console.log('📡 Mode production: Realtime activé');
  
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
        
        setMessages(prev => {
          // Éviter les doublons
          if (prev.some(m => m.id === newMessage.id)) {
            return prev;
          }
          return [...prev, newMessage];
        });
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
      if (status === 'SUBSCRIBED') {
        console.log('✅ Realtime connecté avec succès');
      }
    });

  return () => {
    console.log('🔌 Déconnexion Realtime');
    supabase.removeChannel(channel);
  };
}, [projectId]);
```

---

#### 2.4: Sauvegarder les statuts de timeline (1h)

**Fichier**: `src/components/ProjectTimeline.tsx`

**Ligne 3 - Ajouter les imports:**
```typescript
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
```

**Après la ligne 57 (dans le composant), ajouter:**

```typescript
const [updating, setUpdating] = useState(false);

const handleStepClick = async (step: TimelineStep) => {
  if (!isEditable || updating) return;
  
  setUpdating(true);
  
  try {
    // Déterminer le prochain statut
    const nextStatus = 
      step.status === 'pending' ? 'in_progress' 
      : step.status === 'in_progress' ? 'completed' 
      : 'pending';
    
    console.log(`🔄 Changement statut: ${step.status} → ${nextStatus}`);
    
    // Mettre à jour en base
    const { error } = await supabase
      .from('project_steps')
      .update({ 
        status: nextStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', step.id);
    
    if (error) {
      console.error('❌ Erreur mise à jour statut:', error);
      alert('Erreur lors de la mise à jour du statut');
      return;
    }
    
    console.log('✅ Statut mis à jour avec succès');
    
    // Callback pour rafraîchir
    if (onStepClick) {
      onStepClick(step);
    }
    
  } catch (err) {
    console.error('❌ Erreur:', err);
    alert('Une erreur est survenue');
  } finally {
    setUpdating(false);
  }
};
```

**Modifier la ligne 164:**

Cherchez:
```typescript
onClick={() => isEditable && onStepClick && onStepClick(step)}
```

Remplacez par:
```typescript
onClick={() => handleStepClick(step)}
```

**Ajouter indicateur de chargement (ligne 166):**

Cherchez:
```typescript
<div className={`
  relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 transition-colors duration-300
```

Remplacez par:
```typescript
<div className={`
  relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 transition-colors duration-300
  ${updating ? 'opacity-50 cursor-wait' : ''}
```

---

### ✅ PHASE 3: TESTS COMPLETS (1-2h)

#### 3.1: Tests Authentification (20 min)

- [ ] Créer un nouveau compte via `/register`
- [ ] Vérifier le profil dans Supabase (table `profiles`)
- [ ] Se connecter avec ce compte
- [ ] Vérifier l'accès au dashboard
- [ ] Se déconnecter
- [ ] Se reconnecter

#### 3.2: Tests Upload Documents (20 min)

- [ ] Se connecter en tant qu'Admin
- [ ] Aller dans la GED
- [ ] Uploader un PDF (< 10MB)
- [ ] Vérifier dans Supabase Storage (bucket `documents`)
- [ ] Vérifier dans table `documents` que `uploaded_by` = votre user_id
- [ ] Essayer d'uploader un fichier > 10MB (doit être refusé)
- [ ] Essayer d'uploader un .exe (doit être refusé)
- [ ] Télécharger le document
- [ ] Supprimer le document

#### 3.3: Tests Messagerie (30 min)

- [ ] Ouvrir 2 navigateurs (Chrome + Firefox)
- [ ] Se connecter avec 2 comptes différents
- [ ] Navigateur 1: Envoyer un message
- [ ] Navigateur 2: Vérifier que le message apparaît INSTANTANÉMENT
- [ ] Navigateur 2: Répondre
- [ ] Navigateur 1: Vérifier la réponse instantanée
- [ ] Vérifier les messages dans Supabase (table `messages`)

#### 3.4: Tests Timeline (20 min)

- [ ] Se connecter en tant qu'Admin
- [ ] Aller sur la page Suivi de chantier
- [ ] Cliquer sur une étape "En attente"
- [ ] Vérifier qu'elle passe à "En cours"
- [ ] Vérifier dans Supabase (table `project_steps`) que le statut a changé
- [ ] Cliquer à nouveau
- [ ] Vérifier qu'elle passe à "Terminé"
- [ ] Rafraîchir la page
- [ ] Vérifier que le statut est conservé

#### 3.5: Tests Galerie Photos (20 min)

- [ ] Uploader une photo "Avant"
- [ ] Uploader une photo "En cours"
- [ ] Uploader une photo "Après"
- [ ] Vérifier les badges de couleur
- [ ] Cliquer sur une photo → Lightbox doit s'ouvrir
- [ ] Naviguer avec Précédent/Suivant
- [ ] Télécharger une photo
- [ ] Filtrer par type
- [ ] Supprimer une photo (Admin)

#### 3.6: Tests Signature (20 min)

- [ ] Aller dans la GED
- [ ] Cliquer sur "Signer" un document
- [ ] Vérifier l'aperçu du PDF
- [ ] Remplir le nom
- [ ] Cocher la case de certification
- [ ] Signer
- [ ] Vérifier dans Supabase que `is_signed = true`
- [ ] Vérifier que `signed_by_name` est rempli

---

### ✅ PHASE 4: VÉRIFICATIONS FINALES (30 min)

#### 4.1: Vérifier la console (10 min)

- [ ] Ouvrir DevTools (F12)
- [ ] Console: Pas d'erreurs rouges
- [ ] Network: Pas d'erreurs 404 ou 500
- [ ] Realtime: Messages de connexion visibles

#### 4.2: Tests mobile (10 min)

- [ ] Ouvrir sur mobile (ou DevTools → Responsive)
- [ ] Tester la navigation
- [ ] Tester l'upload
- [ ] Tester la messagerie
- [ ] Vérifier le responsive

#### 4.3: Tests multi-navigateurs (10 min)

- [ ] Chrome: Tout fonctionne
- [ ] Firefox: Tout fonctionne
- [ ] Safari: Tout fonctionne

---

## 📊 CHECKLIST FINALE

### Configuration Supabase
- [ ] Toutes les tables existent
- [ ] Buckets `documents` et `photos` créés
- [ ] Politiques Storage configurées
- [ ] Trigger de profil actif
- [ ] Realtime activé pour `messages`

### Code
- [ ] `uploaded_by` corrigé
- [ ] Validation fichiers ajoutée
- [ ] Realtime messagerie implémenté
- [ ] Sauvegarde statuts timeline implémentée

### Tests
- [ ] Inscription testée
- [ ] Upload testé
- [ ] Messagerie temps réel testée
- [ ] Timeline testée
- [ ] Galerie testée
- [ ] Signature testée
- [ ] Mobile testé
- [ ] Multi-navigateurs testé

---

## 🎯 RÉSULTAT ATTENDU

**Après ces 6-8h de travail:**

✅ Application 100% fonctionnelle  
✅ Toutes les fonctionnalités opérationnelles  
✅ Messagerie en temps réel  
✅ Upload sécurisé  
✅ Timeline interactive  
✅ Tests complets validés  

---

## ⏱️ PLANNING RECOMMANDÉ

### Aujourd'hui (12 février)

**14h-15h**: Phase 1 - Vérification Supabase  
**15h-18h**: Phase 2 - Corrections code (avec pauses)  
**18h-19h**: Pause dîner  
**19h-21h**: Phase 3 - Tests complets  
**21h-21h30**: Phase 4 - Vérifications finales  

### Demain (13 février)

**9h-10h**: Tests finaux et ajustements  
**10h**: ✅ Application 100% prête !

---

## 🚨 EN CAS DE PROBLÈME

### Si une table manque
→ Exécuter `FIX_ALL_TABLES.sql`

### Si le trigger ne fonctionne pas
→ Créer manuellement le profil après inscription

### Si Realtime ne fonctionne pas
→ Vérifier que la réplication est activée dans Supabase

### Si vous êtes bloqué
→ Vérifier la console (F12) pour les erreurs

---

**VOUS AVEZ TOUT CE QU'IL FAUT ! LET'S GO ! 🚀**

**Temps total: 6-8h**  
**Résultat: 100% fonctionnel** ✅
