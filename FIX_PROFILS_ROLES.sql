-- ============================================
-- FIX PROFILS + PROJET DE TEST
-- Exécuter dans Supabase SQL Editor
-- ============================================

-- 1. Corriger le rôle du profil admin
UPDATE profiles 
SET 
    name = 'Admin Demo',
    role = 'admin',
    company = 'Eco TP'
WHERE id = '5bec126c-80a0-4416-b16c-556f5aaccb80';

-- 2. Corriger le profil client
UPDATE profiles 
SET 
    name = 'Client Demo',
    role = 'client',
    company = 'Client Demo'
WHERE id = '96f1c0b6-24df-40d8-865e-36d7b61f8e65';

-- 3. Vérifier les colonnes de la table projects
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'projects' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Créer un projet de test pour le client demo (sans description)
-- (Adapter selon les colonnes disponibles)
INSERT INTO projects (client_id, name, status, progress, start_date, end_date, budget)
SELECT 
    '96f1c0b6-24df-40d8-865e-36d7b61f8e65',
    'Villa Moderne - Terrassement',
    'in_progress',
    45,
    '2024-02-01',
    '2024-06-30',
    75000
WHERE NOT EXISTS (
    SELECT 1 FROM projects WHERE client_id = '96f1c0b6-24df-40d8-865e-36d7b61f8e65'
);

-- 5. Vérification finale
SELECT 
    u.email,
    p.name,
    p.role,
    p.company
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE u.email IN ('admin.demo@ecotp.com', 'client.demo@ecotp.com');

SELECT name, status, progress FROM projects 
WHERE client_id = '96f1c0b6-24df-40d8-865e-36d7b61f8e65';
