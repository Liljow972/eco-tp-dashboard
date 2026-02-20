# ⚠️ ERREUR: INVALID API KEY

## 🐛 Problème

Le script retourne l'erreur : **"Invalid API key"**

---

## ✅ SOLUTION

### Vérifier que vous avez la bonne clé

**Dans Supabase Dashboard**:

1. **Settings > API**

2. **Vérifier que vous copiez la clé `service_role`** (PAS la clé `anon`)

   **Clé à utiliser** : `service_role` (section "Project API keys")
   - Elle commence par `eyJ...`
   - Elle est **très longue** (plusieurs centaines de caractères)
   - Elle est marquée comme **"Secret"** ou **"Service Role"**

   **Clé à NE PAS utiliser** : `anon` (clé publique)
   - Cette clé n'a pas les permissions pour créer des utilisateurs

---

## 🔍 Comment vérifier

**La clé `service_role` devrait ressembler à**:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRocnh3a3ZkdGlxcXNwbGprc3BxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQyNTA5NCwiZXhwIjoyMDczMDAxMDk0fQ.whbsDR81KJyIb7Dbb_DiepZNS9rRYfHhO6YZpdnt3Vs
```

**Points à vérifier**:
- ✅ La clé contient `"role":"service_role"` (vous pouvez décoder le JWT sur jwt.io pour vérifier)
- ✅ La clé est complète (pas coupée)
- ✅ Pas d'espaces avant/après

---

## 🔄 Étapes de correction

1. **Retourner sur Supabase Dashboard**
   - Settings > API

2. **Copier la clé `service_role`**
   - Cliquer sur l'icône "copier" à côté de la clé
   - Vérifier qu'elle est bien marquée "service_role"

3. **Mettre à jour le script**
   - Ouvrir `create-test-users.js`
   - Ligne 10: Remplacer la clé actuelle par la nouvelle
   - Sauvegarder

4. **Réexécuter le script**
   ```bash
   cd eco-tp-dashboard
   node create-test-users.js
   ```

---

## 📸 Capture d'écran de référence

**Dans Supabase Dashboard > Settings > API**, vous devriez voir :

```
Project API keys

anon public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... [COPY]

service_role secret
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... [COPY]  ← CETTE CLÉ
```

---

## ✅ Résultat attendu après correction

```
🚀 Création des utilisateurs de test...

📧 Création de admin.demo@ecotp.com...
✅ Utilisateur auth créé: abc123-def456-...
✅ Profil créé pour admin.demo@ecotp.com
   📝 Email: admin.demo@ecotp.com
   🔑 Mot de passe: EcoTP2024!
   👤 Rôle: admin
   🆔 ID: abc123-def456-...

📧 Création de client.demo@ecotp.com...
✅ Utilisateur auth créé: xyz789-uvw012-...
✅ Profil créé pour client.demo@ecotp.com
   📝 Email: client.demo@ecotp.com
   🔑 Mot de passe: EcoTP2024!
   👤 Rôle: client
   🆔 ID: xyz789-uvw012-...

✅ Terminé !
```

---

**PROCHAINE ACTION**: Vérifier et copier la bonne clé `service_role` ! 🔑
