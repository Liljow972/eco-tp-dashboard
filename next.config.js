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
    esmExternals: 'loose',
  },
  // Optimisations pour le déploiement
  swcMinify: true,
  // Configuration pour éviter les erreurs de build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configuration pour les redirections
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig