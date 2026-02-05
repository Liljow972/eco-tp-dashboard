#!/bin/bash

# Script interactif de configuration Supabase
# Guide l'utilisateur étape par étape

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 CONFIGURATION SUPABASE - GUIDE INTERACTIF"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Ce script va vous guider pour configurer Supabase."
echo "Temps estimé : 20 minutes"
echo ""

# Fonction pour attendre l'utilisateur
wait_user() {
    echo ""
    read -p "Appuyez sur ENTRÉE quand c'est fait..."
    echo ""
}

# Fonction pour ouvrir une URL
open_url() {
    echo "🌐 Ouverture de : $1"
    open "$1" 2>/dev/null || xdg-open "$1" 2>/dev/null || echo "   Ouvrez manuellement : $1"
    sleep 2
}

# ÉTAPE 1 : Table documents
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 ÉTAPE 1/3 : Créer la table documents"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Je vais ouvrir Supabase Dashboard dans votre navigateur"
echo "2. Connectez-vous à votre compte"
echo "3. Sélectionnez le projet : dhrxwkvdtiqqspljkspq"
echo ""
read -p "Prêt ? (Appuyez sur ENTRÉE pour continuer)"

open_url "https://supabase.com/dashboard"

echo ""
echo "4. Dans le menu de gauche, cliquez sur 'SQL Editor' 📝"
echo "5. Cliquez sur 'New query'"
wait_user

echo "6. Je vais ouvrir le fichier SQL dans votre éditeur..."
echo ""
open "supabase-create-documents-table.sql"
sleep 2

echo "7. Copiez TOUT le contenu du fichier (Cmd+A puis Cmd+C)"
echo "8. Collez-le dans l'éditeur SQL de Supabase (Cmd+V)"
echo "9. Cliquez sur 'Run' (ou Cmd+Enter)"
echo ""
echo "Vous devriez voir : ✅ Success. No rows returned"
wait_user

echo "✅ Table documents créée !"
echo ""

# ÉTAPE 2 : Bucket documents
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 ÉTAPE 2/3 : Créer le bucket documents"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Dans Supabase, cliquez sur 'Storage' 📁 dans le menu de gauche"
echo "2. Cliquez sur 'New bucket'"
echo "3. Remplissez :"
echo "   - Name : documents"
echo "   - Public bucket : NON (décoché)"
echo "4. Cliquez sur 'Create bucket'"
wait_user

echo "5. Cliquez sur le bucket 'documents'"
echo "6. Allez dans l'onglet 'Policies'"
echo "7. Cliquez sur 'New policy'"
echo ""
echo "Créez 3 politiques :"
echo ""
echo "📌 Politique 1 - Upload"
echo "   - Policy name : Authenticated users can upload"
echo "   - Allowed operation : INSERT"
echo "   - Policy definition : bucket_id = 'documents' AND auth.role() = 'authenticated'"
wait_user

echo "📌 Politique 2 - Lecture"
echo "   - Policy name : Authenticated users can view"
echo "   - Allowed operation : SELECT"
echo "   - Policy definition : bucket_id = 'documents' AND auth.role() = 'authenticated'"
wait_user

echo "📌 Politique 3 - Suppression"
echo "   - Policy name : Authenticated users can delete"
echo "   - Allowed operation : DELETE"
echo "   - Policy definition : bucket_id = 'documents' AND auth.role() = 'authenticated'"
wait_user

echo "✅ Bucket documents créé et configuré !"
echo ""

# ÉTAPE 3 : Google OAuth
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 ÉTAPE 3/3 : Configurer Google OAuth"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Cette étape est OPTIONNELLE mais recommandée."
echo ""
read -p "Voulez-vous configurer Google OAuth maintenant ? (o/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Oo]$ ]]; then
    echo ""
    echo "📍 PARTIE A : Google Cloud Console"
    echo ""
    echo "1. Je vais ouvrir Google Cloud Console"
    read -p "Appuyez sur ENTRÉE pour continuer"
    
    open_url "https://console.cloud.google.com"
    
    echo ""
    echo "2. Créez un projet (si nécessaire) ou sélectionnez-en un"
    echo "3. Menu ☰ → APIs & Services → Library"
    echo "4. Cherchez 'Google+ API' et activez-le"
    wait_user
    
    echo "5. Menu ☰ → APIs & Services → Credentials"
    echo "6. Create Credentials → OAuth client ID"
    echo "7. Si demandé, configurez l'écran de consentement (External)"
    wait_user
    
    echo "8. Application type : Web application"
    echo "9. Name : EcoTP Dashboard Web"
    echo ""
    echo "10. Authorized JavaScript origins :"
    echo "    http://localhost:3000"
    echo "    https://votre-site.vercel.app"
    echo ""
    echo "11. Authorized redirect URIs :"
    echo "    https://dhrxwkvdtiqqspljkspq.supabase.co/auth/v1/callback"
    echo ""
    echo "12. Cliquez sur Create"
    wait_user
    
    echo "13. COPIEZ le Client ID et le Client Secret"
    echo "    (Gardez-les sous la main pour l'étape suivante)"
    wait_user
    
    echo ""
    echo "📍 PARTIE B : Supabase Dashboard"
    echo ""
    echo "1. Retournez sur Supabase Dashboard"
    echo "2. Authentication → Providers → Google"
    echo "3. Activez le toggle 'Enable Sign in with Google'"
    echo "4. Collez le Client ID de Google"
    echo "5. Collez le Client Secret de Google"
    echo "6. Cliquez sur Save"
    wait_user
    
    echo "✅ Google OAuth configuré !"
else
    echo ""
    echo "⏭️  Google OAuth ignoré (vous pourrez le configurer plus tard)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 VÉRIFICATION FINALE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Testons la connexion Supabase..."
echo ""

node scripts/test-supabase.js

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 CONFIGURATION TERMINÉE !"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Prochaines étapes :"
echo ""
echo "1. Tester l'application :"
echo "   npm run dev"
echo "   Ouvrir : http://localhost:3000"
echo ""
echo "2. Tester l'inscription et la connexion"
echo ""
echo "3. Consulter le guide complet :"
echo "   GUIDE_CONFIGURATION_SUPABASE.md"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
