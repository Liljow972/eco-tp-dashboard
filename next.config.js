/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  // Configuration pour Netlify
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
}

module.exports = nextConfig