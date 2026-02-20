/**
 * Script de setup complet: vérifie et corrige les utilisateurs demo
 * Usage: node setup-demo.js
 */

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://dhrxwkvdtiqqspljkspq.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRocnh3a3ZkdGlxcXNwbGprc3BxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQyNTA5NCwiZXhwIjoyMDczMDAxMDk0fQ.whbsDR81KJyIb7Dbb_DiepZNS9rRYfHhO6YZpdnt3Vs'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const DEMO_USERS = [
  { email: 'admin.demo@ecotp.com', password: 'EcoTP2024!', name: 'Admin Demo', role: 'admin', company: 'Eco TP' },
  { email: 'client.demo@ecotp.com', password: 'EcoTP2024!', name: 'Client Demo', role: 'client', company: 'Client Demo' }
]

async function setup() {
  console.log('🚀 Setup des utilisateurs demo...\n')

  for (const user of DEMO_USERS) {
    console.log(`\n📧 Traitement de ${user.email}...`)

    // 1. Chercher si l'utilisateur existe déjà
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
    if (listError) {
      console.error('❌ Erreur listUsers:', listError.message)
      continue
    }

    const existing = users.find(u => u.email === user.email)

    if (existing) {
      console.log(`   ✅ Utilisateur trouvé: ${existing.id}`)

      // 2. Mettre à jour le mot de passe
      const { error: updateError } = await supabase.auth.admin.updateUserById(existing.id, {
        password: user.password,
        email_confirm: true,
        user_metadata: { name: user.name, role: user.role }
      })

      if (updateError) {
        console.error(`   ❌ Erreur update password:`, updateError.message)
      } else {
        console.log(`   ✅ Mot de passe mis à jour: ${user.password}`)
      }

      // 3. Vérifier/créer le profil
      const { data: profile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id, name, role')
        .eq('id', existing.id)
        .single()

      if (!profile) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({ id: existing.id, name: user.name, role: user.role, company: user.company })

        if (insertError) {
          console.error(`   ❌ Erreur création profil:`, insertError.message)
        } else {
          console.log(`   ✅ Profil créé`)
        }
      } else {
        // Mettre à jour le rôle si incorrect
        if (profile.role !== user.role || profile.name !== user.name) {
          const { error: updateProfileError } = await supabase
            .from('profiles')
            .update({ name: user.name, role: user.role, company: user.company })
            .eq('id', existing.id)

          if (updateProfileError) {
            console.error(`   ❌ Erreur update profil:`, updateProfileError.message)
          } else {
            console.log(`   ✅ Profil mis à jour: ${user.name} (${user.role})`)
          }
        } else {
          console.log(`   ✅ Profil OK: ${profile.name} (${profile.role})`)
        }
      }

    } else {
      // Créer l'utilisateur
      console.log(`   📝 Création de l'utilisateur...`)
      const { data: authData, error: createError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: { name: user.name, role: user.role }
      })

      if (createError) {
        console.error(`   ❌ Erreur création:`, createError.message)
        continue
      }

      console.log(`   ✅ Utilisateur créé: ${authData.user.id}`)

      // Créer le profil
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ id: authData.user.id, name: user.name, role: user.role, company: user.company })

      if (profileError && !profileError.message.includes('duplicate')) {
        console.error(`   ❌ Erreur profil:`, profileError.message)
      } else {
        console.log(`   ✅ Profil créé`)
      }
    }
  }

  // Créer un projet de test pour le client demo
  console.log('\n📁 Création d\'un projet de test pour le client demo...')

  const { data: { users: allUsers } } = await supabase.auth.admin.listUsers()
  const clientUser = allUsers.find(u => u.email === 'client.demo@ecotp.com')

  if (clientUser) {
    // Vérifier si un projet existe déjà
    const { data: existingProjects } = await supabase
      .from('projects')
      .select('id, name')
      .eq('client_id', clientUser.id)
      .limit(1)

    if (!existingProjects || existingProjects.length === 0) {
      const { error: projectError } = await supabase
        .from('projects')
        .insert({
          client_id: clientUser.id,
          name: 'Villa Moderne - Terrassement',
          status: 'in_progress',
          progress: 45,
          start_date: '2024-02-01',
          end_date: '2024-06-30',
          budget: 75000,
          description: 'Projet de terrassement pour villa moderne avec piscine'
        })

      if (projectError) {
        console.error('   ❌ Erreur création projet:', projectError.message)
      } else {
        console.log('   ✅ Projet de test créé pour client.demo@ecotp.com')
      }
    } else {
      console.log(`   ✅ Projet existant: ${existingProjects[0].name}`)
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📋 COMPTES DE DÉMONSTRATION:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  DEMO_USERS.forEach(u => {
    console.log(`${u.role === 'admin' ? '👨‍💼' : '👤'} ${u.email}`)
    console.log(`   Mot de passe: ${u.password}`)
    console.log(`   Rôle: ${u.role}`)
  })
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('\n✅ Setup terminé ! Testez la connexion sur http://localhost:3000/login')
}

setup()
  .then(() => process.exit(0))
  .catch(err => { console.error('💥 Erreur:', err); process.exit(1) })