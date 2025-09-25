#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de la configuration de déploiement...\n');

// Vérifier les fichiers de configuration
const configFiles = [
  'next.config.js',
  'netlify.toml',
  'vercel.json',
  'package.json'
];

configFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.log(`❌ ${file} manquant`);
  }
});

// Vérifier les variables d'environnement
console.log('\n📋 Variables d\'environnement requises:');
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar} définie`);
  } else {
    console.log(`⚠️  ${envVar} non définie (normal en local)`);
  }
});

// Vérifier les routes API
console.log('\n🔗 Routes API détectées:');
const apiDir = path.join(__dirname, 'src', 'app', 'api');
if (fs.existsSync(apiDir)) {
  const routes = fs.readdirSync(apiDir);
  routes.forEach(route => {
    const routePath = path.join(apiDir, route);
    if (fs.statSync(routePath).isDirectory()) {
      const routeFile = path.join(routePath, 'route.ts');
      if (fs.existsSync(routeFile)) {
        console.log(`✅ /api/${route}`);
      }
    }
  });
}

console.log('\n🚀 Prêt pour le déploiement !');
console.log('\nCommandes de déploiement:');
console.log('- Netlify: npm run build && netlify deploy --prod');
console.log('- Vercel: vercel --prod');