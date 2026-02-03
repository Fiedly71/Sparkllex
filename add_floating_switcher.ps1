# PowerShell script to add floating language switcher to all HTML files

$floatingUI = @'
    <!-- Language Switcher -->
    <div class="lang-switcher" style="position:fixed; bottom:20px; right:20px; z-index:9999; display:flex; gap:10px;">
        <button onclick="setLanguage('en')" style="background:white; border:1px solid #14b8a6; color:#14b8a6; border-radius:20px; padding:8px 15px; cursor:pointer; font-weight:bold; box-shadow:0 4px 12px rgba(0,0,0,0.15);">EN</button>
        <button onclick="setLanguage('es')" style="background:white; border:1px solid #14b8a6; color:#14b8a6; border-radius:20px; padding:8px 15px; cursor:pointer; font-weight:bold; box-shadow:0 4px 12px rgba(0,0,0,0.15);">ES</button>
    </div>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const lang = currentLang || 'es';
        Object.keys(translations[lang]).forEach(function(key) {
            const el = document.getElementById(key);
            if (el) el.textContent = translations[lang][key];
        });
    });
    </script>
'@

# Get all HTML files
$htmlFiles = Get-ChildItem -Recurse -Filter "*.html" -Path "c:\Users\Tic Isteah\Documents\SPARKLLEX_OFFICIAL"

$updated = 0
$skipped = 0

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    
    if ($content -like "*lang-switcher*") {
        Write-Host ("SKIP: " + $file.Name) -ForegroundColor Yellow
        $skipped++
    } else {
        $newContent = $content -replace '</body>', ($floatingUI + "`n</body>")
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
        Write-Host ("UPDATED: " + $file.Name) -ForegroundColor Green
        $updated++
    }
}

Write-Host ("Total Updated: " + $updated) -ForegroundColor Green
Write-Host ("Total Skipped: " + $skipped) -ForegroundColor Yellow
