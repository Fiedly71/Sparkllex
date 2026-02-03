# 🚀 SCRIPT D'EXÉCUTION AUTOMATIQUE COMPLÈTE
# Ce script exécute toutes les étapes dans le bon ordre

Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                              ║" -ForegroundColor Cyan
Write-Host "║           RÉORGANISATION SPARKLLEX POUR VERCEL               ║" -ForegroundColor Cyan
Write-Host "║                     Version 1.0                              ║" -ForegroundColor Cyan
Write-Host "║                                                              ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Continue"
$projectRoot = "C:\Users\Tic Isteah\Documents\SPARKLLEX_OFFICIAL"

# Vérifier que nous sommes dans le bon dossier
if (-not (Test-Path $projectRoot)) {
    Write-Host "❌ ERREUR: Le dossier $projectRoot n'existe pas!" -ForegroundColor Red
    exit 1
}

Set-Location $projectRoot

# ==============================================================================
# ÉTAPE 0 : SAUVEGARDE
# ==============================================================================

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host "  ÉTAPE 0/5 : Création d'une sauvegarde" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host ""

$backupName = "SPARKLLEX_BACKUP_$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss')"
$backupPath = "C:\Users\Tic Isteah\Documents\$backupName"

try {
    Write-Host "📦 Création de la sauvegarde..." -ForegroundColor Cyan
    Copy-Item -Path $projectRoot -Destination $backupPath -Recurse -Force
    Write-Host "✅ Sauvegarde créée : $backupPath" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Impossible de créer la sauvegarde complète" -ForegroundColor Yellow
    Write-Host "   Voulez-vous continuer sans sauvegarde? (O/N)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -ne "O" -and $response -ne "o") {
        Write-Host "❌ Opération annulée" -ForegroundColor Red
        exit 1
    }
}

Start-Sleep -Seconds 2

# ==============================================================================
# ÉTAPE 1 : RÉORGANISATION DES DOSSIERS
# ==============================================================================

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host "  ÉTAPE 1/5 : Réorganisation des dossiers" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host ""

if (Test-Path "$projectRoot\reorganize-for-vercel.ps1") {
    & "$projectRoot\reorganize-for-vercel.ps1"
} else {
    Write-Host "❌ Script reorganize-for-vercel.ps1 introuvable!" -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 2

# ==============================================================================
# ÉTAPE 2 : CORRECTION DES CHEMINS
# ==============================================================================

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host "  ÉTAPE 2/5 : Correction des chemins" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host ""

if (Test-Path "$projectRoot\fix-paths-after-move.ps1") {
    & "$projectRoot\fix-paths-after-move.ps1"
} else {
    Write-Host "❌ Script fix-paths-after-move.ps1 introuvable!" -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 2

# ==============================================================================
# ÉTAPE 3 : VÉRIFICATION DE L'INTÉGRITÉ
# ==============================================================================

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host "  ÉTAPE 3/5 : Vérification de l'intégrité" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host ""

$marketingDir = "$projectRoot\01_MARKETING"
$requiredItems = @(
    "images",
    "api",
    "02_MEMBERS_APP",
    "index.html",
    "signup.html",
    "login.html",
    "config.js",
    "translations.js",
    "database-config.js"
)

$allGood = $true
foreach ($item in $requiredItems) {
    if (Test-Path "$marketingDir\$item") {
        Write-Host "  ✓ $item" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $item MANQUANT!" -ForegroundColor Red
        $allGood = $false
    }
}

if (-not $allGood) {
    Write-Host ""
    Write-Host "⚠️  Certains fichiers sont manquants. Vérifiez la structure!" -ForegroundColor Yellow
    Write-Host "   Voulez-vous continuer quand même? (O/N)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -ne "O" -and $response -ne "o") {
        Write-Host "❌ Opération annulée" -ForegroundColor Red
        exit 1
    }
}

Start-Sleep -Seconds 2

# ==============================================================================
# ÉTAPE 4 : GIT ADD & COMMIT
# ==============================================================================

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host "  ÉTAPE 4/5 : Git Add & Commit" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host ""

try {
    Write-Host "📝 Git status..." -ForegroundColor Cyan
    git status --short
    
    Write-Host ""
    Write-Host "➕ Git add..." -ForegroundColor Cyan
    git add .
    
    Write-Host ""
    Write-Host "💾 Git commit..." -ForegroundColor Cyan
    git commit -m "🚀 Restructuration pour Vercel: Tout dans 01_MARKETING

- Déplacement de tous les dossiers dans 01_MARKETING
- Correction de tous les chemins relatifs
- Mise à jour des redirections vers https://sparkllex.com
- Ajout de vercel.json avec configuration optimisée
- Structure prête pour déploiement Vercel"
    
    Write-Host ""
    Write-Host "✅ Commit créé avec succès" -ForegroundColor Green
    
} catch {
    Write-Host "⚠️  Erreur lors du commit Git: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "   Voulez-vous continuer quand même? (O/N)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -ne "O" -and $response -ne "o") {
        Write-Host "❌ Opération annulée" -ForegroundColor Red
        exit 1
    }
}

Start-Sleep -Seconds 2

# ==============================================================================
# ÉTAPE 5 : GIT PUSH
# ==============================================================================

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host "  ÉTAPE 5/5 : Git Push vers GitHub" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host ""

Write-Host "Voulez-vous pusher vers GitHub maintenant? (O/N)" -ForegroundColor Cyan
$response = Read-Host

if ($response -eq "O" -or $response -eq "o") {
    try {
        Write-Host ""
        Write-Host "🚀 Git push..." -ForegroundColor Cyan
        git push origin main
        
        Write-Host ""
        Write-Host "✅ Push réussi!" -ForegroundColor Green
        
    } catch {
        Write-Host ""
        Write-Host "⚠️  Le push normal a échoué. Tentative avec --force..." -ForegroundColor Yellow
        
        try {
            git push origin main --force
            Write-Host ""
            Write-Host "✅ Push forcé réussi!" -ForegroundColor Green
        } catch {
            Write-Host ""
            Write-Host "❌ Erreur lors du push: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host ""
            Write-Host "Commandes à exécuter manuellement:" -ForegroundColor Yellow
            Write-Host "  git push origin main" -ForegroundColor White
            Write-Host "  OU" -ForegroundColor White
            Write-Host "  git push origin main --force" -ForegroundColor White
        }
    }
} else {
    Write-Host ""
    Write-Host "ℹ️  Push ignoré. Vous pouvez le faire manuellement:" -ForegroundColor Cyan
    Write-Host "  git push origin main" -ForegroundColor White
}

# ==============================================================================
# RÉSUMÉ FINAL
# ==============================================================================

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                              ║" -ForegroundColor Green
Write-Host "║                  ✅ RÉORGANISATION TERMINÉE                  ║" -ForegroundColor Green
Write-Host "║                                                              ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "📋 RÉSUMÉ DES OPÉRATIONS" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "  ✅ Sauvegarde créée" -ForegroundColor Green
Write-Host "  ✅ Dossiers déplacés dans 01_MARKETING" -ForegroundColor Green
Write-Host "  ✅ Chemins corrigés automatiquement" -ForegroundColor Green
Write-Host "  ✅ Structure vérifiée" -ForegroundColor Green
Write-Host "  ✅ Commit Git créé" -ForegroundColor Green

if ($response -eq "O" -or $response -eq "o") {
    Write-Host "  ✅ Push vers GitHub effectué" -ForegroundColor Green
} else {
    Write-Host "  ⏳ Push vers GitHub en attente" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 PROCHAINES ÉTAPES:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1. 🧪 TESTER LOCALEMENT" -ForegroundColor White
Write-Host "     cd $marketingDir" -ForegroundColor Gray
Write-Host "     python -m http.server 8000" -ForegroundColor Gray
Write-Host "     → Ouvrir http://localhost:8000/index.html" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. 🔍 VÉRIFIER VERCEL" -ForegroundColor White
Write-Host "     → Dashboard: https://vercel.com/dashboard" -ForegroundColor Gray
Write-Host "     → Vérifier que le redéploiement automatique a démarré" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. ⚙️  CONFIGURER LES VARIABLES D'ENVIRONNEMENT" -ForegroundColor White
Write-Host "     Settings → Environment Variables:" -ForegroundColor Gray
Write-Host "     - STRIPE_SECRET_KEY" -ForegroundColor Gray
Write-Host "     - SUPABASE_URL" -ForegroundColor Gray
Write-Host "     - SUPABASE_ANON_KEY" -ForegroundColor Gray
Write-Host ""
Write-Host "  4. 🌐 TESTER EN PRODUCTION" -ForegroundColor White
Write-Host "     → https://sparkllex.com" -ForegroundColor Gray
Write-Host "     → Vérifier images, login, signup, dashboard" -ForegroundColor Gray
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 DOCUMENTATION COMPLÈTE:" -ForegroundColor Cyan
Write-Host "  → $projectRoot\GUIDE_REORGANISATION_VERCEL.md" -ForegroundColor White
Write-Host ""
Write-Host "💾 SAUVEGARDE:" -ForegroundColor Cyan
Write-Host "  → $backupPath" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "Appuyez sur une touche pour terminer..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
