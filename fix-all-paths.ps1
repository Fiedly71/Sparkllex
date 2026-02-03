# Script pour corriger tous les chemins après déplacement des fichiers vers la racine
Write-Host "🔧 Correction de tous les chemins..." -ForegroundColor Cyan

# Liste des fichiers à la racine qui doivent utiliser ./
$rootFiles = @(
    "index.html",
    "login.html",
    "signup.html",
    "pricing.html",
    "cookies.html",
    "privacy.html",
    "terms.html",
    "how-it-works.html",
    "plan-basico.html",
    "plan-pro.html",
    "plan-familiar.html",
    "success.html"
)

# Corriger les fichiers à la racine
foreach ($file in $rootFiles) {
    $path = "c:\Users\Tic Isteah\Documents\SPARKLLEX_OFFICIAL\$file"
    
    if (Test-Path $path) {
        Write-Host "  → Correction de $file" -ForegroundColor Yellow
        
        $content = Get-Content $path -Raw
        
        # Remplacer tous les chemins
        $content = $content -replace '\.\./images/', './images/'
        $content = $content -replace '\.\./translations\.js', './translations.js'
        $content = $content -replace '\.\./apply-translations\.js', './apply-translations.js'
        $content = $content -replace '\.\./database-config\.js', './database-config.js'
        $content = $content -replace 'href="\.\./index\.html"', 'href="index.html"'
        
        # Sauvegarder
        $content | Set-Content $path -NoNewline
        
        Write-Host "    ✅ $file corrigé" -ForegroundColor Green
    }
}

# Corriger les redirections dans les sous-dossiers
Write-Host "`n🔧 Correction des redirections dans les sous-dossiers..." -ForegroundColor Cyan

$subFolders = @("02_MEMBERS_APP", "03_OPERATIONS", "04_ADMIN_METRICS")

foreach ($folder in $subFolders) {
    $htmlFiles = Get-ChildItem "c:\Users\Tic Isteah\Documents\SPARKLLEX_OFFICIAL\$folder\*.html"
    
    foreach ($file in $htmlFiles) {
        Write-Host "  → Correction de $folder\$($file.Name)" -ForegroundColor Yellow
        
        $content = Get-Content $file.FullName -Raw
        
        # Remplacer ../01_MARKETING/ par ../
        $content = $content -replace '\.\./01_MARKETING/login\.html', '../login.html'
        $content = $content -replace '\.\./01_MARKETING/index\.html', '../index.html'
        $content = $content -replace '\.\./01_MARKETING/signup\.html', '../signup.html'
        $content = $content -replace '\.\./01_MARKETING/pricing\.html', '../pricing.html'
        
        # Sauvegarder
        $content | Set-Content $file.FullName -NoNewline
        
        Write-Host "    ✅ $($file.Name) corrigé" -ForegroundColor Green
    }
}

Write-Host "`n✨ Tous les chemins ont été corrigés !" -ForegroundColor Green
Write-Host "📝 Vérifiez les changements avec: git status" -ForegroundColor Cyan
