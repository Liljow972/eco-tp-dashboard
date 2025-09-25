# Configuration Supabase pour le système de documents

## Instructions pour configurer la base de données

### 1. Créer la table documents

Exécutez ce SQL dans l'éditeur SQL de votre dashboard Supabase :

```sql
-- Création de la table documents
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_documents_client_id ON documents(client_id);
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_documents_updated_at 
    BEFORE UPDATE ON documents 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) pour sécuriser l'accès aux documents
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs authentifiés de voir tous les documents
CREATE POLICY "Users can view all documents" ON documents
    FOR SELECT USING (auth.role() = 'authenticated');

-- Politique pour permettre aux utilisateurs authentifiés d'insérer des documents
CREATE POLICY "Users can insert documents" ON documents
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Politique pour permettre aux utilisateurs authentifiés de mettre à jour des documents
CREATE POLICY "Users can update documents" ON documents
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Politique pour permettre aux utilisateurs authentifiés de supprimer des documents
CREATE POLICY "Users can delete documents" ON documents
    FOR DELETE USING (auth.role() = 'authenticated');
```

### 2. Configurer les politiques de stockage

Le bucket `documents` a été créé automatiquement. Vérifiez que les politiques suivantes sont en place dans Storage > Policies :

```sql
-- Politique pour permettre l'upload de documents
CREATE POLICY "Authenticated users can upload documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND 
    auth.role() = 'authenticated'
  );

-- Politique pour permettre la lecture des documents
CREATE POLICY "Authenticated users can view documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND 
    auth.role() = 'authenticated'
  );

-- Politique pour permettre la suppression des documents
CREATE POLICY "Authenticated users can delete documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'documents' AND 
    auth.role() = 'authenticated'
  );
```

### 3. Vérification

Après avoir exécuté ces commandes, vous devriez avoir :

1. ✅ Une table `documents` avec toutes les colonnes nécessaires
2. ✅ Des index pour optimiser les performances
3. ✅ Des politiques RLS pour sécuriser l'accès
4. ✅ Un bucket `documents` dans Storage
5. ✅ Des politiques de stockage appropriées

### 4. Structure de la table documents

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique du document |
| name | VARCHAR(255) | Nom du fichier |
| file_path | VARCHAR(500) | Chemin du fichier dans le storage |
| file_size | BIGINT | Taille du fichier en octets |
| mime_type | VARCHAR(100) | Type MIME du fichier |
| client_id | UUID | Référence vers le client (obligatoire) |
| project_id | UUID | Référence vers le projet (optionnel) |
| uploaded_by | UUID | Utilisateur qui a uploadé le document |
| created_at | TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | Date de dernière modification |

### 5. Types de fichiers supportés

- Documents PDF
- Documents Word (.doc, .docx)
- Feuilles de calcul Excel (.xls, .xlsx)
- Présentations PowerPoint (.ppt, .pptx)
- Fichiers texte (.txt, .csv)
- Images (.jpg, .png, .gif, .webp, .svg)

### 6. Limites

- Taille maximale par fichier : 50 MB
- Stockage privé (non accessible publiquement)
- Accès sécurisé via authentification