import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

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

    return NextResponse.json(clients)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des clients' },
      { status: 500 }
    )
  }
}

// POST - Créer un nouveau client
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()
    const { name, email, company, phone, address } = body

    // Validation des données
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Le nom et l\'email sont requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'email existe déjà
    const { data: existingClient } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    if (existingClient) {
      return NextResponse.json(
        { error: 'Un client avec cet email existe déjà' },
        { status: 409 }
      )
    }

    // Créer le nouveau client
    const { data: newClient, error } = await supabase
      .from('profiles')
      .insert({
        name,
        email,
        role: 'client',
        phone: phone || null,
        company: company || null,
        address: address || null
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la création du client' },
        { status: 500 }
      )
    }

    return NextResponse.json(newClient, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la création du client' },
      { status: 500 }
    )
  }
}