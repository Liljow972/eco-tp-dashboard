import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Récupérer le token depuis les headers
    const authorization = request.headers.get('authorization')
    
    if (!authorization) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 })
    }

    // Validation basique du token (à adapter selon vos besoins)
    const token = authorization.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    }

    return NextResponse.json({ 
      message: 'Authentification réussie',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}