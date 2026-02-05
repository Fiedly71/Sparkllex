# 🔧 CONFIGURATION STRIPE BILLING OBLIGATOIRE

## ⚠️ PROBLÈMES RÉSOLUS

Avant cette fix:
- ❌ L'annulation ne fonctionnait PAS (continuait à facturer)
- ❌ Impossible de changer de carte bancaire
- ❌ Changer de plan créait 2 abonnements (double facturation)
- ❌ Pas d'accès aux factures

Maintenant:
- ✅ Le client gère TOUT depuis le Stripe Customer Portal
- ✅ Annulation réelle qui arrête les paiements
- ✅ Changement de plan sans créer de doublon
- ✅ Téléchargement des factures
- ✅ Mise à jour de la carte bancaire

---

## 📋 ÉTAPES D'INSTALLATION (30 minutes)

### **Étape 1: Mettre à jour la base de données Supabase**

Allez dans votre Dashboard Supabase → SQL Editor → Nouveau Query:

```sql
-- Ajouter les colonnes Stripe dans la table profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_current_period_end TIMESTAMPTZ;

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer 
ON profiles(stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_profiles_stripe_subscription 
ON profiles(stripe_subscription_id);
```

Cliquez "Run" pour exécuter.

---

### **Étape 2: Activer le Stripe Customer Portal**

1. Allez sur **[Stripe Dashboard → Settings → Billing](https://dashboard.stripe.com/settings/billing/portal)**
2. Cliquez **"Activate test link"** (puis "Activate" pour production)
3. Configurez les options:
   - ✅ **Cancel subscriptions**: Immediately / At period end
   - ✅ **Update subscriptions**: Allow customers to switch plans
   - ✅ **Update payment methods**: Enabled
   - ✅ **Invoice history**: Enabled
4. Cliquez **"Save changes"**

---

### **Étape 3: Configurer les Webhooks Stripe**

1. Allez sur **[Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)**
2. Cliquez **"Add endpoint"**
3. URL du endpoint: `https://votre-site.com/api/stripe-webhook`
4. Sélectionnez ces événements:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_failed`
5. Cliquez **"Add endpoint"**
6. **COPIEZ le "Signing secret"** (commence par `whsec_...`)

---

### **Étape 4: Variables d'environnement**

Créez un fichier `.env` à la racine:

```env
# Stripe Production Keys
STRIPE_SECRET_KEY=sk_live_VOTRE_CLE_SECRETE
STRIPE_WEBHOOK_SECRET=whsec_LE_SECRET_DU_WEBHOOK

# Supabase Config
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOi... (Service Role Key, PAS Anon Key!)
```

⚠️ **ATTENTION**: 
- Ne commitez JAMAIS `.env` sur Git
- Ajoutez `.env` dans votre `.gitignore`

---

### **Étape 5: Installer les dépendances**

```bash
npm install stripe @supabase/supabase-js
```

---

### **Étape 6: Déployer sur Vercel**

1. Créez un compte sur [Vercel](https://vercel.com)
2. Connectez votre repo GitHub
3. Ajoutez les variables d'environnement dans Vercel Dashboard → Settings → Environment Variables
4. Déployez

Après déploiement, Vercel vous donnera une URL comme:
`https://sparkllex-xxx.vercel.app`

---

### **Étape 7: Mettre à jour l'URL dans membership-status.html**

Remplacez ligne ~315:

```javascript
const response = await fetch('https://votre-site.com/api/create-billing-portal', {
```

Par votre vraie URL Vercel:

```javascript
const response = await fetch('https://sparkllex-xxx.vercel.app/api/create-billing-portal', {
```

---

### **Étape 8: Retourner dans Stripe pour finaliser le Webhook**

1. Retournez sur [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Cliquez sur votre webhook
3. Cliquez **"Update details"**
4. Changez l'URL pour votre vraie URL Vercel:
   `https://sparkllex-xxx.vercel.app/api/stripe-webhook`
5. Cliquez **"Update endpoint"**

---

## 🧪 TESTER LE SYSTÈME

### Test 1: Nouveau paiement
1. Créez un nouveau compte sur votre site
2. Choisissez un plan et payez
3. Vérifiez dans Supabase que `stripe_customer_id` et `stripe_subscription_id` sont remplis
4. Vérifiez dans Stripe Dashboard → Customers qu'un nouveau client existe

### Test 2: Billing Portal
1. Connectez-vous avec le compte test
2. Allez dans membership-status.html
3. Cliquez "Manage Billing & Cancel"
4. Vous devez être redirigé vers le Stripe Customer Portal
5. Testez l'annulation → Vérifiez que `plan_status` devient 'canceled' dans Supabase

### Test 3: Changement de plan
1. Dans le Customer Portal, changez de plan
2. Vérifiez dans Supabase que le `plan` est mis à jour
3. Vérifiez qu'il n'y a qu'UN SEUL abonnement actif dans Stripe

---

## 🔒 SÉCURITÉ

✅ **Les endpoints API sont sécurisés:**
- Vérification de signature Stripe pour les webhooks
- CORS configuré
- Pas d'exposition de clés sensibles côté client

❌ **NE JAMAIS:**
- Commiter `.env` sur GitHub
- Utiliser `STRIPE_SECRET_KEY` côté client (seulement `publishableKey`)
- Partager le `STRIPE_WEBHOOK_SECRET`

---

## 📊 MONITORING

Après déploiement, surveillez:
1. **Stripe Dashboard → Webhooks**: Vérifier que les événements sont "Succeeded" (pas "Failed")
2. **Vercel Dashboard → Logs**: Vérifier qu'il n'y a pas d'erreurs dans les API
3. **Supabase Dashboard → Table Editor**: Vérifier que les données sont synchronisées

---

## ❓ TROUBLESHOOTING

### Problème: "No billing information found"
→ Le `stripe_customer_id` n'est pas dans la DB
→ Solution: Vérifier que le webhook fonctionne

### Problème: "Error opening billing portal"
→ L'URL de l'API est incorrecte
→ Solution: Vérifier l'URL dans membership-status.html ligne ~315

### Problème: Les webhooks échouent
→ Le `STRIPE_WEBHOOK_SECRET` est incorrect
→ Solution: Re-copier le secret depuis Stripe Dashboard

### Problème: Double facturation
→ Le client clique sur "change plan" au lieu d'utiliser le portal
→ Solution: Enlever complètement la section "Modify Membership" et forcer l'usage du Customer Portal

---

## 🎯 RÉSUMÉ

| Fonctionnalité | Avant | Après |
|---|---|---|
| Annuler abonnement | ❌ Facturation continue | ✅ Arrêt immédiat |
| Changer carte | ❌ Impossible | ✅ Via portal |
| Changer plan | ❌ Crée un doublon | ✅ Met à jour l'existant |
| Télécharger factures | ❌ Impossible | ✅ Via portal |
| Date de renouvellement | ❌ Fausse (calculée) | ✅ Vraie (depuis Stripe) |

---

## 📝 PROCHAINES ÉTAPES OBLIGATOIRES

1. [ ] Exécuter le SQL dans Supabase
2. [ ] Activer le Customer Portal dans Stripe
3. [ ] Configurer le webhook dans Stripe
4. [ ] Créer le fichier `.env`
5. [ ] Installer les dépendances npm
6. [ ] Déployer sur Vercel
7. [ ] Mettre à jour l'URL dans membership-status.html
8. [ ] Tester avec un vrai paiement
9. [ ] Vérifier les webhooks dans Stripe Dashboard

**Durée totale estimée: 30 minutes**

Sans ces étapes, **les clients continueront à être facturés même après "annulation"!**
