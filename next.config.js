/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour Netlify/Vercel
  trailingSlash: true,
  // Désactiver l'optimisation d'images pour Netlify
  images: {
    unoptimized: true,
    domains: ['lh3.googleusercontent.com'],
  },
  // Configuration pour les fonctions serverless
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  // Configuration pour gérer les fonctions dynamiques
  output: 'standalone',
  // Optimisations pour le déploiement
  swcMinify: true,
  // Configuration pour les routes API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig