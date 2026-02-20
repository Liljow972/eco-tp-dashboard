# 📂 GUIDE DES FICHIERS - OÙ SONT LES FONCTIONNALITÉS

**Date**: 11 février 2026  
**Objectif**: Localiser rapidement chaque fonctionnalité dans le code

---

## 🗺️ CARTE DU PROJET

```
eco-tp-dashboard/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx           ← 🔐 Page de connexion
│   │   │   └── register/page.tsx        ← 🔐 Page d'inscription
│   │   ├── (dash)/
│   │   │   ├── projects/page.tsx        ← 📊 Page projets (Timeline, Photos, Messages)
│   │   │   ├── avancement/page.tsx      ← 📈 Suivi de chantier
│   │   │   ├── files/page.tsx           ← 📄 GED (Documents)
│   │   │   └── collaboration/page.tsx   ← 👥 Gestion clients
│   │   └── auth/
│   │       └── callback/route.ts        ← 🔐 Callback Google OAuth
│   ├── components/
│   │   ├── Messaging.tsx                ← 💬 MESSAGERIE
│   │   ├── PhotoGallery.tsx             ← 📸 GALERIE PHOTOS
│   │   ├── ProjectTimeline.tsx          ← 📈 TIMELINE CHANTIER
│   │   ├── documents/
│   │   │   ├── DocumentUpload.tsx       ← 📤 UPLOAD DOCUMENTS
│   │   │   └── SignatureModal.tsx       ← ✍️ SIGNATURE
│   │   └── files/
│   │       └── FileList.tsx             ← 📋 Liste documents
│   ├── lib/
│   │   ├── auth.ts                      ← 🔐 SERVICE AUTHENTIFICATION
│   │   └── supabase.ts                  ← 🗄️ Client Supabase
│   └── contexts/
│       └── AuthContext.tsx              ← 🔐 Context React Auth
└── ...
```

---

## 🔍 FONCTIONNALITÉS PAR FICHIER

### 🔐 AUTHENTIFICATION

#### `src/lib/auth.ts` (202 lignes)
**Responsabilité**: Service d'authentification complet

**Fonctions principales:**
- `signUpWithEmail()` - Inscription avec email/password
- `signInWithEmail()` - Connexion avec email/password
- `signInWithGoogle()` - Connexion Google OAuth
- `getCurrentUser()` - Récupérer l'utilisateur actuel
- `signOut()` - Déconnexion

**État**: ✅ Fonctionnel  
**Problèmes**: Aucun  
**À modifier**: Non

---

#### `src/contexts/AuthContext.tsx`
**Responsabilité**: Context React pour l'authentification

**Fonctions:**
- Provider pour toute l'application
- Gestion de l'état utilisateur
- Écoute des changements d'auth

**État**: ✅ Fonctionnel  
**Problèmes**: Aucun  
**À modifier**: Non

---

#### `src/app/auth/callback/route.ts`
**Responsabilité**: Callback après Google OAuth

**État**: ✅ Fonctionnel  
**Problèmes**: Aucun  
**À modifier**: Non

---

### 💬 MESSAGERIE

#### `src/components/Messaging.tsx` (304 lignes)
**Responsabilité**: Système de messagerie complet

**Fonctions principales:**
- `fetchMessages()` - Récupérer les messages
- `sendMessage()` - Envoyer un message
- Affichage des messages
- Auto-scroll

**État**: ⚠️ Partiellement fonctionnel  
**Problèmes**: 
- ❌ Polling toutes les 5 secondes (pas de temps réel)
- ❌ Pièces jointes non implémentées

**À modifier**: OUI  
**Corrections**:
1. Remplacer polling par Supabase Realtime (lignes 35-48)
2. Ajouter upload de pièces jointes (nouvelle fonctionnalité)

**Détails**: Voir `PLAN_ACTION_100_POURCENT.md` Phase 2 et 3

---

### 📄 UPLOAD DE DOCUMENTS

#### `src/components/documents/DocumentUpload.tsx` (263 lignes)
**Responsabilité**: Upload de documents vers Supabase

**Fonctions principales:**
- `handleFileSelect()` - Sélection de fichiers
- `uploadFile()` - Upload vers Supabase Storage
- Drag & Drop
- Barre de progression

**État**: ⚠️ Fonctionnel avec bugs  
**Problèmes**:
- ❌ `uploaded_by: 'admin'` hardcodé (ligne 98)
- ❌ Pas de validation de taille de fichier
- ❌ Pas de validation de type de fichier

**À modifier**: OUI  
**Corrections**:
1. Ligne 1: Ajouter `import { AuthService } from '@/lib/auth';`
2. Ligne 88: Ajouter `const currentUser = await AuthService.getCurrentUser();`
3. Ligne 98: Remplacer `uploaded_by: 'admin'` par `uploaded_by: currentUser?.id || null`
4. Ligne 35: Ajouter fonction `validateFile()`

**Détails**: Voir `PLAN_ACTION_100_POURCENT.md` Phase 1

---

### ✍️ SIGNATURE DE DOCUMENTS

#### `src/components/documents/SignatureModal.tsx` (182 lignes)
**Responsabilité**: Modal de signature électronique

**Fonctions principales:**
- `handleSign()` - Signer un document
- Aperçu du document (PDF ou image)
- Formulaire de signature

**État**: ✅ Fonctionnel  
**Problèmes**:
- ⚠️ Aperçu PDF basique (iframe simple)
- ⚠️ Pas de signature manuscrite (canvas)

**À modifier**: OPTIONNEL  
**Améliorations possibles**:
1. Remplacer iframe par PDF.js (lignes 84-113)
2. Ajouter canvas pour signature manuscrite

**Détails**: Voir `PLAN_ACTION_100_POURCENT.md` Phase 4

---

### 📈 SUIVI DE CHANTIER

#### `src/components/ProjectTimeline.tsx` (231 lignes)
**Responsabilité**: Timeline visuelle du projet

**Fonctions principales:**
- Affichage des étapes
- Progression globale
- Informations projet

**État**: ⚠️ Fonctionnel mais incomplet  
**Problèmes**:
- ❌ Click sur étape ne sauvegarde pas en base
- ⚠️ Utilise des étapes par défaut si vide

**À modifier**: OUI  
**Corrections**:
1. Ligne 3: Ajouter `import { supabase } from '@/lib/supabase';`
2. Après ligne 57: Ajouter fonction `handleStepClick()`
3. Ligne 164: Modifier `onClick` pour utiliser `handleStepClick`

**Détails**: Voir `PLAN_ACTION_100_POURCENT.md` Phase 1

---

### 📸 GALERIE PHOTOS

#### `src/components/PhotoGallery.tsx`
**Responsabilité**: Galerie photos avec lightbox

**Fonctions principales:**
- Affichage des photos
- Lightbox avec navigation
- Upload avec choix du type
- Filtres par type

**État**: ✅ Fonctionnel  
**Problèmes**: Aucun  
**À modifier**: Non

---

### 📋 LISTE DE DOCUMENTS

#### `src/components/files/FileList.tsx`
**Responsabilité**: Affichage de la liste des documents

**État**: ✅ Fonctionnel  
**Problèmes**: Aucun  
**À modifier**: Non

---

## 🎯 FICHIERS À MODIFIER PRIORITAIREMENT

### 🔴 Priorité 0 (Critique - 45 min)

1. **`src/components/documents/DocumentUpload.tsx`**
   - Corriger `uploaded_by` (15 min)
   - Ajouter validation (30 min)

### 🟡 Priorité 1 (Important - 2h)

2. **`src/components/Messaging.tsx`**
   - Activer Realtime (1h)

3. **`src/components/ProjectTimeline.tsx`**
   - Sauvegarder statuts (1h)

### 🟢 Priorité 2 (Améliorations - 4h)

4. **`src/components/Messaging.tsx`** (suite)
   - Pièces jointes (2h)

5. **Nouveau: `src/components/documents/PDFViewer.tsx`**
   - Créer composant (1h30)

6. **`src/components/documents/SignatureModal.tsx`**
   - Intégrer PDFViewer (30 min)

---

## 📊 STATISTIQUES DU CODE

### Fichiers par état

| État | Nombre | Fichiers |
|------|--------|----------|
| ✅ Parfait | 5 | auth.ts, AuthContext.tsx, PhotoGallery.tsx, FileList.tsx, callback/route.ts |
| ⚠️ À corriger | 3 | DocumentUpload.tsx, Messaging.tsx, ProjectTimeline.tsx |
| ❌ À créer | 1 | PDFViewer.tsx (optionnel) |

### Lignes de code à modifier

| Fichier | Lignes totales | Lignes à modifier | % |
|---------|----------------|-------------------|---|
| DocumentUpload.tsx | 263 | ~20 | 8% |
| Messaging.tsx | 304 | ~50 | 16% |
| ProjectTimeline.tsx | 231 | ~30 | 13% |

---

## 🔧 OUTILS DE DÉVELOPPEMENT

### Commandes utiles

```bash
# Trouver un fichier
find src -name "Messaging.tsx"

# Chercher un texte dans tous les fichiers
grep -r "uploaded_by" src/

# Compter les lignes d'un fichier
wc -l src/components/Messaging.tsx

# Ouvrir dans VS Code
code src/components/Messaging.tsx
```

### Extensions VS Code recommandées

- **ES7+ React/Redux/React-Native snippets** - Snippets React
- **Prettier** - Formatage automatique
- **ESLint** - Linting
- **TypeScript** - Support TypeScript
- **Tailwind CSS IntelliSense** - Autocomplétion Tailwind

---

## 📖 COMMENT NAVIGUER

### Pour trouver une fonctionnalité

1. **Authentification** → `src/lib/auth.ts`
2. **Messagerie** → `src/components/Messaging.tsx`
3. **Upload documents** → `src/components/documents/DocumentUpload.tsx`
4. **Signature** → `src/components/documents/SignatureModal.tsx`
5. **Timeline** → `src/components/ProjectTimeline.tsx`
6. **Photos** → `src/components/PhotoGallery.tsx`

### Pour modifier une page

1. **Page connexion** → `src/app/(auth)/login/page.tsx`
2. **Page projets** → `src/app/(dash)/projects/page.tsx`
3. **Page GED** → `src/app/(dash)/files/page.tsx`
4. **Page suivi** → `src/app/(dash)/avancement/page.tsx`

---

## 🎯 RÉSUMÉ

**Fichiers à modifier pour 100%:**
1. ✅ `DocumentUpload.tsx` - 2 corrections (45 min)
2. ✅ `Messaging.tsx` - Realtime + Pièces jointes (3h)
3. ✅ `ProjectTimeline.tsx` - Sauvegarde statuts (1h)
4. 💡 `PDFViewer.tsx` - Nouveau composant (2h - optionnel)

**Total: 3-7h selon objectifs**

---

**Bon développement ! 🚀**
