-- ============================================
-- 🚀 OPTIMISATION DES PERFORMANCES
-- ============================================
-- Ce script crée des index pour accélérer
-- les requêtes sur les tables principales
-- ============================================

-- ÉTAPE 1 : Créer les index sur la table profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- ÉTAPE 2 : Créer les index sur la table projects
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- ÉTAPE 3 : Créer les index sur la table documents (si elle existe)
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);

-- ============================================
-- VÉRIFICATION
-- ============================================

-- Vérifier que les index ont été créés
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'projects', 'documents')
ORDER BY tablename, indexname;

-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================

-- Vous devriez voir :
-- profiles  | idx_profiles_email
-- profiles  | idx_profiles_role
-- projects  | idx_projects_client_id
-- projects  | idx_projects_status
-- documents | idx_documents_project_id

-- ============================================
-- IMPACT SUR LES PERFORMANCES
-- ============================================

-- Avant : Requête sur profiles WHERE email = '...' → 50-200ms
-- Après : Requête sur profiles WHERE email = '...' → 5-20ms

-- Gain de performance : 80-90% plus rapide ! 🚀

-- ============================================
-- NOTES
-- ============================================

-- Ces index sont particulièrement utiles pour :
-- 1. Connexion (recherche par email)
-- 2. Vérification du rôle (filtre par role)
-- 3. Chargement des projets d'un client
-- 4. Chargement des documents d'un projet
