-- Script pour créer des données de démonstration
-- À exécuter dans l'éditeur SQL de Supabase après avoir exécuté supabase-schema.sql

-- Insérer des profils de démonstration
-- Note: Les IDs utilisateur doivent correspondre aux vrais utilisateurs créés dans Supabase Auth
-- Remplacez ces UUIDs par les vrais IDs après création des comptes

-- Exemple de profils (à adapter avec les vrais UUIDs)
INSERT INTO profiles (id, email, name, role) VALUES 
  ('11111111-1111-1111-1111-111111111111', 'admin@ecotp-demo.com', 'Admin EcoTP', 'admin'),
  ('22222222-2222-2222-2222-222222222222', 'client@ecotp-demo.com', 'Client Démo', 'client'),
  ('33333333-3333-3333-3333-333333333333', 'client2@ecotp-demo.com', 'Marie Dupont', 'client')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role;

-- Insérer des projets de démonstration
INSERT INTO projects (id, client_id, name, status, progress, budget, spent, start_date, end_date, description) VALUES 
  ('proj-1', '22222222-2222-2222-2222-222222222222', 'Terrassement Villa Moderne', 'in_progress', 65, 45000, 29250, '2024-01-15', '2024-03-30', 'Terrassement pour construction villa 200m² avec piscine'),
  ('proj-2', '22222222-2222-2222-2222-222222222222', 'Aménagement Jardin', 'completed', 100, 15000, 14800, '2023-11-01', '2023-12-15', 'Aménagement paysager avec terrasse et allées'),
  ('proj-3', '33333333-3333-3333-3333-333333333333', 'Extension Maison', 'pending', 0, 32000, 0, '2024-04-01', '2024-06-30', 'Terrassement pour extension 50m²'),
  ('proj-4', '33333333-3333-3333-3333-333333333333', 'Rénovation Cour', 'in_progress', 30, 8500, 2550, '2024-02-01', '2024-03-15', 'Réfection complète de la cour avec drainage')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  status = EXCLUDED.status,
  progress = EXCLUDED.progress,
  budget = EXCLUDED.budget,
  spent = EXCLUDED.spent,
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  description = EXCLUDED.description;

-- Insérer des mises à jour de projets
INSERT INTO project_updates (id, project_id, title, body, created_at) VALUES 
  ('update-1', 'proj-1', 'Début des travaux de terrassement', 'Les travaux ont commencé ce matin. L\'équipe a procédé au balisage du terrain et à la préparation des accès.', '2024-01-15 08:00:00'),
  ('update-2', 'proj-1', 'Excavation principale terminée', 'L\'excavation pour les fondations est terminée. Profondeur atteinte : 1,2m. Prochaine étape : pose du géotextile.', '2024-01-22 16:30:00'),
  ('update-3', 'proj-1', 'Installation du drainage', 'Mise en place du système de drainage périphérique. Tests d\'étanchéité réalisés avec succès.', '2024-02-05 14:15:00'),
  ('update-4', 'proj-1', 'Remblaiement en cours', 'Début du remblaiement avec matériaux sélectionnés. Compactage par couches de 30cm.', '2024-02-18 10:45:00'),
  ('update-5', 'proj-2', 'Projet terminé avec succès', 'Livraison du projet d\'aménagement paysager. Client très satisfait du résultat final.', '2023-12-15 17:00:00'),
  ('update-6', 'proj-4', 'Démarrage des travaux', 'Début des travaux de rénovation de la cour. Démolition de l\'ancien revêtement en cours.', '2024-02-01 09:00:00')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  body = EXCLUDED.body;

-- Insérer des documents de démonstration
INSERT INTO documents (id, project_id, label, type, file_path, file_size, mime_type) VALUES 
  ('doc-1', 'proj-1', 'Contrat de terrassement', 'contract', 'contracts/contrat-villa-moderne.pdf', 245760, 'application/pdf'),
  ('doc-2', 'proj-1', 'Plan de terrassement', 'deliverable', 'plans/plan-terrassement-villa.pdf', 1024000, 'application/pdf'),
  ('doc-3', 'proj-1', 'Facture acompte 1', 'invoice', 'invoices/facture-acompte-1.pdf', 156800, 'application/pdf'),
  ('doc-4', 'proj-1', 'Photos avant travaux', 'other', 'photos/avant-travaux-villa.zip', 5242880, 'application/zip'),
  ('doc-5', 'proj-2', 'Contrat aménagement', 'contract', 'contracts/contrat-amenagement-jardin.pdf', 198400, 'application/pdf'),
  ('doc-6', 'proj-2', 'Facture finale', 'invoice', 'invoices/facture-finale-jardin.pdf', 142336, 'application/pdf'),
  ('doc-7', 'proj-2', 'Photos finales', 'deliverable', 'photos/photos-finales-jardin.zip', 8388608, 'application/zip'),
  ('doc-8', 'proj-3', 'Devis extension', 'contract', 'contracts/devis-extension-maison.pdf', 167936, 'application/pdf'),
  ('doc-9', 'proj-4', 'Contrat rénovation cour', 'contract', 'contracts/contrat-renovation-cour.pdf', 189440, 'application/pdf')
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  type = EXCLUDED.type,
  file_path = EXCLUDED.file_path,
  file_size = EXCLUDED.file_size,
  mime_type = EXCLUDED.mime_type;

-- Créer quelques statistiques pour le dashboard
-- Ces données seront utilisées par l'API stats

-- Note importante :
-- Pour utiliser ces données de démonstration :
-- 1. Créez d'abord les comptes utilisateur dans Supabase Auth :
--    - admin@ecotp-demo.com (mot de passe : AdminDemo123!)
--    - client@ecotp-demo.com (mot de passe : ClientDemo123!)
--    - client2@ecotp-demo.com (mot de passe : ClientDemo123!)
-- 2. Récupérez les vrais UUIDs de ces utilisateurs
-- 3. Remplacez les UUIDs dans ce script
-- 4. Exécutez ce script dans l'éditeur SQL de Supabase

-- Commandes pour créer les utilisateurs (à exécuter dans l'interface Supabase Auth) :
-- 1. Aller dans Authentication > Users
-- 2. Cliquer sur "Add user"
-- 3. Créer les 3 comptes avec les emails ci-dessus
-- 4. Noter les UUIDs générés
-- 5. Modifier ce script avec les vrais UUIDs
-- 6. Exécuter ce script