# SCRIPT DE COMPRESSION D'IMAGES SPARKLLEX
# Compresse automatiquement les images lourdes (>2MB) a 80% de qualite

Write-Host "`n*** COMPRESSION DES IMAGES LOURDES ***`n" -ForegroundColor Cyan

$imagesToCompress = @(
    "positive-female-housekeeper.jpg",
    "young-african-american-man-doing-laundry.jpg",
    "open-laptop-with-stationeries-office-desk-office.jpg",
    "parter.jpg",
    "cleaning-equipments-arranged-row.jpg"
)

# Verifier si ImageMagick est installe
$magickInstalled = Get-Command magick -ErrorAction SilentlyContinue

if (-not $magickInstalled) {
    Write-Host "ERREUR: ImageMagick n'est pas installe.`n" -ForegroundColor Red
    Write-Host "Installation automatique avec winget...`n" -ForegroundColor Yellow
    
    try {
        winget install --id ImageMagick.ImageMagick --silent --accept-source-agreements --accept-package-agreements
        Write-Host "`nSUCCES: ImageMagick installe ! Relancez ce script.`n" -ForegroundColor Green
        exit
    } catch {
        Write-Host "`nAvertissement: Installation automatique echouee. Installer manuellement :`n" -ForegroundColor Yellow
        Write-Host "   1. Telechargez: https://imagemagick.org/script/download.php" -ForegroundColor White
        Write-Host "   2. Ou utilisez: winget install ImageMagick.ImageMagick`n" -ForegroundColor White
        exit 1
    }
}

Write-Host "OK: ImageMagick detecte`n" -ForegroundColor Green

$totalSaved = 0

foreach ($img in $imagesToCompress) {
    $path = "images\$img"
    
    if (Test-Path $path) {
        $originalSize = (Get-Item $path).Length
        $originalSizeMB = [math]::Round($originalSize / 1MB, 2)
        
        Write-Host "Compression: $img ($originalSizeMB MB)..." -ForegroundColor Yellow
        
        # Backup original
        $backup = "$path.backup"
        if (-not (Test-Path $backup)) {
            Copy-Item $path $backup
        }
        
        # Compression avec ImageMagick (qualite 80%, max 1920px largeur)
        & magick $path -quality 80 -resize "1920x>" $path
        
        $newSize = (Get-Item $path).Length
        $newSizeMB = [math]::Round($newSize / 1MB, 2)
        $saved = $originalSize - $newSize
        $savedMB = [math]::Round($saved / 1MB, 2)
        $savedPercent = [math]::Round(($saved / $originalSize) * 100, 1)
        
        $totalSaved += $saved
        
        Write-Host "   SUCCES: $newSizeMB MB (-$savedMB MB, -$savedPercent%)`n" -ForegroundColor Green
    } else {
        Write-Host "   Avertissement: Fichier introuvable: $img`n" -ForegroundColor Yellow
    }
}

$totalSavedMB = [math]::Round($totalSaved / 1MB, 2)
Write-Host "*** COMPRESSION TERMINEE ! ***`n" -ForegroundColor Cyan
Write-Host "   Espace economise: $totalSavedMB MB`n" -ForegroundColor Green
Write-Host "   Les originaux sont sauvegardes (.backup)`n" -ForegroundColor Gray
