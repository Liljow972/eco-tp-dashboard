# 📋 PLAN D'ACTION - REVUE COMPLÈTE DES FONCTIONNALITÉS

**Date** : 4 février 2026  
**Objectif** : Finaliser toutes les fonctionnalités avant configuration Supabase + Google OAuth

---

## ✅ **MODIFICATIONS À FAIRE**

### 1. **SIDEBAR - Logo Blanc**
- [ ] Remplacer `LOGO_ECO_TP-05.png` par `LOGO_ECO_TP-06.png` (logo blanc)
- **Fichier** : `src/components/shell/Sidebar.tsx`

---

### 2. **COLLABORATION - Ajout de Tâches**
- [ ] Corriger le bouton "Ajouter une tâche" qui ne fonctionne pas
- **Fichier** : `src/app/(dash)/collaboration/page.tsx`
- **Action** : Implémenter l'ajout de tâches dans le Kanban

---

### 3. **SUIVI CHANTIER - Simplification**
- [ ] **Cacher** "Points d'attention" (non dynamique)
- [ ] **Cacher** "Impact Écologique" (non dynamique)
- [ ] **Ajouter** Galerie photo avec lightbox
- [ ] **Ajouter** Photos avant/après du chantier
- [ ] **Bouton "Générer étape"** : Rendre fonctionnel OU supprimer
- [ ] **Bouton "Modifier"** : Doit mettre à jour les infos après validation
- [ ] **Cacher** Météo (non nécessaire)
- **Fichier** : `src/app/(dash)/avancement/page.tsx`

---

### 4. **TABLEAU DE BORD - Simplification**
- [ ] **Supprimer/Cacher** "Passer au niveau supérieur"
- [ ] **Remplacer par** : Section "Projets récents / Mis à jour"
- **Fichier** : `src/app/(dash)/dashboard/page.tsx`

---

### 5. **GED (Gestion Électronique de Documents)**
- [ ] **Upload de documents** : Fonctionnel + limite 5MB
- [ ] **Recherche & Filtres** : Ajouter bouton "Rechercher" fonctionnel
- **Fichier** : `src/app/(dash)/files/page.tsx`

---

### 6. **MESSAGERIE**
- [ ] **Fonctionnel** avec preview démo
- [ ] **Bloqué à l'utilisation** (upsell Premium)
- [ ] Message : "Fonctionnalité Premium - Contactez-nous pour débloquer"
- **Fichier** : Créer `src/app/(dash)/messages/page.tsx` (si n'existe pas)

---

## 🔍 **AUDIT COMPLET DE L'APPLICATION**

### **Pages existantes**
1. ✅ **Landing Page** (`/`) - OK
2. ✅ **Login** (`/login`) - OK
3. ✅ **Register** (`/register`) - À vérifier
4. ✅ **Dashboard** (`/dashboard`) - À modifier
5. ✅ **Suivi Chantier** (`/avancement`) - À modifier
6. ✅ **Collaboration** (`/collaboration`) - À corriger
7. ✅ **GED** (`/files`) - À corriger
8. ✅ **Paramètres** (`/settings`) - À vérifier
9. ❓ **Messagerie** - À créer ou vérifier

---

## 📂 **STRUCTURE DES FICHIERS À MODIFIER**

```
src/
├── components/
│   └── shell/
│       └── Sidebar.tsx ..................... Logo blanc
├── app/
│   ├── (dash)/
│   │   ├── dashboard/
│   │   │   └── page.tsx ................... Supprimer upsell, ajouter projets récents
│   │   ├── avancement/
│   │   │   └── page.tsx ................... Cacher infos statiques, ajouter galerie
│   │   ├── collaboration/
│   │   │   └── page.tsx ................... Corriger ajout de tâches
│   │   ├── files/
│   │   │   └── page.tsx ................... Upload 5MB + recherche
│   │   └── messages/ (?)
│   │       └── page.tsx ................... Créer messagerie démo
│   └── (auth)/
│       ├── login/page.tsx ................. OK
│       └── register/page.tsx .............. À vérifier
```

---

## 🎯 **ORDRE D'EXÉCUTION**

### **Phase 1 : Corrections Rapides** (30 min)
1. Logo blanc Sidebar
2. Cacher sections statiques (Points d'attention, Impact Écologique, Météo)
3. Supprimer "Passer au niveau supérieur"

### **Phase 2 : Fonctionnalités Critiques** (1h)
4. Ajout de tâches Collaboration
5. Upload documents GED (5MB)
6. Recherche & Filtres GED

### **Phase 3 : Fonctionnalités Avancées** (1h30)
7. Galerie photos Suivi Chantier (lightbox)
8. Photos avant/après
9. Bouton Modifier projet
10. Messagerie démo (bloquée)

### **Phase 4 : Section Projets Récents** (30 min)
11. Remplacer upsell par projets récents

---

## 📊 **ESTIMATION TOTALE**

- **Temps estimé** : 3-4 heures
- **Complexité** : Moyenne
- **Priorité** : Haute

---

## 🚀 **PROCHAINES ÉTAPES**

1. ✅ Valider ce plan avec vous
2. ⏳ Commencer Phase 1 (corrections rapides)
3. ⏳ Tester chaque modification
4. ⏳ Passer à la Phase 2, etc.

---

**Prêt à commencer ?** 🎯
