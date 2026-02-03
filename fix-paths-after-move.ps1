# Script de correction des chemins après réorganisation
# Corrige tous les chemins relatifs pour que Vercel trouve les ressources

Write-Host "🔧 Début de la correction des chemins..." -ForegroundColor Cyan
Write-Host ""

$marketingDir = "C:\Users\Tic Isteah\Documents\SPARKLLEX_OFFICIAL\01_MARKETING"

# Fonction pour remplacer les chemins dans un fichier
function Update-Paths {
    param (
        [string]$FilePath,
        [hashtable]$Replacements
    )
    
    if (Test-Path $FilePath) {
        $content = Get-Content $FilePath -Raw -Encoding UTF8
        $modified = $false
        
        foreach ($key in $Replacements.Keys) {
            if ($content -match [regex]::Escape($key)) {
                $content = $content -replace [regex]::Escape($key), $Replacements[$key]
                $modified = $true
            }
        }
        
        if ($modified) {
            Set-Content -Path $FilePath -Value $content -Encoding UTF8 -NoNewline
            Write-Host "  ✓ Mis à jour: $(Split-Path $FilePath -Leaf)" -ForegroundColor Green
            return $true
        }
    }
    return $false
}

# Corrections pour les fichiers dans 01_MARKETING (racine)
Write-Host "📝 Correction des fichiers HTML racine..." -ForegroundColor Yellow

$rootReplacements = @{
    '../images/' = './images/'
    '/images/' = './images/'
    '../translations.js' = './translations.js'
    '/translations.js' = './translations.js'
    '../apply-translations.js' = './apply-translations.js'
    '/apply-translations.js' = './apply-translations.js'
    '../config.js' = './config.js'
    '/config.js' = './config.js'
    '../database-config.js' = './database-config.js'
    '/database-config.js' = './database-config.js'
    '../stripe-config.js' = './stripe-config.js'
    '/stripe-config.js' = './stripe-config.js'
    '../styles.css' = './styles.css'
    '/styles.css' = './styles.css'
    '../auth-guard.js' = './auth-guard.js'
    '/auth-guard.js' = './auth-guard.js'
    '../export-utils.js' = './export-utils.js'
    '../cookie-consent.js' = './cookie-consent.js'
    '../lang-switcher.js' = './lang-switcher.js'
    '../02_MEMBERS_APP/' = './02_MEMBERS_APP/'
    '../03_OPERATIONS/' = './03_OPERATIONS/'
    '../04_ADMIN_METRICS/' = './04_ADMIN_METRICS/'
    '../01_MARKETING/' = './'
    'http://localhost:' = 'https://sparkllex.com'
    'localhost:5500' = 'sparkllex.com'
    'localhost:3000' = 'sparkllex.com'
}

# Parcourir tous les fichiers HTML, JS dans 01_MARKETING
Get-ChildItem -Path $marketingDir -Include *.html,*.js -Recurse -File | ForEach-Object {
    Update-Paths -FilePath $_.FullName -Replacements $rootReplacements
}

# Corrections spécifiques pour les sous-dossiers
Write-Host ""
Write-Host "📝 Correction des fichiers dans 02_MEMBERS_APP..." -ForegroundColor Yellow

$membersReplacements = @{
    '../images/' = '../images/'
    '../../images/' = '../images/'
    '../translations.js' = '../translations.js'
    '../../translations.js' = '../translations.js'
    '../database-config.js' = '../database-config.js'
    '../../database-config.js' = '../database-config.js'
    '../config.js' = '../config.js'
    '../../config.js' = '../config.js'
    '../auth-guard.js' = '../auth-guard.js'
    '../../auth-guard.js' = '../auth-guard.js'
    '../01_MARKETING/' = '../'
    '../../01_MARKETING/' = '../'
    'http://localhost:' = 'https://sparkllex.com'
    'localhost:5500' = 'sparkllex.com'
}

if (Test-Path "$marketingDir\02_MEMBERS_APP") {
    Get-ChildItem -Path "$marketingDir\02_MEMBERS_APP" -Include *.html,*.js -File | ForEach-Object {
        Update-Paths -FilePath $_.FullName -Replacements $membersReplacements
    }
}

# Corrections pour 03_OPERATIONS
Write-Host ""
Write-Host "📝 Correction des fichiers dans 03_OPERATIONS..." -ForegroundColor Yellow

if (Test-Path "$marketingDir\03_OPERATIONS") {
    Get-ChildItem -Path "$marketingDir\03_OPERATIONS" -Include *.html,*.js -File | ForEach-Object {
        Update-Paths -FilePath $_.FullName -Replacements $membersReplacements
    }
}

# Corrections pour 04_ADMIN_METRICS
Write-Host ""
Write-Host "📝 Correction des fichiers dans 04_ADMIN_METRICS..." -ForegroundColor Yellow

if (Test-Path "$marketingDir\04_ADMIN_METRICS") {
    Get-ChildItem -Path "$marketingDir\04_ADMIN_METRICS" -Include *.html,*.js -File | ForEach-Object {
        Update-Paths -FilePath $_.FullName -Replacements $membersReplacements
    }
}

Write-Host ""
Write-Host "✅ Correction des chemins terminée!" -ForegroundColor Green
Write-Host ""
Write-Host "🧪 Tests recommandés:" -ForegroundColor Cyan
Write-Host "  1. Ouvrez index.html dans le navigateur" -ForegroundColor White
Write-Host "  2. Vérifiez que les images s'affichent" -ForegroundColor White
Write-Host "  3. Testez le login/signup" -ForegroundColor White
Write-Host "  4. Vérifiez les redirections" -ForegroundColor White
Write-Host ""
