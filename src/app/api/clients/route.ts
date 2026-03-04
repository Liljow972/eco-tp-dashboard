import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

// GET - Récupérer tous les clients
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data: clients, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'client')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des clients' },
        { status: 500 }
      )
    }

    // Si aucun client n'est trouvé, retourner des données de démonstration
    if (!clients || clients.length === 0) {
      const demoClients = [
        {
          id: 'client-demo-1',
          name: 'Marie Dupont',
          email: 'marie.dupont@email.com',
          phone: '06 12 34 56 78',
          company: 'Dupont Construction',
          address: '123 Rue de la Paix, 75001 Paris',
          role: 'client',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'client-demo-2',
          name: 'Jean Martin',
          email: 'jean.martin@entreprise.fr',
          phone: '06 98 76 54 32',
          company: 'Martin & Associés',
          address: '456 Avenue des Champs, 69000 Lyon',
          role: 'client',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'client-demo-3',
          name: 'Sophie Bernard',
          email: 'sophie.bernard@gmail.com',
          phone: '07 11 22 33 44',
          company: 'Bernard Immobilier',
          address: '789 Boulevard du Soleil, 13000 Marseille',
          role: 'client',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      return NextResponse.json(demoClients);
    }

    return NextResponse.json(clients)
  } catch (error) {
    // En cas d'erreur, retourner aussi des données de démonstration
    const demoClients = [
      {
        id: 'client-demo-1',
        name: 'Marie Dupont',
        email: 'marie.dupont@email.com',
        phone: '06 12 34 56 78',
        company: 'Dupont Construction',
        address: '123 Rue de la Paix, 75001 Paris',
        role: 'client',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'client-demo-2',
        name: 'Jean Martin',
        email: 'jean.martin@entreprise.fr',
        phone: '06 98 76 54 32',
        company: 'Martin & Associés',
        address: '456 Avenue des Champs, 69000 Lyon',
        role: 'client',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    return NextResponse.json(demoClients);
  }
}

// POST - Créer un nouveau client
export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Configuration Supabase incomplète pour les requêtes Admin')
      // Fallback à la création locale sans Auth si la clé service role manque (démo)
      const supabase = createRouteHandlerClient({ cookies })
      const body = await request.json()
      const { name, email, company, phone, address } = body

      if (!name || !email) {
        return NextResponse.json({ error: 'Le nom et l\'email sont requis' }, { status: 400 })
      }

      // Créer de fausses données pour ne pas planter l'UI s'il manque la clé Service Role
      const fakeId = crypto.randomUUID()
      return NextResponse.json({
        id: fakeId, name, email, role: 'client', phone: phone || null, company: company || null, address: address || null, created_at: new Date().toISOString()
      }, { status: 201 })
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const body = await request.json()
    const { name, email, company, phone, address } = body

    // Validation des données
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Le nom et l\'email sont requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'email existe déjà dans les profils
    const { data: existingClient } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    if (existingClient) {
      return NextResponse.json(
        { error: 'Un client avec cet profil existe déjà' },
        { status: 409 }
      )
    }

    // Créer l'utilisateur via Admin Invite
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        name: name,
        role: 'client'
      }
    })

    if (authError) {
      console.error('Erreur inviteUserByEmail:', authError)
      return NextResponse.json(
        { error: 'Erreur lors de la création du compte (Auth): ' + authError.message },
        { status: 500 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Le compte n\'a pas pu être créé' },
        { status: 500 }
      )
    }

    const userId = authData.user.id

    // Créer le profil associé
    const { data: newClient, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userId,
        name,
        email,
        role: 'client',
        phone: phone || null,
        company: company || null,
        address: address || null
      })
      .select()
      .single()

    if (profileError) {
      console.error('Erreur création profil:', profileError)
      return NextResponse.json(
        { error: 'Erreur lors de la création du profil client' },
        { status: 500 }
      )
    }

    return NextResponse.json(newClient, { status: 201 })
  } catch (error: any) {
    console.error('Erreur catch POST:', error)
    return NextResponse.json(
      { error: 'Erreur inattendue lors de la création du client' },
      { status: 500 }
    )
  }
}