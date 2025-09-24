import { supabase } from './supabase';
import { TEST_ACCOUNTS } from './auth';

export async function initTestAccounts() {
  try {
    console.log('🚀 Initialisation des comptes de test...');

    // Vérifier si les comptes existent déjà
    const { data: existingProfiles } = await supabase
      .from('profiles')
      .select('email')
      .in('email', [TEST_ACCOUNTS.client.email, TEST_ACCOUNTS.admin.email]);

    const existingEmails = existingProfiles?.map(p => p.email) || [];

    // Créer le profil client si il n'existe pas
    if (!existingEmails.includes(TEST_ACCOUNTS.client.email)) {
      const { error: clientError } = await supabase
        .from('profiles')
        .insert({
          id: 'test-client-id',
          email: TEST_ACCOUNTS.client.email,
          name: TEST_ACCOUNTS.client.name,
          role: TEST_ACCOUNTS.client.role,
          created_at: new Date().toISOString()
        });

      if (clientError) {
        console.error('❌ Erreur création profil client:', clientError);
      } else {
        console.log('✅ Profil client créé');
      }
    } else {
      console.log('ℹ️ Profil client existe déjà');
    }

    // Créer le profil admin si il n'existe pas
    if (!existingEmails.includes(TEST_ACCOUNTS.admin.email)) {
      const { error: adminError } = await supabase
        .from('profiles')
        .insert({
          id: 'test-admin-id',
          email: TEST_ACCOUNTS.admin.email,
          name: TEST_ACCOUNTS.admin.name,
          role: TEST_ACCOUNTS.admin.role,
          created_at: new Date().toISOString()
        });

      if (adminError) {
        console.error('❌ Erreur création profil admin:', adminError);
      } else {
        console.log('✅ Profil admin créé');
      }
    } else {
      console.log('ℹ️ Profil admin existe déjà');
    }

    // Créer quelques projets de test pour le client
    const { data: existingProjects } = await supabase
      .from('projects')
      .select('id')
      .eq('client_id', 'test-client-id');

    if (!existingProjects || existingProjects.length === 0) {
      const testProjects = [
        {
          id: 'project-1',
          client_id: 'test-client-id',
          name: 'Terrassement Écologique - Parc Municipal',
          status: 'in_progress',
          progress: 65,
          budget: 50000,
          spent: 32500,
          start_date: '2024-01-15',
          end_date: '2024-03-30',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'project-2',
          client_id: 'test-client-id',
          name: 'Aménagement Durable - Zone Résidentielle',
          status: 'pending',
          progress: 0,
          budget: 75000,
          spent: 0,
          start_date: '2024-04-01',
          end_date: '2024-06-15',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'project-3',
          client_id: 'test-client-id',
          name: 'Restauration Écologique - Berges',
          status: 'completed',
          progress: 100,
          budget: 30000,
          spent: 28500,
          start_date: '2023-10-01',
          end_date: '2023-12-20',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      const { error: projectsError } = await supabase
        .from('projects')
        .insert(testProjects);

      if (projectsError) {
        console.error('❌ Erreur création projets:', projectsError);
      } else {
        console.log('✅ Projets de test créés');
      }
    } else {
      console.log('ℹ️ Projets de test existent déjà');
    }

    console.log('🎉 Initialisation des comptes de test terminée !');
    console.log('📧 Comptes disponibles :');
    console.log(`   👤 Client: ${TEST_ACCOUNTS.client.email} / ${TEST_ACCOUNTS.client.password}`);
    console.log(`   ⚡ Admin: ${TEST_ACCOUNTS.admin.email} / ${TEST_ACCOUNTS.admin.password}`);

  } catch (error) {
    console.error('💥 Erreur lors de l\'initialisation:', error);
  }
}

// Exporter pour utilisation dans un script
if (typeof window === 'undefined') {
  // Côté serveur - peut être exécuté directement
  initTestAccounts();
}