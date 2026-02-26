/**
 * SPARKLLEX GLOBAL LANGUAGE SELECTOR
 * Dropdown with popular languages + auto-detection by country
 */

(function() {
    'use strict';

    // Available languages with flags (using emoji for simplicity)
    const LANGUAGES = {
        en: { name: 'English', flag: '🇺🇸', region: 'US' },
        es: { name: 'Español', flag: '🇨🇱', region: 'CL' },
        fr: { name: 'Français', flag: '🇫🇷', region: 'FR' },
        pt: { name: 'Português', flag: '🇧🇷', region: 'BR' },
        de: { name: 'Deutsch', flag: '🇩🇪', region: 'DE' },
        it: { name: 'Italiano', flag: '🇮🇹', region: 'IT' }
    };

    // Country to language mapping for auto-detection
    const COUNTRY_TO_LANG = {
        // English-speaking countries
        'US': 'en', 'GB': 'en', 'CA': 'en', 'AU': 'en', 'NZ': 'en', 'IE': 'en',
        // Spanish-speaking countries
        'CL': 'es', 'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es', 'PE': 'es', 
        'VE': 'es', 'EC': 'es', 'BO': 'es', 'UY': 'es', 'PY': 'es', 'CR': 'es',
        'PA': 'es', 'DO': 'es', 'GT': 'es', 'HN': 'es', 'SV': 'es', 'NI': 'es',
        // French-speaking countries
        'FR': 'fr', 'BE': 'fr', 'CH': 'fr', 'LU': 'fr', 'MC': 'fr',
        // Portuguese-speaking countries
        'BR': 'pt', 'PT': 'pt', 'AO': 'pt', 'MZ': 'pt',
        // German-speaking countries
        'DE': 'de', 'AT': 'de',
        // Italian-speaking countries
        'IT': 'it'
    };

    const STORAGE_KEY = 'sparkllex_language';
    const COUNTRY_CACHE_KEY = 'sparkllex_country';

    /**
     * Get stored language or detect from browser/country
     */
    async function getLanguage() {
        // 1. Check URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && LANGUAGES[urlLang]) {
            localStorage.setItem(STORAGE_KEY, urlLang);
            return urlLang;
        }

        // 2. Check localStorage
        const storedLang = localStorage.getItem(STORAGE_KEY);
        if (storedLang && LANGUAGES[storedLang]) {
            return storedLang;
        }

        // 3. Try to detect country
        const detectedLang = await detectLanguageByCountry();
        if (detectedLang) {
            localStorage.setItem(STORAGE_KEY, detectedLang);
            return detectedLang;
        }

        // 4. Fallback to browser language
        const browserLang = navigator.language?.split('-')[0];
        if (browserLang && LANGUAGES[browserLang]) {
            localStorage.setItem(STORAGE_KEY, browserLang);
            return browserLang;
        }

        // 5. Default to English
        return 'en';
    }

    /**
     * Detect user's country via IP geolocation API
     */
    async function detectLanguageByCountry() {
        try {
            // Check cache first
            const cachedCountry = localStorage.getItem(COUNTRY_CACHE_KEY);
            if (cachedCountry) {
                return COUNTRY_TO_LANG[cachedCountry] || null;
            }

            // Use free IP geolocation API
            const response = await fetch('https://ipapi.co/json/', { 
                timeout: 3000,
                cache: 'force-cache'
            });
            
            if (!response.ok) return null;
            
            const data = await response.json();
            const country = data.country_code;
            
            if (country) {
                localStorage.setItem(COUNTRY_CACHE_KEY, country);
                return COUNTRY_TO_LANG[country] || null;
            }
        } catch (err) {
            console.warn('Could not detect country:', err);
        }
        return null;
    }

    /**
     * Set language and apply translations
     */
    function setLanguage(lang) {
        if (!LANGUAGES[lang]) return;
        
        localStorage.setItem(STORAGE_KEY, lang);
        
        // Apply translations if function exists
        if (typeof applyTranslations === 'function') {
            applyTranslations(lang);
        }

        // Update dropdown display
        updateDropdownDisplay(lang);

        // Dispatch event for other scripts
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }

    /**
     * Update dropdown button to show current language
     */
    function updateDropdownDisplay(lang) {
        const btn = document.getElementById('lang-dropdown-btn');
        if (btn) {
            const langData = LANGUAGES[lang];
            btn.innerHTML = `
                <span class="text-base">${langData.flag}</span>
                <span class="font-bold text-xs uppercase">${lang.toUpperCase()}</span>
                <i class="fas fa-chevron-down text-[8px] opacity-60"></i>
            `;
        }

        // Update active state in dropdown
        document.querySelectorAll('.lang-option').forEach(opt => {
            if (opt.dataset.lang === lang) {
                opt.classList.add('bg-teal-50', 'text-teal-700');
                opt.classList.remove('hover:bg-gray-50');
            } else {
                opt.classList.remove('bg-teal-50', 'text-teal-700');
                opt.classList.add('hover:bg-gray-50');
            }
        });
    }

    /**
     * Create the language dropdown HTML
     */
    function createDropdown() {
        const dropdown = document.createElement('div');
        dropdown.id = 'language-dropdown';
        dropdown.className = 'relative';
        dropdown.innerHTML = `
            <button id="lang-dropdown-btn" type="button" 
                    class="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/80 backdrop-blur border border-gray-200 hover:border-teal-400 transition-all duration-300 cursor-pointer shadow-sm">
                <span class="text-base">🌐</span>
                <span class="font-bold text-xs uppercase">EN</span>
                <i class="fas fa-chevron-down text-[8px] opacity-60"></i>
            </button>
            <div id="lang-dropdown-menu" 
                 class="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[100] hidden opacity-0 transform scale-95 transition-all duration-200">
                <div class="py-2">
                    ${Object.entries(LANGUAGES).map(([code, data]) => `
                        <button class="lang-option w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition" 
                                data-lang="${code}">
                            <span class="text-lg">${data.flag}</span>
                            <span class="font-medium text-gray-700 text-sm">${data.name}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        return dropdown;
    }

    /**
     * Insert dropdown into navbar
     */
    function insertDropdown() {
        // Don't insert if already exists
        if (document.getElementById('language-dropdown')) return;

        const dropdown = createDropdown();

        // Look for specific container first
        const navContainer = document.getElementById('nav-lang-container');
        if (navContainer) {
            navContainer.appendChild(dropdown);
            setupDropdownEvents();
            return;
        }

        // Fallback: look for nav login button and insert before it
        const navContainers = [
            document.querySelector('nav .flex.items-center.space-x-3'),
            document.querySelector('nav .flex.items-center.space-x-4'),
            document.querySelector('nav')
        ];

        for (const container of navContainers) {
            if (container) {
                const loginBtn = container.querySelector('a[href*="login"]');
                if (loginBtn) {
                    loginBtn.parentNode.insertBefore(dropdown, loginBtn);
                    setupDropdownEvents();
                    return;
                }
            }
        }
    }

    /**
     * Insert mobile language selector
     */
    function insertMobileSelector() {
        const mobileContainer = document.getElementById('mobile-lang-container');
        if (!mobileContainer || mobileContainer.dataset.initialized) return;

        mobileContainer.dataset.initialized = 'true';
        mobileContainer.innerHTML = `
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Language</p>
            <div class="grid grid-cols-3 gap-2">
                ${Object.entries(LANGUAGES).map(([code, data]) => `
                    <button class="mobile-lang-btn flex items-center justify-center gap-1 py-2 rounded-xl text-sm font-bold transition bg-gray-100 hover:bg-teal-50" 
                            data-lang="${code}">
                        <span>${data.flag}</span>
                        <span class="text-[10px] uppercase">${code}</span>
                    </button>
                `).join('')}
            </div>
        `;

        // Bind click events
        mobileContainer.querySelectorAll('.mobile-lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                setLanguage(btn.dataset.lang);
                updateMobileSelector(btn.dataset.lang);
                // Close mobile menu if exists
                const menu = document.getElementById('mobile-menu');
                if (menu && menu.classList.contains('open')) {
                    menu.classList.remove('open');
                }
            });
        });

        // Set initial active state
        const currentLang = localStorage.getItem(STORAGE_KEY) || 'en';
        updateMobileSelector(currentLang);
    }

    /**
     * Update mobile selector active state
     */
    function updateMobileSelector(lang) {
        const container = document.getElementById('mobile-lang-container');
        if (!container) return;

        container.querySelectorAll('.mobile-lang-btn').forEach(btn => {
            if (btn.dataset.lang === lang) {
                btn.classList.add('bg-teal-primary', 'text-white');
                btn.classList.remove('bg-gray-100');
            } else {
                btn.classList.remove('bg-teal-primary', 'text-white');
                btn.classList.add('bg-gray-100');
            }
        });
    }

    /**
     * Setup dropdown open/close and language selection events
     */
    function setupDropdownEvents() {
        const btn = document.getElementById('lang-dropdown-btn');
        const menu = document.getElementById('lang-dropdown-menu');

        if (!btn || !menu) return;

        // Toggle dropdown
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = !menu.classList.contains('hidden');
            
            if (isOpen) {
                closeDropdown();
            } else {
                menu.classList.remove('hidden');
                setTimeout(() => {
                    menu.classList.remove('opacity-0', 'scale-95');
                    menu.classList.add('opacity-100', 'scale-100');
                }, 10);
            }
        });

        // Close on outside click
        document.addEventListener('click', closeDropdown);

        // Language selection
        menu.querySelectorAll('.lang-option').forEach(opt => {
            opt.addEventListener('click', () => {
                const lang = opt.dataset.lang;
                setLanguage(lang);
                closeDropdown();
            });
        });

        function closeDropdown() {
            menu.classList.add('opacity-0', 'scale-95');
            menu.classList.remove('opacity-100', 'scale-100');
            setTimeout(() => menu.classList.add('hidden'), 200);
        }
    }

    /**
     * Initialize language system
     */
    async function init() {
        // Insert dropdown into page
        const doInsert = () => {
            insertDropdown();
            insertMobileSelector();
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', doInsert);
        } else {
            doInsert();
        }

        // Get and apply language
        const lang = await getLanguage();
        
        // Wait for DOM and translations to be ready
        const applyLang = () => {
            if (typeof applyTranslations === 'function') {
                applyTranslations(lang);
            }
            updateDropdownDisplay(lang);
            updateMobileSelector(lang);
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', applyLang);
        } else {
            // Small delay to ensure translations.js is loaded
            setTimeout(applyLang, 100);
        }
    }

    // Export for external use
    window.SparkllexLang = {
        setLanguage,
        getLanguage: () => localStorage.getItem(STORAGE_KEY) || 'en',
        LANGUAGES
    };

    // Initialize
    init();

})();
