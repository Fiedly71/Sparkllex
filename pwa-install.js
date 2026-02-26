/**
 * SPARKLLEX PWA INSTALL PROMPT
 * Shows install prompt every 5 visits if user hasn't installed the app
 */

(function() {
    'use strict';

    const VISIT_COUNT_KEY = 'sparkllex_visit_count';
    const INSTALLED_KEY = 'sparkllex_app_installed';
    const DISMISSED_KEY = 'sparkllex_prompt_dismissed';
    const PROMPT_INTERVAL = 5;

    let deferredPrompt = null;

    // Get current language
    function getLang() {
        return localStorage.getItem('preferredLang') || 'en';
    }

    // Translations
    const translations = {
        en: {
            title: 'Add Sparkllex to Home Screen',
            description: 'Install our app for quick access to your premium home services!',
            installBtn: 'Install App',
            dismissBtn: 'Not Now',
            iosInstructions: 'Tap <strong>Share</strong> <i class="fas fa-share-square"></i> then <strong>"Add to Home Screen"</strong>',
            androidInstructions: 'Tap the menu and select "Add to Home Screen"'
        },
        es: {
            title: 'Añadir Sparkllex a Inicio',
            description: '¡Instala nuestra app para acceder rápidamente a tus servicios premium del hogar!',
            installBtn: 'Instalar App',
            dismissBtn: 'Ahora No',
            iosInstructions: 'Toca <strong>Compartir</strong> <i class="fas fa-share-square"></i> luego <strong>"Añadir a Inicio"</strong>',
            androidInstructions: 'Toca el menú y selecciona "Añadir a pantalla de inicio"'
        }
    };

    // Check if running as standalone (already installed)
    function isStandalone() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone === true ||
               document.referrer.includes('android-app://');
    }

    // Check if iOS
    function isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    // Check if should show prompt
    function shouldShowPrompt() {
        // Already installed
        if (isStandalone()) {
            localStorage.setItem(INSTALLED_KEY, 'true');
            return false;
        }

        // User marked as installed
        if (localStorage.getItem(INSTALLED_KEY) === 'true') {
            return false;
        }

        // User dismissed permanently
        if (localStorage.getItem(DISMISSED_KEY) === 'permanent') {
            return false;
        }

        // Check visit count
        let visitCount = parseInt(localStorage.getItem(VISIT_COUNT_KEY) || '0');
        visitCount++;
        localStorage.setItem(VISIT_COUNT_KEY, visitCount.toString());

        // Show on first visit, then every 5 visits
        if (visitCount === 1) return true;
        return visitCount % PROMPT_INTERVAL === 0;
    }

    // Create and show the prompt modal
    function showInstallPrompt() {
        const lang = getLang();
        const t = translations[lang] || translations.en;
        const isIOSDevice = isIOS();

        // Create modal HTML
        const modalHTML = `
            <div id="pwa-install-modal" class="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4" style="background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);">
                <div class="bg-white rounded-3xl w-full max-w-md shadow-2xl transform transition-all animate-slideUp overflow-hidden">
                    <!-- Header with gradient -->
                    <div class="bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-center">
                        <div class="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4">
                            <img src="./images/logo.png" alt="Sparkllex" class="w-12 h-12 object-contain">
                        </div>
                        <h3 class="text-white text-xl font-black">${t.title}</h3>
                    </div>
                    
                    <!-- Content -->
                    <div class="p-6 text-center">
                        <p class="text-gray-600 mb-6">${t.description}</p>
                        
                        ${isIOSDevice ? `
                            <div class="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
                                <p class="text-blue-700 text-sm">${t.iosInstructions}</p>
                            </div>
                        ` : ''}
                        
                        <div class="flex flex-col gap-3">
                            ${!isIOSDevice ? `
                                <button id="pwa-install-btn" class="w-full py-4 bg-teal-600 text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-teal-700 transition flex items-center justify-center gap-2">
                                    <i class="fas fa-download"></i> ${t.installBtn}
                                </button>
                            ` : ''}
                            <button id="pwa-dismiss-btn" class="w-full py-3 text-gray-500 font-bold text-sm uppercase tracking-wider hover:text-gray-700 transition">
                                ${t.dismissBtn}
                            </button>
                        </div>
                    </div>
                    
                    <!-- Benefits -->
                    <div class="bg-gray-50 p-4 border-t border-gray-100">
                        <div class="flex justify-around text-center">
                            <div>
                                <i class="fas fa-bolt text-teal-600 text-lg mb-1"></i>
                                <p class="text-[10px] text-gray-500 font-bold uppercase">Fast</p>
                            </div>
                            <div>
                                <i class="fas fa-bell text-teal-600 text-lg mb-1"></i>
                                <p class="text-[10px] text-gray-500 font-bold uppercase">Notifications</p>
                            </div>
                            <div>
                                <i class="fas fa-home text-teal-600 text-lg mb-1"></i>
                                <p class="text-[10px] text-gray-500 font-bold uppercase">Easy Access</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                @keyframes slideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slideUp { animation: slideUp 0.3s ease-out; }
            </style>
        `;

        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Handle install button (for non-iOS)
        const installBtn = document.getElementById('pwa-install-btn');
        if (installBtn && deferredPrompt) {
            installBtn.addEventListener('click', async () => {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                
                if (outcome === 'accepted') {
                    localStorage.setItem(INSTALLED_KEY, 'true');
                }
                
                deferredPrompt = null;
                closeModal();
            });
        }

        // Handle dismiss button
        const dismissBtn = document.getElementById('pwa-dismiss-btn');
        if (dismissBtn) {
            dismissBtn.addEventListener('click', () => {
                closeModal();
            });
        }

        // Close on backdrop click
        const modal = document.getElementById('pwa-install-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
        }
    }

    function closeModal() {
        const modal = document.getElementById('pwa-install-modal');
        if (modal) {
            modal.style.opacity = '0';
            modal.style.transition = 'opacity 0.2s ease';
            setTimeout(() => modal.remove(), 200);
        }
    }

    // Listen for beforeinstallprompt event (Chrome, Edge)
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Check if should show prompt
        if (shouldShowPrompt()) {
            setTimeout(() => showInstallPrompt(), 2000); // Delay 2s after page load
        }
    });

    // For iOS, check on page load
    if (isIOS() && shouldShowPrompt()) {
        window.addEventListener('load', () => {
            setTimeout(() => showInstallPrompt(), 2000);
        });
    }

    // Track when app is installed
    window.addEventListener('appinstalled', () => {
        localStorage.setItem(INSTALLED_KEY, 'true');
        closeModal();
    });

    // Register service worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('SW registered:', registration.scope);
                })
                .catch((error) => {
                    console.log('SW registration failed:', error);
                });
        });
    }
})();
