# 🚀 DÉMARRAGE IMMÉDIAT - 100% POUR DEMAIN

**Date**: 12 février 2026  
**Deadline**: 13 février 2026  
**Action**: COMMENCER MAINTENANT

---

## ⚡ ÉTAPE 1: VÉRIFICATION SUPABASE (15 MIN)

### Action immédiate

1. **Ouvrir Supabase Dashboard**
   - Aller sur: https://supabase.com/dashboard
   - Sélectionner votre projet

2. **Exécuter le script de vérification**
   - Cliquer sur **SQL Editor** (dans le menu gauche)
   - Cliquer sur **New query**
   - Copier-coller le contenu de `VERIFICATION_RAPIDE.sql`
   - Cliquer sur **Run** (ou Ctrl+Enter)

3. **Analyser les résultats**

#### ✅ Résultats attendus:

**Section "📊 TABLES":**
```
profiles         - X colonnes
projects         - X colonnes
project_steps    - X colonnes
documents        - X colonnes
messages         - X colonnes
notifications    - X colonnes
project_photos   - X colonnes
```
→ **7 tables doivent apparaître**

**Section "⚡ TRIGGER":**
```
on_auth_user_created | auth.users
```
→ **Le trigger doit exister**

**Section "🗄️ BUCKETS":**
```
documents | 🔒 Privé
photos    | ✅ Public
```
→ **2 buckets doivent exister**

---

### ❌ SI DES ÉLÉMENTS MANQUENT

#### Si des tables manquent:
```bash
# Exécuter FIX_ALL_TABLES.sql dans SQL Editor
```

#### Si les buckets manquent:

**Dans Supabase Dashboard → Storage → New bucket:**

1. Créer bucket `documents`:
   - Name: `documents`
   - Public: ❌ Non
   - Cliquer sur **Create bucket**

2. Créer bucket `photos`:
   - Name: `photos`
   - Public: ✅ Oui
   - Cliquer sur **Create bucket**

#### Si le trigger manque:

**Exécuter dans SQL Editor:**
```sql
-- Fonction
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

## ⚡ ÉTAPE 2: CORRECTIONS CODE (2-3H)

### 2.1: Corriger DocumentUpload.tsx (20 min)

**Ouvrir le fichier:**
```bash
code src/components/documents/DocumentUpload.tsx
```

**Modification 1 - Ligne 1:**

Ajouter après les imports existants:
```typescript
import { AuthService } from '@/lib/auth';
```

**Modification 2 - Ligne 88:**

Chercher:
```typescript
uploaded_by: 'admin'
```

Remplacer par:
```typescript
// Juste avant l'insert, ajouter:
const currentUser = await AuthService.getCurrentUser();

// Puis dans l'insert:
uploaded_by: currentUser?.id || null
```

**Modification 3 - Ligne 33:**

Ajouter après `const generateId = ...`:
```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const validateFile = (file: File) => {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `${file.name} trop volumineux (max 10MB)` };
  }
  return { valid: true };
};
```

**Modification 4 - Ligne 35:**

Remplacer la fonction `handleFileSelect`:
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

  if (errors.length > 0) alert(errors.join('\n'));
  if (validFiles.length > 0) setFiles(prev => [...prev, ...validFiles]);
};
```

**Sauvegarder** (Cmd+S ou Ctrl+S)

---

### 2.2: Activer Realtime Messagerie (1h)

**Étape A: Activer dans Supabase (5 min)**

1. **Supabase Dashboard** → **Database** → **Replication**
2. Trouver la table `messages`
3. Toggle **ON** (activer)
4. Sauvegarder

**Étape B: Modifier le code (55 min)**

**Ouvrir le fichier:**
```bash
code src/components/Messaging.tsx
```

**Chercher le useEffect (ligne 35-48):**

Remplacer TOUT le useEffect par:
```typescript
useEffect(() => {
  AuthService.getCurrentUser().then(user => {
    if (user) {
      setCurrentUserId(user.id);
      setCurrentUserRole(user.role);
      setCurrentUserName(user.name);
    }
  });

  fetchMessages();

  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId);
  
  if (!isUUID) {
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }

  const channel = supabase
    .channel(`messages:${projectId}`)
    .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `project_id=eq.${projectId}`
      },
      async (payload) => {
        const user = await AuthService.getCurrentUser();
        const newMessage = {
          ...payload.new,
          is_own: payload.new.sender_id === user?.id
        } as Message;
        setMessages(prev => {
          if (prev.some(m => m.id === newMessage.id)) return prev;
          return [...prev, newMessage];
        });
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}, [projectId]);
```

**Sauvegarder**

---

### 2.3: Sauvegarder Statuts Timeline (1h)

**Ouvrir le fichier:**
```bash
code src/components/ProjectTimeline.tsx
```

**Ligne 3 - Ajouter imports:**
```typescript
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
```

**Ligne 57 - Ajouter dans le composant:**
```typescript
const [updating, setUpdating] = useState(false);

const handleStepClick = async (step: TimelineStep) => {
  if (!isEditable || updating) return;
  setUpdating(true);
  
  try {
    const nextStatus = 
      step.status === 'pending' ? 'in_progress' 
      : step.status === 'in_progress' ? 'completed' 
      : 'pending';
    
    const { error } = await supabase
      .from('project_steps')
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq('id', step.id);
    
    if (error) {
      alert('Erreur mise à jour');
      return;
    }
    
    if (onStepClick) onStepClick(step);
  } finally {
    setUpdating(false);
  }
};
```

**Ligne 164 - Modifier onClick:**

Chercher:
```typescript
onClick={() => isEditable && onStepClick && onStepClick(step)}
```

Remplacer par:
```typescript
onClick={() => handleStepClick(step)}
```

**Sauvegarder**

---

## ⚡ ÉTAPE 3: TESTER (1H)

### Test rapide (30 min)

```bash
# Lancer l'app
npm run dev
```

**Ouvrir:** http://localhost:3000

**Tests:**

1. **Inscription** (5 min)
   - Créer un compte
   - Vérifier dans Supabase que le profil est créé

2. **Upload** (5 min)
   - Uploader un PDF
   - Vérifier que `uploaded_by` = votre ID
   - Essayer fichier > 10MB (doit refuser)

3. **Messagerie** (10 min)
   - Ouvrir 2 navigateurs
   - Envoyer message → doit apparaître instantanément

4. **Timeline** (5 min)
   - Cliquer sur étape
   - Vérifier changement de statut
   - Rafraîchir → statut conservé

5. **Console** (5 min)
   - F12 → Console
   - Pas d'erreurs rouges

---

## ✅ CHECKLIST RAPIDE

- [ ] Supabase vérifié (tables, buckets, trigger)
- [ ] DocumentUpload.tsx modifié
- [ ] Realtime activé
- [ ] Messaging.tsx modifié
- [ ] ProjectTimeline.tsx modifié
- [ ] App lancée (`npm run dev`)
- [ ] Tests effectués
- [ ] Pas d'erreurs console

---

## 🎯 RÉSULTAT

**Après ces 3-4h:**
✅ Application 90-100% fonctionnelle  
✅ Prête pour demain

---

## 🚨 AIDE RAPIDE

### Erreur "uploaded_by"
→ Vérifier que l'import `AuthService` est présent

### Realtime ne fonctionne pas
→ Vérifier que la réplication est activée dans Supabase

### Timeline ne sauvegarde pas
→ Vérifier que la table `project_steps` existe

### Erreur console
→ F12 → Console → Copier l'erreur et analyser

---

**COMMENCEZ MAINTENANT ! 🚀**

**Ordre d'exécution:**
1. VERIFICATION_RAPIDE.sql (15 min)
2. DocumentUpload.tsx (20 min)
3. Messaging.tsx (1h)
4. ProjectTimeline.tsx (1h)
5. Tests (1h)

**Total: 3-4h → 100% fonctionnel** ✅
