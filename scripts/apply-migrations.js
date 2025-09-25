const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuration Supabase
const supabaseUrl = 'https://dhrxwkvdtiqqspljkspq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRocnh3a3ZkdGlxcXNwbGprc3BxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQyNTA5NCwiZXhwIjoyMDczMDAxMDk0fQ.whbsDR81KJyIb7Dbb_DiepZNS9rRYfHhO6YZpdnt3Vs';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigrations() {
  try {
    console.log('🚀 Application des migrations Supabase...');

    // Lire et exécuter la migration pour créer la table documents
    const documentsTableMigration = fs.readFileSync(
      path.join(__dirname, '../supabase/migrations/20240125000001_create_documents_table.sql'),
      'utf8'
    );

    console.log('📄 Application de la migration pour la table documents...');
    const { error: documentsError } = await supabase.rpc('exec_sql', {
      sql: documentsTableMigration
    });

    if (documentsError) {
      console.error('❌ Erreur lors de la création de la table documents:', documentsError);
    } else {
      console.log('✅ Table documents créée avec succès');
    }

    // Lire et exécuter la migration pour le bucket de stockage
    const storageMigration = fs.readFileSync(
      path.join(__dirname, '../supabase/migrations/20240125000002_setup_storage_bucket.sql'),
      'utf8'
    );

    console.log('🗂️ Application de la migration pour le bucket de stockage...');
    const { error: storageError } = await supabase.rpc('exec_sql', {
      sql: storageMigration
    });

    if (storageError) {
      console.error('❌ Erreur lors de la configuration du stockage:', storageError);
    } else {
      console.log('✅ Bucket de stockage configuré avec succès');
    }

    console.log('🎉 Toutes les migrations ont été appliquées avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors de l\'application des migrations:', error);
  }
}

// Alternative : exécution directe des requêtes SQL
async function applyMigrationsDirectly() {
  try {
    console.log('🚀 Application directe des migrations...');

    // Créer la table documents
    const { error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'documents')
      .single();

    if (tableError && tableError.code === 'PGRST116') {
      // La table n'existe pas, la créer
      console.log('📄 Création de la table documents...');
      
      const createTableQuery = `
        CREATE TABLE documents (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          file_path VARCHAR(500) NOT NULL,
          file_size BIGINT NOT NULL,
          mime_type VARCHAR(100) NOT NULL,
          client_id UUID NOT NULL,
          project_id UUID,
          uploaded_by UUID,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE INDEX idx_documents_client_id ON documents(client_id);
        CREATE INDEX idx_documents_project_id ON documents(project_id);
        CREATE INDEX idx_documents_created_at ON documents(created_at);

        ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
      `;

      // Note: Cette approche nécessite des privilèges administrateur
      console.log('⚠️ Pour créer la table, exécutez ce SQL dans l\'éditeur SQL de Supabase:');
      console.log(createTableQuery);
    } else {
      console.log('✅ La table documents existe déjà');
    }

    // Vérifier le bucket de stockage
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Erreur lors de la vérification des buckets:', bucketsError);
      return;
    }

    const documentsBucket = buckets.find(bucket => bucket.id === 'documents');
    
    if (!documentsBucket) {
      console.log('🗂️ Création du bucket documents...');
      const { error: createBucketError } = await supabase.storage.createBucket('documents', {
        public: false,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/plain',
          'text/csv',
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp'
        ]
      });

      if (createBucketError) {
        console.error('❌ Erreur lors de la création du bucket:', createBucketError);
      } else {
        console.log('✅ Bucket documents créé avec succès');
      }
    } else {
      console.log('✅ Le bucket documents existe déjà');
    }

    console.log('🎉 Vérification des migrations terminée !');

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Exécuter les migrations
if (require.main === module) {
  applyMigrationsDirectly();
}

module.exports = { applyMigrations, applyMigrationsDirectly };