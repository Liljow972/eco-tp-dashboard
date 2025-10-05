import 'dotenv/config'
import { createSupabaseServiceRoleClient } from '../lib/supabase';

const adminClient = createSupabaseServiceRoleClient();

// Comptes de test
const TEST_ACCOUNTS = {
  client: {
    email: 'client@ecotp.test',
    password: 'client123',
    full_name: 'Client Démo EcoTP',
    role: 'client' as const
  },
  admin: {
    email: 'admin@ecotp.test',
    password: 'admin123',
    full_name: 'Admin EcoTP',
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
    // Assigné après création du client
    client_id: '',
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
    client_id: '',
    start_date: '2023-10-01',
    end_date: '2024-01-31'
  }
];

async function initTestAccounts() {
  try {
    console.log('🚀 Initialisation des comptes de test...');

    // Créer/assurer l'existence des utilisateurs Auth (admin + client)
    console.log('🔐 Vérification/Création des utilisateurs Supabase Auth...');
    const ensureUser = async (account: typeof TEST_ACCOUNTS[keyof typeof TEST_ACCOUNTS]) => {
      // Tenter de récupérer un utilisateur par email via table profiles
      const { data: existingProfile } = await adminClient
        .from('profiles')
        .select('id')
        .eq('email', account.email)
        .maybeSingle();

      let userId = existingProfile?.id || '';

      if (!userId) {
        const { data, error } = await adminClient.auth.admin.createUser({
          email: account.email,
          password: account.password,
          email_confirm: true,
          user_metadata: { full_name: account.full_name, role: account.role }
        });

        if (error) {
          // Si l'utilisateur existe déjà, on tentera de le récupérer via auth.admin.listUsers
          console.warn(`⚠️ Impossible de créer ${account.email}:`, error.message);
          const { data: usersList } = await adminClient.auth.admin.listUsers();
          const found = usersList?.users?.find(u => u.email === account.email);
          if (!found) throw new Error(`Utilisateur introuvable: ${account.email}`);
          userId = found.id;
        } else {
          userId = data.user?.id || '';
        }

        // Créer le profil lié si absent
        if (userId) {
          const { error: profileErr } = await adminClient
            .from('profiles')
            .insert({
              id: userId,
              email: account.email,
              full_name: account.full_name,
              role: account.role,
              created_at: new Date().toISOString()
            });
          if (profileErr && !profileErr.message.includes('duplicate')) {
            console.error('❌ Erreur création profil:', profileErr);
          }
        }
      }

      return userId;
    };

    const clientUserId = await ensureUser(TEST_ACCOUNTS.client);
    const adminUserId = await ensureUser(TEST_ACCOUNTS.admin);

    console.log(`✅ Comptes Auth prêts: client=${clientUserId}, admin=${adminUserId}`);

    // Vérifier si les projets existent déjà
    const { data: existingProjects } = await adminClient
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
      // Injecter l'id client réel
      const projectsToInsert = TEST_PROJECTS.map(p => ({ ...p, client_id: clientUserId }));
      const { error: projectError } = await adminClient
        .from('projects')
        .insert(projectsToInsert);

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
    console.log('\n📋 Comptes disponibles:');
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