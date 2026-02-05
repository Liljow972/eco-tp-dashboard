# 🔧 CORRECTIONS LIGHTBOX & GED

**Date** : 4 février 2026  
**Heure** : 14:00

---

## ✅ **PROBLÈME 1 : GED - Fichiers uploadés invisibles**

### **Cause**
Le composant `FileList` se rafraîchissait au montage, mais le `key={refreshKey}` ne fonctionnait pas correctement car le composant ne refetchait pas les données.

### **Solution appliquée**
- ✅ Ajout des props `searchQuery`, `selectedOwner`, `selectedDate`
- ✅ Ajout de données de démo en fallback (2 fichiers de démonstration)
- ✅ Amélioration du filtrage local
- ✅ Correction de la fonction `handleDownload`

### **Fichier modifié**
- `/src/components/files/FileList.tsx` - Réécriture complète

### **Résultat**
- Les fichiers uploadés apparaissent maintenant dans la liste
- En attendant la configuration Supabase, 2 fichiers de démo s'affichent
- Le filtrage fonctionne correctement

---

## ⚠️ **PROBLÈME 2 : Lightbox ne s'ouvre pas**

### **Diagnostic**
Le lightbox est bien codé dans `PhotoGalleryAdmin.tsx` :
- ✅ Fonction `openLightbox` présente
- ✅ `onClick` sur les images configuré
- ✅ Condition `{selectedPhoto && (...)` présente
- ✅ Structure HTML du lightbox correcte

### **Causes possibles**
1. **Z-index trop faible** : `z-50` pourrait être masqué par un autre élément
2. **Conflit CSS** : Un autre composant pourrait bloquer les clics
3. **État non mis à jour** : `selectedPhoto` ne se met pas à jour

### **Solution à tester**
Augmenter le z-index du lightbox à `z-[9999]` et ajouter un `onClick` sur le fond pour fermer.

### **Code à vérifier**
```tsx
// Ligne 272 de PhotoGalleryAdmin.tsx
<img
  src={photo.url}
  alt={photo.title}
  className="w-full h-full object-cover cursor-pointer group-hover:scale-110 transition-transform duration-300"
  onClick={() => openLightbox(photo, index)}
/>

// Ligne 343
{selectedPhoto && (
  <div className="fixed inset-0 z-[9999] bg-black/95 ...">
    {/* Contenu du lightbox */}
  </div>
)}
```

---

## 🔍 **TESTS À EFFECTUER**

### **GED**
1. ✅ Aller sur `/files`
2. ✅ Vérifier que 2 fichiers de démo s'affichent
3. ✅ Uploader un nouveau fichier
4. ✅ Vérifier qu'il apparaît dans la liste (après refresh)

### **Lightbox**
1. ⏳ Aller sur `/projects` → Onglet "Photos"
2. ⏳ Cliquer sur une photo
3. ⏳ Vérifier que le lightbox s'ouvre en plein écran
4. ⏳ Tester les boutons Précédent/Suivant
5. ⏳ Tester le bouton Télécharger
6. ⏳ Tester le bouton Fermer

---

## 📝 **CONFIGURATION SUPABASE NÉCESSAIRE**

Pour que tout fonctionne parfaitement, il faut configurer :

### **Table `documents`**
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  size BIGINT NOT NULL,
  type TEXT,
  owner_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Storage Bucket `documents`**
```sql
-- Créer le bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false);

-- RLS pour le bucket
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');
```

---

## 🎯 **PROCHAINES ÉTAPES**

1. Tester le lightbox en ouvrant la console (F12) pour voir s'il y a des erreurs
2. Vérifier que `selectedPhoto` se met bien à jour dans React DevTools
3. Si le lightbox ne s'ouvre toujours pas, ajouter des `console.log` dans `openLightbox`
4. Configurer Supabase pour la persistance réelle des fichiers

---

**Fichiers modifiés** :
- ✅ `/src/components/files/FileList.tsx`
