# Guide de Déploiement - Eco TP Dashboard

## 🚀 Options de Déploiement

### Option 1: Netlify (Recommandé)

1. **Connecter le dépôt GitHub**
   - Aller sur [Netlify](https://netlify.com)
   - "New site from Git" → GitHub → Sélectionner le repo

2. **Configuration de build**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Variables d'environnement**
   ```
   NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anonyme
   ```

### Option 2: Vercel

1. **Connecter le dépôt**
   - Aller sur [Vercel](https://vercel.com)
   - "New Project" → Import depuis GitHub

2. **Configuration automatique**
   - Vercel détecte automatiquement Next.js
   - Ajouter les variables d'environnement

### Option 3: Déploiement Manuel

```bash
# Vérifier la configuration
node deploy-check.js

# Build local
npm run build

# Test local du build
npm start
```

## 🔧 Résolution des Problèmes

### Erreur "Dynamic Server Usage"

✅ **Déjà corrigé dans ce projet :**
- Routes API configurées avec `runtime = 'nodejs'`
- Configuration `dynamic = 'force-dynamic'`
- Utilisation correcte des cookies Supabase

### Erreur de Build

1. **Vérifier les dépendances**
   ```bash
   npm install
   npm audit fix
   ```

2. **Nettoyer le cache**
   ```bash
   rm -rf .next
   npm run build
   ```

### Problèmes de Routes API

- Routes testées : `/api/health` et `/api/test-auth`
- Configuration Edge Runtime disponible
- Fallback vers Node.js runtime si nécessaire

## 📋 Checklist de Déploiement

- [ ] Variables d'environnement configurées
- [ ] Build local réussi
- [ ] Routes API fonctionnelles
- [ ] Configuration Netlify/Vercel en place
- [ ] Tests de santé passés

## 🆘 Support

Si le problème persiste :

1. Vérifier les logs de déploiement
2. Tester les routes API individuellement
3. Utiliser la route `/api/health` pour diagnostiquer
4. Contacter le support de la plateforme de déploiement