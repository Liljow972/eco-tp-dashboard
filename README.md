# 🌱 Ecotp Dashboard - MVP

Tableau de bord moderne pour la gestion de projets écologiques et de transition énergétique.

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation

```bash
# Cloner le repository
git clone https://github.com/votre-username/ecotp-dashboard.git
cd ecotp-dashboard

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📋 Fonctionnalités

### 🎯 Mode MVP (Actuel)
- ✅ **Interface sans authentification** - Test immédiat des fonctionnalités
- ✅ **Vue Client** - Suivi des projets assignés
- ✅ **Vue Admin** - Tableau de bord complet avec statistiques
- ✅ **Données de démonstration** - 6 projets et 4 clients
- ✅ **Graphiques interactifs** - Finances et statuts des projets
- ✅ **Interface responsive** - Compatible mobile et desktop

### 🔮 Fonctionnalités Futures
- 🔄 Authentification Supabase
- 🔄 Connexion Google OAuth
- 🔄 Base de données en temps réel
- 🔄 Upload de documents
- 🔄 Notifications en temps réel

## 🏗️ Architecture

### Stack Technique
- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Graphiques**: Recharts
- **Icons**: Lucide React
- **Base de données**: Supabase (à venir)

### Structure du Projet
```
src/
├── app/                 # Pages Next.js App Router
│   ├── admin/          # Interface administrateur
│   ├── client/         # Interface client
│   └── page.tsx        # Page d'accueil avec sélecteur
├── components/         # Composants réutilisables
├── lib/
│   └── mockData.ts     # Données de démonstration
└── middleware.ts       # Middleware (désactivé en MVP)
```

## 🎮 Utilisation

### Mode MVP
1. **Page d'accueil** : Sélectionnez un utilisateur pour tester
2. **Vue Client** : Consultez vos projets et leur avancement
3. **Vue Admin** : Gérez tous les projets avec statistiques complètes

### Comptes de Test
- **Admin** : Marie Dubois (Accès complet)
- **Client** : Jean Martin (Projets assignés)
- **Client** : Sophie Laurent (Projets assignés)
- **Client** : Pierre Durand (Projets assignés)

## 📊 Données de Démonstration

- **6 projets** avec budgets de 25k€ à 95k€
- **Statuts variés** : En cours, Terminé, En attente
- **Mises à jour** et **documents** pour chaque projet
- **Graphiques financiers** et de progression

## 🛠️ Développement

### Scripts Disponibles
```bash
npm run dev          # Mode développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Vérification du code
```

### Configuration Future
Pour activer Supabase :
1. Copier `.env.example` vers `.env.local`
2. Configurer les variables Supabase
3. Exécuter `supabase-schema.sql`
4. Lancer `node setup-demo.js`

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
npm i -g vercel
vercel
```

### Autres Plateformes
- **Netlify** : Compatible avec Next.js
- **Railway** : Déploiement automatique
- **Docker** : Dockerfile inclus (à venir)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- 📧 Email : support@ecotp.com
- 🐛 Issues : [GitHub Issues](https://github.com/votre-username/ecotp-dashboard/issues)
- 📖 Documentation : [Wiki](https://github.com/votre-username/ecotp-dashboard/wiki)

---

**Développé avec ❤️ pour la transition énergétique**