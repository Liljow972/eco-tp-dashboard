#!/usr/bin/env node

/**
 * Script de test de connexion Supabase
 * Vérifie que la connexion à Supabase fonctionne et que les tables existent
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables d\'environnement manquantes !');
    console.error('Assurez-vous que NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont définis dans .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
    console.log('🔍 Test de connexion à Supabase...\n');
    console.log(`📍 URL: ${supabaseUrl}\n`);

    try {
        // Test 1: Vérifier la connexion
        console.log('1️⃣  Test de connexion...');
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError && authError.message !== 'Auth session missing!') {
            throw authError;
        }
        console.log('   ✅ Connexion à Supabase réussie\n');

        // Test 2: Vérifier la table profiles
        console.log('2️⃣  Vérification de la table "profiles"...');
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('count')
            .limit(1);

        if (profilesError) {
            console.log(`   ❌ Erreur: ${profilesError.message}`);
            console.log('   ⚠️  La table "profiles" n\'existe peut-être pas. Exécutez supabase-schema.sql\n');
        } else {
            console.log('   ✅ Table "profiles" accessible\n');
        }

        // Test 3: Vérifier la table projects
        console.log('3️⃣  Vérification de la table "projects"...');
        const { data: projects, error: projectsError } = await supabase
            .from('projects')
            .select('count')
            .limit(1);

        if (projectsError) {
            console.log(`   ❌ Erreur: ${projectsError.message}`);
            console.log('   ⚠️  La table "projects" n\'existe peut-être pas. Exécutez supabase-schema.sql\n');
        } else {
            console.log('   ✅ Table "projects" accessible\n');
        }

        // Test 4: Vérifier la table documents
        console.log('4️⃣  Vérification de la table "documents"...');
        const { data: documents, error: documentsError } = await supabase
            .from('documents')
            .select('count')
            .limit(1);

        if (documentsError) {
            console.log(`   ❌ Erreur: ${documentsError.message}`);
            console.log('   ⚠️  La table "documents" n\'existe peut-être pas. Exécutez supabase-schema.sql\n');
        } else {
            console.log('   ✅ Table "documents" accessible\n');
        }

        // Test 5: Vérifier le bucket documents
        console.log('5️⃣  Vérification du bucket "documents"...');
        const { data: buckets, error: bucketsError } = await supabase
            .storage
            .listBuckets();

        if (bucketsError) {
            console.log(`   ❌ Erreur: ${bucketsError.message}\n`);
        } else {
            const documentsBucket = buckets.find(b => b.name === 'documents');
            if (documentsBucket) {
                console.log('   ✅ Bucket "documents" existe\n');
            } else {
                console.log('   ⚠️  Bucket "documents" n\'existe pas. Créez-le dans Supabase Dashboard\n');
            }
        }

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📊 RÉSUMÉ DU TEST\n');
        console.log('✅ Connexion Supabase : OK');

        if (!profilesError) console.log('✅ Table profiles : OK');
        else console.log('❌ Table profiles : ERREUR');

        if (!projectsError) console.log('✅ Table projects : OK');
        else console.log('❌ Table projects : ERREUR');

        if (!documentsError) console.log('✅ Table documents : OK');
        else console.log('❌ Table documents : ERREUR');

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        if (profilesError || projectsError || documentsError) {
            console.log('⚠️  ACTIONS REQUISES :');
            console.log('1. Allez sur https://supabase.com/dashboard');
            console.log('2. Sélectionnez votre projet');
            console.log('3. Allez dans "SQL Editor"');
            console.log('4. Copiez le contenu de "supabase-schema.sql"');
            console.log('5. Exécutez le script SQL\n');
        } else {
            console.log('🎉 Tout est prêt ! Vous pouvez commencer à tester l\'authentification.\n');
        }

    } catch (error) {
        console.error('\n❌ ERREUR:', error.message);
        console.error('\nVérifiez vos variables d\'environnement dans .env.local\n');
        process.exit(1);
    }
}

testSupabaseConnection();
