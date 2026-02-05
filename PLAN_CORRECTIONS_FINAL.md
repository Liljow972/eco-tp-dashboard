# 🎯 PLAN DE CORRECTION COMPLET

**Date** : 4 février 2026  
**Heure** : 13:15  
**Objectif** : Application 100% fonctionnelle avant configuration Supabase

---

## 📋 **LISTE DES CORRECTIONS**

### **🔹 1. DASHBOARD CLIENT**

#### 1.1 Navigation & Accès
- [ ] Débloquer Messagerie (actuellement bloquée)
- [ ] Débloquer Galerie (actuellement bloquée)
- [ ] Masquer totalement la colonne Météo (UI + logique)

#### 1.2 Galerie Photos (Client)
- [ ] Vérifier : Client ne peut PAS ajouter de photos
- [ ] Vérifier : Client peut voir les photos
- [ ] Ajouter : Bouton télécharger les photos
- [ ] Tester : Permissions strictement respectées

#### 1.3 Page GED (Client)
- [x] ✅ Fichiers uploadés apparaissent dans la liste (DÉJÀ CORRIGÉ)

---

### **🔹 2. DASHBOARD ADMIN**

#### 2.1 Page Collaboration
- [ ] Corriger : Bouton "Modifier" ne fonctionne pas
- [x] ✅ Messagerie fonctionne
- [x] ✅ Redirection vers projet fonctionne
- [x] ✅ Supprimer fonctionne

#### 2.2 Page GED (Admin)
- [x] ✅ Fichiers uploadés apparaissent dans la liste (DÉJÀ CORRIGÉ)

---

### **🔹 3. PAGE SUIVI DE CHANTIER**

#### 3.1 Galerie
- [ ] Remettre le lightbox (a disparu)
- [x] ✅ Ajouter des photos fonctionne
- [x] ✅ Supprimer des photos fonctionne
- [x] ✅ Trier par type fonctionne

#### 3.2 Messagerie
- [x] ✅ UX bonne
- [ ] Préparer logique pour future persistance
- [ ] Messages stockés localement (session)

---

## 🔧 **ORDRE D'EXÉCUTION**

### **PHASE 1 : Dashboard Client** (30 min)
1. Débloquer Messagerie et Galerie
2. Masquer Météo complètement
3. Vérifier permissions Galerie
4. Ajouter bouton téléchargement photos

### **PHASE 2 : Dashboard Admin** (15 min)
1. Corriger bouton "Modifier" (Collaboration)
2. Vérifier que tout fonctionne

### **PHASE 3 : Suivi de Chantier** (20 min)
1. Remettre lightbox Galerie
2. Améliorer stockage messages (localStorage)

### **PHASE 4 : Tests finaux** (15 min)
1. Test complet Client
2. Test complet Admin
3. Vérification permissions
4. Vérification UX

---

## ✅ **CRITÈRES DE VALIDATION**

### **Dashboard Client**
- [ ] Messagerie accessible et fonctionnelle
- [ ] Galerie accessible (lecture seule)
- [ ] Météo totalement invisible
- [ ] Aucun bouton d'upload visible
- [ ] Téléchargement photos fonctionne

### **Dashboard Admin**
- [ ] Bouton Modifier fonctionne
- [ ] Tous les boutons Collaboration OK
- [ ] Upload fichiers + affichage OK

### **Suivi de Chantier**
- [ ] Lightbox fonctionne
- [ ] Messages persistants (localStorage)
- [ ] Upload/Suppression photos OK

---

## 🚀 **DÉMARRAGE**

Commençons par la **PHASE 1 : Dashboard Client**
