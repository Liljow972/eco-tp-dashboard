import { NextRequest, NextResponse } from 'next/server'
import { mockProfiles } from '@/lib/mockData'

// GET - Récupérer tous les clients
export async function GET() {
  try {
    const clients = mockProfiles.filter(profile => profile.role === 'client')
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
    const body = await request.json()
    const { name, email, company, phone } = body

    // Validation des données
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Le nom et l\'email sont requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'email existe déjà
    const existingClient = mockProfiles.find(profile => profile.email === email)
    if (existingClient) {
      return NextResponse.json(
        { error: 'Un client avec cet email existe déjà' },
        { status: 409 }
      )
    }

    // Créer le nouveau client
    const newClient = {
      id: `client-${Date.now()}`,
      name,
      email,
      role: 'client' as const,
      company: company || '',
      phone: phone || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Ajouter le client à la liste (simulation BDD)
    mockProfiles.push(newClient)

    return NextResponse.json(newClient, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la création du client' },
      { status: 500 }
    )
  }
}