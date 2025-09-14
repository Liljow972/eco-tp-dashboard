/**
 * Script de configuration automatique pour les comptes démo
 * À exécuter après avoir créé les utilisateurs dans Supabase Auth
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes!')
  console.log('Assurez-vous que .env.local contient :')
  console.log('- NEXT_PUBLIC_SUPABASE_URL')
  console.log('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Comptes démo à créer
const demoAccounts = [
  {
    email: 'admin@ecotp-demo.com',
    password: 'AdminDemo123!',
    name: 'Admin EcoTP',
    role: 'admin'
  },
  {
    email: 'client@ecotp-demo.com',
    password: 'ClientDemo123!',
    name: 'Client Démo',
    role: 'client'
  },
  {
    email: 'client2@ecotp-demo.com',
    password: 'ClientDemo123!',
    name: 'Marie Dupont',
    role: 'client'
  }
]

// Projets de démonstration
const demoProjects = [
  {
    id: 'proj-1',
    name: 'Terrassement Villa Moderne',
    status: 'in_progress',
    progress: 65,
    budget: 45000,
    spent: 29250,
    start_date: '2024-01-15',
    end_date: '2024-03-30',
    description: 'Terrassement pour construction villa 200m² avec piscine'
  },
  {
    id: 'proj-2',
    name: 'Aménagement Jardin',
    status: 'completed',
    progress: 100,
    budget: 15000,
    spent: 14800,
    start_date: '2023-11-01',
    end_date: '2023-12-15',
    description: 'Aménagement paysager avec terrasse et allées'
  },
  {
    id: 'proj-3',
    name: 'Extension Maison',
    status: 'pending',
    progress: 0,
    budget: 32000,
    spent: 0,
    start_date: '2024-04-01',
    end_date: '2024-06-30',
    description: 'Terrassement pour extension 50m²'
  },
  {
    id: 'proj-4',
    name: 'Rénovation Cour',
    status: 'in_progress',
    progress: 30,
    budget: 8500,
    spent: 2550,
    start_date: '2024-02-01',
    end_date: '2024-03-15',
    description: 'Réfection complète de la cour avec drainage'
  }
]

async function createDemoUsers() {
  console.log('🔄 Création des utilisateurs démo...')
  
  const userIds = {}
  
  for (const account of demoAccounts) {
    try {
      // Créer l'utilisateur dans Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true
      })
      
      if (authError) {
        console.error(`❌ Erreur création ${account.email}:`, authError.message)
        continue
      }
      
      const userId = authData.user.id
      userIds[account.email] = userId
      
      // Créer le profil
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: account.email,
          name: account.name,
          role: account.role
        })
      
      if (profileError) {
        console.error(`❌ Erreur profil ${account.email}:`, profileError.message)
      } else {
        console.log(`✅ Utilisateur créé: ${account.email} (${account.role})`)
      }
      
    } catch (error) {
      console.error(`❌ Erreur ${account.email}:`, error.message)
    }
  }
  
  return userIds
}

async function createDemoProjects(userIds) {
  console.log('🔄 Création des projets démo...')
  
  // Assigner les projets aux clients
  const projectAssignments = {
    'proj-1': userIds['client@ecotp-demo.com'],
    'proj-2': userIds['client@ecotp-demo.com'],
    'proj-3': userIds['client2@ecotp-demo.com'],
    'proj-4': userIds['client2@ecotp-demo.com']
  }
  
  for (const project of demoProjects) {
    try {
      const { error } = await supabase
        .from('projects')
        .upsert({
          ...project,
          client_id: projectAssignments[project.id]
        })
      
      if (error) {
        console.error(`❌ Erreur projet ${project.name}:`, error.message)
      } else {
        console.log(`✅ Projet créé: ${project.name}`)
      }
    } catch (error) {
      console.error(`❌ Erreur projet ${project.name}:`, error.message)
    }
  }
}

async function createDemoUpdates() {
  console.log('🔄 Création des mises à jour...')
  
  const updates = [
    {
      id: 'update-1',
      project_id: 'proj-1',
      title: 'Début des travaux de terrassement',
      body: 'Les travaux ont commencé ce matin. L\'équipe a procédé au balisage du terrain et à la préparation des accès.',
      created_at: '2024-01-15T08:00:00Z'
    },
    {
      id: 'update-2',
      project_id: 'proj-1',
      title: 'Excavation principale terminée',
      body: 'L\'excavation pour les fondations est terminée. Profondeur atteinte : 1,2m. Prochaine étape : pose du géotextile.',
      created_at: '2024-01-22T16:30:00Z'
    },
    {
      id: 'update-3',
      project_id: 'proj-1',
      title: 'Installation du drainage',
      body: 'Mise en place du système de drainage périphérique. Tests d\'étanchéité réalisés avec succès.',
      created_at: '2024-02-05T14:15:00Z'
    },
    {
      id: 'update-4',
      project_id: 'proj-1',
      title: 'Remblaiement en cours',
      body: 'Début du remblaiement avec matériaux sélectionnés. Compactage par couches de 30cm.',
      created_at: '2024-02-18T10:45:00Z'
    },
    {
      id: 'update-5',
      project_id: 'proj-2',
      title: 'Projet terminé avec succès',
      body: 'Livraison du projet d\'aménagement paysager. Client très satisfait du résultat final.',
      created_at: '2023-12-15T17:00:00Z'
    },
    {
      id: 'update-6',
      project_id: 'proj-4',
      title: 'Démarrage des travaux',
      body: 'Début des travaux de rénovation de la cour. Démolition de l\'ancien revêtement en cours.',
      created_at: '2024-02-01T09:00:00Z'
    }
  ]
  
  for (const update of updates) {
    try {
      const { error } = await supabase
        .from('project_updates')
        .upsert(update)
      
      if (error) {
        console.error(`❌ Erreur mise à jour ${update.title}:`, error.message)
      } else {
        console.log(`✅ Mise à jour créée: ${update.title}`)
      }
    } catch (error) {
      console.error(`❌ Erreur mise à jour ${update.title}:`, error.message)
    }
  }
}

async function createDemoDocuments() {
  console.log('🔄 Création des documents démo...')
  
  const documents = [
    {
      id: 'doc-1',
      project_id: 'proj-1',
      label: 'Contrat de terrassement',
      type: 'contract',
      file_path: 'contracts/contrat-villa-moderne.pdf',
      file_size: 245760,
      mime_type: 'application/pdf'
    },
    {
      id: 'doc-2',
      project_id: 'proj-1',
      label: 'Plan de terrassement',
      type: 'deliverable',
      file_path: 'plans/plan-terrassement-villa.pdf',
      file_size: 1024000,
      mime_type: 'application/pdf'
    },
    {
      id: 'doc-3',
      project_id: 'proj-1',
      label: 'Facture acompte 1',
      type: 'invoice',
      file_path: 'invoices/facture-acompte-1.pdf',
      file_size: 156800,
      mime_type: 'application/pdf'
    },
    {
      id: 'doc-4',
      project_id: 'proj-2',
      label: 'Contrat aménagement',
      type: 'contract',
      file_path: 'contracts/contrat-amenagement-jardin.pdf',
      file_size: 198400,
      mime_type: 'application/pdf'
    },
    {
      id: 'doc-5',
      project_id: 'proj-2',
      label: 'Photos finales',
      type: 'deliverable',
      file_path: 'photos/photos-finales-jardin.zip',
      file_size: 8388608,
      mime_type: 'application/zip'
    }
  ]
  
  for (const doc of documents) {
    try {
      const { error } = await supabase
        .from('documents')
        .upsert(doc)
      
      if (error) {
        console.error(`❌ Erreur document ${doc.label}:`, error.message)
      } else {
        console.log(`✅ Document créé: ${doc.label}`)
      }
    } catch (error) {
      console.error(`❌ Erreur document ${doc.label}:`, error.message)
    }
  }
}

async function main() {
  console.log('🚀 Configuration des données de démonstration...')
  console.log('📍 URL Supabase:', supabaseUrl)
  
  try {
    // Vérifier la connexion
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    if (error) {
      console.error('❌ Erreur de connexion Supabase:', error.message)
      process.exit(1)
    }
    
    console.log('✅ Connexion Supabase OK')
    
    // Créer les données
    const userIds = await createDemoUsers()
    await createDemoProjects(userIds)
    await createDemoUpdates()
    await createDemoDocuments()
    
    console.log('\n🎉 Configuration terminée !')
    console.log('\n📋 Comptes de test créés :')
    console.log('👤 Admin: admin@ecotp-demo.com / AdminDemo123!')
    console.log('👤 Client 1: client@ecotp-demo.com / ClientDemo123!')
    console.log('👤 Client 2: client2@ecotp-demo.com / ClientDemo123!')
    console.log('\n🌐 Testez sur: http://localhost:3000')
    
  } catch (error) {
    console.error('❌ Erreur:', error.message)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

module.exports = { main }