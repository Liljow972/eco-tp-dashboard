// Middleware désactivé pour le MVP - Accès libre à toutes les pages
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Redirection propre des anciennes routes vers le dashboard unifié
  const url = req.nextUrl.clone()
  const { pathname } = req.nextUrl

  if (pathname === '/admin' || pathname === '/client') {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Pour le MVP, on laisse passer toutes les autres requêtes
  return NextResponse.next()
}

export const config = {
  // Ne faire agir le middleware que sur les anciennes routes à rediriger
  matcher: ['/admin', '/client'],
}