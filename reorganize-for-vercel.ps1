# Script de réorganisation Sparkllex pour déploiement Vercel
# Ce script déplace les ressources dans 01_MARKETING pour que Vercel trouve tout

Write-Host "🚀 Début de la réorganisation du projet Sparkllex..." -ForegroundColor Cyan
Write-Host ""

$sourceRoot = "C:\Users\Tic Isteah\Documents\SPARKLLEX_OFFICIAL"
$targetRoot = "$sourceRoot\01_MARKETING"

# Créer les dossiers de destination s'ils n'existent pas
Write-Host "📁 Création des dossiers nécessaires..." -ForegroundColor Yellow
New-Item -Path "$targetRoot\css" -ItemType Directory -Force | Out-Null

# Déplacer les dossiers
Write-Host "📦 Déplacement des dossiers..." -ForegroundColor Yellow

if (Test-Path "$sourceRoot\images") {
    Write-Host "  ➜ Déplacement: images" -ForegroundColor Green
    Move-Item -Path "$sourceRoot\images" -Destination "$targetRoot\images" -Force
}

if (Test-Path "$sourceRoot\api") {
    Write-Host "  ➜ Déplacement: api" -ForegroundColor Green
    Move-Item -Path "$sourceRoot\api" -Destination "$targetRoot\api" -Force
}

if (Test-Path "$sourceRoot\02_MEMBERS_APP") {
    Write-Host "  ➜ Déplacement: 02_MEMBERS_APP" -ForegroundColor Green
    Move-Item -Path "$sourceRoot\02_MEMBERS_APP" -Destination "$targetRoot\02_MEMBERS_APP" -Force
}

if (Test-Path "$sourceRoot\03_OPERATIONS") {
    Write-Host "  ➜ Déplacement: 03_OPERATIONS" -ForegroundColor Green
    Move-Item -Path "$sourceRoot\03_OPERATIONS" -Destination "$targetRoot\03_OPERATIONS" -Force
}

if (Test-Path "$sourceRoot\04_ADMIN_METRICS") {
    Write-Host "  ➜ Déplacement: 04_ADMIN_METRICS" -ForegroundColor Green
    Move-Item -Path "$sourceRoot\04_ADMIN_METRICS" -Destination "$targetRoot\04_ADMIN_METRICS" -Force
}

# Déplacer les fichiers essentiels
Write-Host ""
Write-Host "📄 Déplacement des fichiers..." -ForegroundColor Yellow

$filesToMove = @(
    "auth-guard.js",
    "config.js",
    "translations.js",
    "apply-translations.js",
    "styles.css",
    "database-config.js",
    "stripe-config.js",
    "export-utils.js",
    "cookie-consent.js",
    "lang-switcher.js"
)

foreach ($file in $filesToMove) {
    if (Test-Path "$sourceRoot\$file") {
        Write-Host "  ➜ Déplacement: $file" -ForegroundColor Green
        Move-Item -Path "$sourceRoot\$file" -Destination "$targetRoot\$file" -Force
    }
}

Write-Host ""
Write-Host "✅ Réorganisation terminée avec succès!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "  1. Les fichiers ont été déplacés dans 01_MARKETING" -ForegroundColor White
Write-Host "  2. Exécutez le script de correction des chemins" -ForegroundColor White
Write-Host "  3. Testez localement avant de push sur Git" -ForegroundColor White
Write-Host ""
