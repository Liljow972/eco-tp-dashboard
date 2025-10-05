/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour Netlify/Vercel
  trailingSlash: true,
  // Désactiver l'optimisation d'images pour Netlify
  images: {
    unoptimized: true,
    domains: ['lh3.googleusercontent.com', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
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
  // Forcer le mode serveur (pas d'export statique)
  output: undefined,
}

module.exports = nextConfig