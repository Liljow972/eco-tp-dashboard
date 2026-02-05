-- ============================================
-- 🔧 TRIGGER AUTOMATIQUE DE CRÉATION DE PROFIL
-- ============================================
-- Ce script crée un trigger qui génère automatiquement
-- un profil dans la table 'profiles' chaque fois qu'un
-- nouvel utilisateur s'inscrit dans auth.users
-- ============================================

-- ÉTAPE 1 : Créer la fonction trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insérer un nouveau profil avec les informations de l'utilisateur
  INSERT INTO public.profiles (id, email, name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    'client', -- Rôle par défaut
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ÉTAPE 2 : Créer le trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- VÉRIFICATION
-- ============================================

-- Vérifier que le trigger existe
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- ============================================
-- TEST DU TRIGGER
-- ============================================

-- Pour tester, créez un nouvel utilisateur via l'interface
-- ou via SQL (décommenter les lignes ci-dessous) :

/*
-- Créer un utilisateur de test
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'test@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    '{"full_name": "Test User"}'::jsonb,
    NOW(),
    NOW()
);

-- Vérifier que le profil a été créé automatiquement
SELECT * FROM profiles WHERE email = 'test@example.com';
*/

-- ============================================
-- NOTES IMPORTANTES
-- ============================================

-- 1. Le trigger s'exécute automatiquement pour TOUS les nouveaux utilisateurs
-- 2. Le rôle par défaut est 'client'
-- 3. Le nom est extrait de :
--    - raw_user_meta_data->>'full_name' (Google OAuth)
--    - raw_user_meta_data->>'name' (autres providers)
--    - Partie avant @ de l'email (fallback)
-- 4. Si vous voulez changer le rôle d'un utilisateur en 'admin',
--    utilisez une requête UPDATE après la création

-- ============================================
-- BONUS : Fonction pour promouvoir un utilisateur en admin
-- ============================================

CREATE OR REPLACE FUNCTION public.promote_to_admin(user_email TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET role = 'admin', updated_at = NOW()
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Exemple d'utilisation :
-- SELECT promote_to_admin('admin@ecotp.test');

-- ============================================
-- BONUS : Fonction pour rétrograder un admin en client
-- ============================================

CREATE OR REPLACE FUNCTION public.demote_to_client(user_email TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET role = 'client', updated_at = NOW()
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Exemple d'utilisation :
-- SELECT demote_to_client('user@example.com');

-- ============================================
-- VÉRIFICATION FINALE
-- ============================================

-- Lister tous les triggers sur auth.users
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users'
  AND event_object_schema = 'auth';

-- Lister toutes les fonctions créées
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('handle_new_user', 'promote_to_admin', 'demote_to_client');

-- ============================================
-- SUCCÈS ! 🎉
-- ============================================
-- Le trigger est maintenant actif.
-- Chaque nouvel utilisateur aura automatiquement un profil créé.
-- ============================================
