/**
 * Script pour créer des utilisateurs de test avec des mots de passe connus
 * Usage: node create-test-users.js
 */

const { createClient } = require('@supabase/supabase-js')

// ⚠️ REMPLACEZ ces valeurs par vos vraies clés Supabase
const SUPABASE_URL = 'https://dhrxwkvdtiqqspljkspq.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRocnh3a3ZkdGlxcXNwbGprc3BxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQyNTA5NCwiZXhwIjoyMDczMDAxMDk0fQ.whbsDR81KJyIb7Dbb_DiepZNS9rRYfHhO6YZpdnt3Vs' // ⚠️ À REMPLACER

// Créer un client Supabase avec la clé service_role (admin)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

// Utilisateurs à créer
const testUsers = [
    {
        email: 'admin.demo@ecotp.com',
        password: 'EcoTP2024!',
        name: 'Admin Demo',
        role: 'admin',
        company: 'Eco TP'
    },
    {
        email: 'client.demo@ecotp.com',
        password: 'EcoTP2024!',
        name: 'Client Demo',
        role: 'client',
        company: 'Particulier'
    }
]

async function createTestUsers() {
    console.log('🚀 Création des utilisateurs de test...\n')

    for (const user of testUsers) {
        try {
            console.log(`📧 Création de ${user.email}...`)

            // 1. Créer l'utilisateur dans auth.users
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                email: user.email,
                password: user.password,
                email_confirm: true, // Confirmer l'email automatiquement
                user_metadata: {
                    name: user.name,
                    role: user.role
                }
            })

            if (authError) {
                console.error(`❌ Erreur création auth pour ${user.email}:`, authError.message)
                continue
            }

            console.log(`✅ Utilisateur auth créé: ${authData.user.id}`)

            // 2. Créer le profil dans la table profiles
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: authData.user.id,
                    name: user.name,
                    role: user.role,
                    company: user.company
                })

            if (profileError) {
                console.error(`❌ Erreur création profil pour ${user.email}:`, profileError.message)
                continue
            }

            console.log(`✅ Profil créé pour ${user.email}`)
            console.log(`   📝 Email: ${user.email}`)
            console.log(`   🔑 Mot de passe: ${user.password}`)
            console.log(`   👤 Rôle: ${user.role}`)
            console.log(`   🆔 ID: ${authData.user.id}\n`)

        } catch (error) {
            console.error(`❌ Erreur inattendue pour ${user.email}:`, error.message)
        }
    }

    console.log('✅ Terminé !\n')
    console.log('📋 Résumé des comptes créés:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    testUsers.forEach(user => {
        console.log(`${user.role === 'admin' ? '👨‍💼' : '👤'} ${user.email} / ${user.password} (${user.role})`)
    })
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

// Exécuter le script
createTestUsers()
    .then(() => {
        console.log('🎉 Script terminé avec succès !')
        process.exit(0)
    })
    .catch((error) => {
        console.error('💥 Erreur fatale:', error)
        process.exit(1)
    })
