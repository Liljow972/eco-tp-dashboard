import { supabase } from '../lib/supabase';

// Comptes de test
const TEST_ACCOUNTS = {
  client: {
    id: 'test-client-001',
    email: 'client@test.com',
    password: 'test123',
    full_name: 'Client Test',
    role: 'client' as const
  },
  admin: {
    id: 'test-admin-001', 
    email: 'admin@test.com',
    password: 'admin123',
    full_name: 'Admin Test',
    role: 'admin' as const
  }
};

// Projets de test
const TEST_PROJECTS = [
  {
    id: 'project-test-001',
    name: 'Projet Test Client',
    description: 'Projet de démonstration pour le client test',
    status: 'in_progress',
    progress: 65,
    budget: 15000,
    spent: 9750,
    client_id: 'test-client-001',
    start_date: '2024-01-15',
    end_date: '2024-06-15'
  },
  {
    id: 'project-test-002',
    name: 'Projet Test Terminé',
    description: 'Projet terminé pour démonstration',
    status: 'completed',
    progress: 100,
    budget: 8000,
    spent: 7800,
    client_id: 'test-client-001',
    start_date: '2023-10-01',
    end_date: '2024-01-31'
  }
];

async function initTestAccounts() {
  try {
    console.log('🚀 Initialisation des comptes de test...');

    // Vérifier si les profils existent déjà
    const { data: existingProfiles } = await supabase
      .from('profiles')
      .select('id, email')
      .in('email', [TEST_ACCOUNTS.client.email, TEST_ACCOUNTS.admin.email]);

    if (existingProfiles && existingProfiles.length > 0) {
      console.log('✅ Les comptes de test existent déjà:');
      existingProfiles.forEach(profile => {
        console.log(`   - ${profile.email} (ID: ${profile.id})`);
      });
    } else {
      // Créer les profils de test
      const profiles = Object.values(TEST_ACCOUNTS).map(account => ({
        id: account.id,
        email: account.email,
        full_name: account.full_name,
        role: account.role,
        created_at: new Date().toISOString()
      }));

      const { error: profileError } = await supabase
        .from('profiles')
        .insert(profiles);

      if (profileError) {
        console.error('❌ Erreur lors de la création des profils:', profileError);
        return;
      }

      console.log('✅ Profils créés avec succès:');
      profiles.forEach(profile => {
        console.log(`   - ${profile.email} (ID: ${profile.id})`);
      });
    }

    // Vérifier si les projets existent déjà
    const { data: existingProjects } = await supabase
      .from('projects')
      .select('id, name')
      .in('id', TEST_PROJECTS.map(p => p.id));

    if (existingProjects && existingProjects.length > 0) {
      console.log('✅ Les projets de test existent déjà:');
      existingProjects.forEach(project => {
        console.log(`   - ${project.name} (ID: ${project.id})`);
      });
    } else {
      // Créer les projets de test
      const { error: projectError } = await supabase
        .from('projects')
        .insert(TEST_PROJECTS);

      if (projectError) {
        console.error('❌ Erreur lors de la création des projets:', projectError);
        return;
      }

      console.log('✅ Projets créés avec succès:');
      TEST_PROJECTS.forEach(project => {
        console.log(`   - ${project.name} (ID: ${project.id})`);
      });
    }

    console.log('\n🎉 Initialisation terminée avec succès!');
    console.log('\n📋 Comptes de test disponibles:');
    console.log(`   👤 Client: ${TEST_ACCOUNTS.client.email} / ${TEST_ACCOUNTS.client.password}`);
    console.log(`   👨‍💼 Admin: ${TEST_ACCOUNTS.admin.email} / ${TEST_ACCOUNTS.admin.password}`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  }
}

// Exécuter le script
initTestAccounts().then(() => {
  console.log('✨ Script terminé');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Erreur fatale:', error);
  process.exit(1);
});