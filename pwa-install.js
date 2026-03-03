/**
 * SPARKLLEX PWA INSTALL PROMPT
 * Shows install prompt for all users with clear instructions
 */

(function() {
    'use strict';

    const INSTALLED_KEY = 'sparkllex_app_installed';
    const DISMISSED_SESSION_KEY = 'sparkllex_pwa_dismissed_session';

    let deferredPrompt = null;

    // Get current language
    function getLang() {
        return localStorage.getItem('sparkllex_language') || localStorage.getItem('preferredLang') || 'en';
    }

    // Translations with detailed iOS instructions
    const translations = {
        en: {
            title: 'Install Sparkllex App',
            description: 'Get quick access to your premium home services!',
            installBtn: 'Install App',
            dismissBtn: 'Maybe Later',
            iosTitle: 'Install on iPhone',
            iosStep1: '1. Tap the <strong>Share</strong> button <i class="fas fa-share-from-square"></i> at the bottom of Safari',
            iosStep2: '2. Scroll down and tap <strong>"Add to Home Screen"</strong> <i class="fas fa-plus-square"></i>',
            iosStep3: '3. Tap <strong>"Add"</strong> in the top right corner',
            androidInstructions: 'Tap the menu ⋮ and select "Add to Home Screen"'
        },
        es: {
            title: 'Instalar App Sparkllex',
            description: '¡Acceso rápido a tus servicios premium del hogar!',
            installBtn: 'Instalar App',
            dismissBtn: 'Quizás Después',
            iosTitle: 'Instalar en iPhone',
            iosStep1: '1. Toca el botón <strong>Compartir</strong> <i class="fas fa-share-from-square"></i> en la parte inferior de Safari',
            iosStep2: '2. Desplázate y toca <strong>"Añadir a Inicio"</strong> <i class="fas fa-plus-square"></i>',
            iosStep3: '3. Toca <strong>"Añadir"</strong> en la esquina superior derecha',
            androidInstructions: 'Toca el menú ⋮ y selecciona "Añadir a pantalla de inicio"'
        },
        fr: {
            title: 'Installer l\'App Sparkllex',
            description: 'Accès rapide à vos services premium à domicile!',
            installBtn: 'Installer l\'App',
            dismissBtn: 'Plus Tard',
            iosTitle: 'Installer sur iPhone',
            iosStep1: '1. Appuyez sur le bouton <strong>Partager</strong> <i class="fas fa-share-from-square"></i> en bas de Safari',
            iosStep2: '2. Faites défiler et appuyez sur <strong>"Sur l\'écran d\'accueil"</strong> <i class="fas fa-plus-square"></i>',
            iosStep3: '3. Appuyez sur <strong>"Ajouter"</strong> en haut à droite',
            androidInstructions: 'Appuyez sur le menu ⋮ et sélectionnez "Ajouter à l\'écran d\'accueil"'
        },
        pt: {
            title: 'Instalar App Sparkllex',
            description: 'Acesso rápido aos seus serviços premium para casa!',
            installBtn: 'Instalar App',
            dismissBtn: 'Talvez Depois',
            iosTitle: 'Instalar no iPhone',
            iosStep1: '1. Toque no botão <strong>Compartilhar</strong> <i class="fas fa-share-from-square"></i> na parte inferior do Safari',
            iosStep2: '2. Role para baixo e toque em <strong>"Adicionar à Tela de Início"</strong> <i class="fas fa-plus-square"></i>',
            iosStep3: '3. Toque em <strong>"Adicionar"</strong> no canto superior direito',
            androidInstructions: 'Toque no menu ⋮ e selecione "Adicionar à tela inicial"'
        },
        de: {
            title: 'Sparkllex App Installieren',
            description: 'Schneller Zugriff auf Ihre Premium-Haushaltsservices!',
            installBtn: 'App Installieren',
            dismissBtn: 'Vielleicht Später',
            iosTitle: 'Auf iPhone Installieren',
            iosStep1: '1. Tippen Sie auf <strong>Teilen</strong> <i class="fas fa-share-from-square"></i> unten in Safari',
            iosStep2: '2. Scrollen Sie und tippen Sie auf <strong>"Zum Home-Bildschirm"</strong> <i class="fas fa-plus-square"></i>',
            iosStep3: '3. Tippen Sie oben rechts auf <strong>"Hinzufügen"</strong>',
            androidInstructions: 'Tippen Sie auf das Menü ⋮ und wählen Sie "Zum Startbildschirm hinzufügen"'
        },
        it: {
            title: 'Installa App Sparkllex',
            description: 'Accesso rapido ai tuoi servizi premium per la casa!',
            installBtn: 'Installa App',
            dismissBtn: 'Forse Dopo',
            iosTitle: 'Installa su iPhone',
            iosStep1: '1. Tocca il pulsante <strong>Condividi</strong> <i class="fas fa-share-from-square"></i> in basso su Safari',
            iosStep2: '2. Scorri verso il basso e tocca <strong>"Aggiungi a Home"</strong> <i class="fas fa-plus-square"></i>',
            iosStep3: '3. Tocca <strong>"Aggiungi"</strong> in alto a destra',
            androidInstructions: 'Tocca il menu ⋮ e seleziona "Aggiungi a schermata Home"'
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

    // Check if should show prompt - NOW SHOWS FOR ALL USERS
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

        // Dismissed this session only (will show again on next visit)
        if (sessionStorage.getItem(DISMISSED_SESSION_KEY) === 'true') {
            return false;
        }

        // Show for everyone!
        return true;
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
                        <h3 class="text-white text-xl font-black">${isIOSDevice ? t.iosTitle : t.title}</h3>
                    </div>
                    
                    <!-- Content -->
                    <div class="p-6">
                        ${isIOSDevice ? `
                            <!-- iOS Step-by-step instructions -->
                            <div class="space-y-4 mb-6">
                                <div class="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                    <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
                                    <p class="text-blue-800 text-sm leading-relaxed">${t.iosStep1}</p>
                                </div>
                                <div class="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                    <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
                                    <p class="text-blue-800 text-sm leading-relaxed">${t.iosStep2}</p>
                                </div>
                                <div class="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                    <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
                                    <p class="text-blue-800 text-sm leading-relaxed">${t.iosStep3}</p>
                                </div>
                            </div>
                            
                            <!-- Visual indicator pointing to share button -->
                            <div class="text-center mb-4">
                                <i class="fas fa-arrow-down text-blue-500 text-2xl animate-bounce"></i>
                            </div>
                        ` : `
                            <p class="text-gray-600 text-center mb-6">${t.description}</p>
                        `}
                        
                        <div class="flex flex-col gap-3">
                            ${!isIOSDevice ? `
                                <button id="pwa-install-btn" class="w-full py-4 bg-teal-600 text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-teal-700 transition flex items-center justify-center gap-2">
                                    <i class="fas fa-download"></i> ${t.installBtn}
                                </button>
                            ` : `
                                <button id="pwa-dismiss-btn" class="w-full py-4 bg-teal-600 text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-teal-700 transition">
                                    OK, Got it!
                                </button>
                            `}
                            ${!isIOSDevice ? `
                                <button id="pwa-dismiss-btn" class="w-full py-3 text-gray-500 font-bold text-sm uppercase tracking-wider hover:text-gray-700 transition">
                                    ${t.dismissBtn}
                                </button>
                            ` : ''}
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
                // Only dismiss for this session - will show again on next visit
                sessionStorage.setItem(DISMISSED_SESSION_KEY, 'true');
                closeModal();
            });
        }

        // Close on backdrop click
        const modal = document.getElementById('pwa-install-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    sessionStorage.setItem(DISMISSED_SESSION_KEY, 'true');
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

    // Listen for beforeinstallprompt event (Chrome, Edge, Android)
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show prompt for all users
        if (shouldShowPrompt()) {
            setTimeout(() => showInstallPrompt(), 1500); // Delay 1.5s after page load
        }
    });

    // For iOS and other browsers without beforeinstallprompt, check on page load
    window.addEventListener('load', () => {
        // Wait a bit before showing
        setTimeout(() => {
            if (shouldShowPrompt() && !document.getElementById('pwa-install-modal')) {
                showInstallPrompt();
            }
        }, 2000);
    });

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
