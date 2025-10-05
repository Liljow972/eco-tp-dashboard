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
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}