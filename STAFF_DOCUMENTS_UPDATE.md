# 📋 Staff Documents - Database Update Guide

## Problème résolu
Tous les documents uploadés depuis `staff-signup.html` sont maintenant sauvegardés et visibles dans `team-manager.html`.

---

## 🔧 Mise à jour requise dans Supabase

### Étape 1: Ajouter la colonne `file_urls` à la table `profiles`

Connectez-vous à votre dashboard Supabase et exécutez cette commande SQL :

```sql
-- Ajouter une colonne JSON pour stocker tous les URLs de documents
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS file_urls JSONB DEFAULT '{}'::jsonb;
```

### Étape 2: Vérifier les permissions du bucket Storage

Assurez-vous que le bucket `staff-docs` existe et a les bonnes permissions :

1. Allez dans **Storage** > **staff-docs**
2. Cliquez sur **Policies**
3. Assurez-vous d'avoir une policy pour :
   - **Upload**: Permettre aux utilisateurs authentifiés d'uploader
   - **Select**: Permettre aux admins de voir les fichiers

Exemple de policy pour l'upload :
```sql
CREATE POLICY "Authenticated users can upload staff docs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'staff-docs');
```

Exemple de policy pour la lecture :
```sql
CREATE POLICY "Admins can view staff docs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'staff-docs');
```

---

## 📦 Structure des documents sauvegardés

### Pour USA :
```json
{
  "id_front": "url...",
  "id_back": "url...",
  "social_front": "url...",
  "social_back": "url...",
  "address_front": "url...",
  "address_back": "url...",
  "cv": "url..."
}
```

### Pour Chile :
```json
{
  "rut_front": "url...",
  "rut_back": "url...",
  "antecedentes_front": "url...",
  "antecedentes_back": "url...",
  "afp_front": "url...",
  "afp_back": "url...",
  "fonasa_front": "url...",
  "fonasa_back": "url...",
  "cv": "url..."
}
```

---

## ✅ Vérification

1. Après avoir ajouté la colonne, testez l'inscription d'un nouveau staff membre
2. Ouvrez **team-manager.html** dans l'espace Admin
3. Cliquez sur **"View Dossier"** pour le nouveau membre
4. Tous les documents uploadés doivent maintenant être visibles et cliquables

---

## 🔄 Compatibilité

Le système garde les anciennes colonnes `id_file_url` et `permit_file_url` pour compatibilité avec les profils existants. Les nouveaux profils auront les deux formats.

---

**✨ Fait par GF Digital Studio**
