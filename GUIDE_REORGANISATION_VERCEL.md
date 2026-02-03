# 🚀 GUIDE DE RÉORGANISATION SPARKLLEX POUR VERCEL

## 📋 Vue d'ensemble

Ce guide vous accompagne pour réorganiser votre projet Sparkllex afin que Vercel (avec Root Directory = `01_MARKETING`) trouve toutes les ressources nécessaires.

---

## ⚠️ IMPORTANT : Faites une sauvegarde avant de commencer

```powershell
# Créer une sauvegarde complète
cd "C:\Users\Tic Isteah\Documents"
Copy-Item -Path "SPARKLLEX_OFFICIAL" -Destination "SPARKLLEX_BACKUP_$(Get-Date -Format 'yyyy-MM-dd_HH-mm')" -Recurse
```

---

## 🎯 ÉTAPE 1 : Réorganisation des dossiers (2 minutes)

### Exécuter le script de déplacement

```powershell
cd "C:\Users\Tic Isteah\Documents\SPARKLLEX_OFFICIAL"
.\reorganize-for-vercel.ps1
```

**Ce script va :**
- Déplacer `images/` dans `01_MARKETING/images/`
- Déplacer `api/` dans `01_MARKETING/api/`
- Déplacer `02_MEMBERS_APP/` dans `01_MARKETING/02_MEMBERS_APP/`
- Déplacer `03_OPERATIONS/` dans `01_MARKETING/03_OPERATIONS/`
- Déplacer `04_ADMIN_METRICS/` dans `01_MARKETING/04_ADMIN_METRICS/`
- Déplacer tous les fichiers JS/CSS essentiels dans `01_MARKETING/`

**Résultat attendu :**
```
01_MARKETING/
├── images/
├── api/
├── 02_MEMBERS_APP/
├── 03_OPERATIONS/
├── 04_ADMIN_METRICS/
├── index.html
├── signup.html
├── login.html
├── pricing.html
├── config.js
├── translations.js
├── database-config.js
├── stripe-config.js
├── styles.css
├── auth-guard.js
└── ... (autres fichiers)
```

---

## 🔧 ÉTAPE 2 : Correction automatique des chemins (1 minute)

### Exécuter le script de correction

```powershell
.\fix-paths-after-move.ps1
```

**Ce script va automatiquement :**
- Remplacer `../images/` par `./images/` dans tous les fichiers racine
- Remplacer `/images/` par `./images/` pour les chemins absolus
- Corriger tous les imports JS : `../config.js` → `./config.js`
- Corriger tous les liens CSS : `../styles.css` → `./styles.css`
- Mettre à jour les redirections : `localhost` → `https://sparkllex.com`
- Corriger tous les liens internes entre pages

**Fichiers qui seront automatiquement corrigés :**
- ✅ Tous les .html dans `01_MARKETING/`
- ✅ Tous les .js dans `01_MARKETING/`
- ✅ Tous les fichiers dans `02_MEMBERS_APP/`
- ✅ Tous les fichiers dans `03_OPERATIONS/`
- ✅ Tous les fichiers dans `04_ADMIN_METRICS/`

---

## 🧪 ÉTAPE 3 : Test local (3 minutes)

### Lancer un serveur local

```powershell
# Option 1 : Python (si installé)
cd "C:\Users\Tic Isteah\Documents\SPARKLLEX_OFFICIAL\01_MARKETING"
python -m http.server 8000

# Option 2 : PHP (si installé)
php -S localhost:8000

# Option 3 : Live Server VSCode (recommandé)
# Clic droit sur index.html > Open with Live Server
```

### Tests à effectuer

1. **Page d'accueil** : http://localhost:8000/index.html
   - ✅ Le logo s'affiche
   - ✅ Les images de service s'affichent
   - ✅ Le CSS est appliqué

2. **Page de pricing** : http://localhost:8000/pricing.html
   - ✅ Toutes les images sont visibles
   - ✅ Les boutons de plan fonctionnent

3. **Signup/Login** : http://localhost:8000/signup.html
   - ✅ Le formulaire s'affiche
   - ✅ Créez un compte test
   - ✅ Vérifiez la redirection (devrait être https://sparkllex.com/...)

4. **Dashboard membre** : Après login
   - ✅ Les ressources se chargent
   - ✅ Les liens fonctionnent

---

## 📦 ÉTAPE 4 : Git Push (2 minutes)

### Commandes Git à exécuter

```powershell
cd "C:\Users\Tic Isteah\Documents\SPARKLLEX_OFFICIAL"

# 1. Ajouter tous les changements
git add .

# 2. Committer avec un message clair
git commit -m "🚀 Restructuration pour Vercel: Tout dans 01_MARKETING"

# 3. Push vers GitHub
git push origin main

# Si le push échoue (divergence), forcer avec précaution :
git push origin main --force
```

### Si vous avez des conflits

```powershell
# Sauvegarder vos changements
git stash

# Mettre à jour depuis GitHub
git pull origin main

# Réappliquer vos changements
git stash pop

# Résoudre les conflits manuellement si nécessaire
# Puis :
git add .
git commit -m "🚀 Restructuration pour Vercel: Tout dans 01_MARKETING"
git push origin main
```

---

## ⚙️ ÉTAPE 5 : Configuration Vercel (5 minutes)

### Variables d'environnement à ajouter

Dans le dashboard Vercel (Settings → Environment Variables), ajoutez :

| Variable | Valeur | Utilisation |
|----------|--------|-------------|
| `STRIPE_SECRET_KEY` | `sk_live_...` | Paiements Stripe (PRODUCTION) |
| `STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Paiements Stripe (Frontend) |
| `SUPABASE_URL` | `https://xpdmvmxdqfnvrzetoxlz.supabase.co` | Base de données |
| `SUPABASE_ANON_KEY` | `eyJ...` | Authentification Supabase |
| `NEXT_PUBLIC_SITE_URL` | `https://sparkllex.com` | URL du site en production |

### Configuration du projet Vercel

1. **Root Directory** : `01_MARKETING` ✅ (déjà configuré)
2. **Framework Preset** : `Other`
3. **Build Command** : Laisser vide (site statique)
4. **Output Directory** : `.` (point, car tout est déjà dans 01_MARKETING)
5. **Install Command** : Laisser vide

### Configuration supplémentaire (optionnelle)

Créer un fichier `vercel.json` dans `01_MARKETING/` :

```json
{
  "version": 2,
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## 🔍 VÉRIFICATION POST-DÉPLOIEMENT

### Checklist complète

Après le redéploiement sur Vercel, testez :

- [ ] **https://sparkllex.com** : Page d'accueil s'affiche correctement
- [ ] **Images** : Logo, images de services visibles
- [ ] **Navigation** : Tous les liens de menu fonctionnent
- [ ] **Login** : https://sparkllex.com/login.html accessible
- [ ] **Signup** : https://sparkllex.com/signup.html fonctionne
- [ ] **Pricing** : https://sparkllex.com/pricing.html affiche les plans
- [ ] **Dashboard** : Accessible après login (https://sparkllex.com/02_MEMBERS_APP/...)
- [ ] **Stripe Checkout** : Redirection vers Stripe fonctionne
- [ ] **Traductions** : ES/EN switcher fonctionne

### Tests de paiement

```
Test Card : 4242 4242 4242 4242
Expiration : 12/34
CVC : 123
```

---

## 🐛 TROUBLESHOOTING

### Problème : Images ne s'affichent pas

**Cause** : Chemins incorrects après déplacement

**Solution** :
```powershell
# Réexécuter le script de correction
.\fix-paths-after-move.ps1

# Vérifier manuellement un fichier
code "C:\Users\Tic Isteah\Documents\SPARKLLEX_OFFICIAL\01_MARKETING\index.html"
# Chercher : src="./images/ (doit être avec .)
```

### Problème : Erreur 404 sur les pages

**Cause** : Structure de dossiers incorrecte

**Solution** :
```powershell
# Vérifier que tout est bien dans 01_MARKETING
Get-ChildItem "C:\Users\Tic Isteah\Documents\SPARKLLEX_OFFICIAL\01_MARKETING"
# Vous devez voir : images/, api/, 02_MEMBERS_APP/, etc.
```

### Problème : Dashboard inaccessible après login

**Cause** : Redirection pointe vers localhost

**Solution** :
```powershell
# Chercher et remplacer dans signup.js
cd "C:\Users\Tic Isteah\Documents\SPARKLLEX_OFFICIAL\01_MARKETING"
code signup.js
# Remplacer : localhost → https://sparkllex.com
```

### Problème : Stripe ne fonctionne pas

**Cause** : Variables d'environnement manquantes sur Vercel

**Solution** :
1. Dashboard Vercel → Settings → Environment Variables
2. Ajouter `STRIPE_SECRET_KEY` et `STRIPE_PUBLISHABLE_KEY`
3. Redéployer le site

---

## 📊 STRUCTURE FINALE ATTENDUE

```
SPARKLLEX_OFFICIAL/
│
├── 01_MARKETING/                    ← ROOT DIRECTORY VERCEL
│   ├── images/                      ← Toutes les images
│   │   ├── logo.png
│   │   └── ...
│   ├── api/                         ← Endpoints backend
│   │   └── create-checkout-session.js
│   ├── 02_MEMBERS_APP/              ← Zone membre
│   │   ├── dashboard.html
│   │   ├── membership-status.html
│   │   └── ...
│   ├── 03_OPERATIONS/               ← Zone opérations
│   │   ├── staff-dashboard.html
│   │   └── ...
│   ├── 04_ADMIN_METRICS/            ← Zone admin
│   │   └── ...
│   ├── index.html                   ← Page d'accueil
│   ├── signup.html
│   ├── login.html
│   ├── pricing.html
│   ├── config.js                    ← Configuration globale
│   ├── translations.js              ← Traductions ES/EN
│   ├── database-config.js           ← Config Supabase
│   ├── stripe-config.js             ← Config Stripe
│   ├── styles.css                   ← Styles globaux
│   ├── auth-guard.js                ← Protection des pages
│   └── ...
│
├── reorganize-for-vercel.ps1        ← Script de réorganisation
├── fix-paths-after-move.ps1         ← Script de correction
├── README.md
└── .gitignore

```

---

## ✅ CHECKLIST FINALE

Avant de considérer le projet comme terminé :

- [ ] Scripts exécutés sans erreur
- [ ] Tests locaux passent
- [ ] Git push réussi
- [ ] Vercel redéployé automatiquement
- [ ] Site accessible sur https://sparkllex.com
- [ ] Toutes les images s'affichent
- [ ] Login/Signup fonctionnent
- [ ] Dashboard membre accessible
- [ ] Paiements Stripe testés
- [ ] Traductions ES/EN opérationnelles

---

## 🎉 FÉLICITATIONS !

Votre site Sparkllex est maintenant correctement structuré pour Vercel. Toutes les ressources sont dans `01_MARKETING`, ce qui garantit que Vercel trouve absolument tout pour afficher et faire fonctionner votre site.

**Prochaines étapes recommandées :**
1. Configurer un domaine personnalisé sur Vercel
2. Activer le SSL (HTTPS) automatique
3. Configurer les webhooks Stripe pour les paiements
4. Mettre en place la sauvegarde automatique de la base de données
5. Surveiller les logs Vercel pour les erreurs

---

**Support :**
- Documentation Vercel : https://vercel.com/docs
- Dashboard Vercel : https://vercel.com/dashboard
- Stripe Dashboard : https://dashboard.stripe.com
- Supabase Dashboard : https://app.supabase.com

---

*Guide créé le 3 février 2026*
