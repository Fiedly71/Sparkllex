/**
 * apply-translations.js - Bilingual Translation Engine for Sparkllex
 *
 * Addresses requirements:
 * 1) URL param > localStorage > default to 'en'
 * 2) Prevent English flash: blank text for any element whose id exists in translations
 * 3) Robust timing: run on DOM ready, window load, and observe dynamic nodes
 * 4) Keep <html lang> in sync with the active language
 */

(function () {
    const STORAGE_KEY = 'preferredLang';

    function normalizeLang(lang) {
        if (!lang) return null;
        const lower = String(lang).toLowerCase();
        return lower === 'es' ? 'es' : lower === 'en' ? 'en' : null;
    }

    function getLangFromUrl() {
        const params = new URLSearchParams(window.location.search || '');
        return normalizeLang(params.get('lang'));
    }

    function getLangFromStorage() {
        return (
            normalizeLang(localStorage.getItem(STORAGE_KEY)) ||
            // Legacy key support
            normalizeLang(localStorage.getItem('sparkllex_lang'))
        );
    }

    function resolveInitialLang() {
        return getLangFromUrl() || getLangFromStorage() || 'en';
    }

    let activeLang = resolveInitialLang();

    function getKey(el) {
        return el.getAttribute('data-translate') || el.id || null;
    }

    function getPlaceholderKey(el) {
        return el.getAttribute('data-translate-placeholder') || null;
    }

    /**
     * Blank any element that has a translation key to avoid English flash.
     */
    function blankTranslatable(root = document) {
        const langPack = translations && translations[activeLang];
        if (!langPack) return;

        const elements = root.querySelectorAll('[id], [data-translate]');
        elements.forEach(el => {
            const key = getKey(el);
            if (!key || !Object.prototype.hasOwnProperty.call(langPack, key)) return;

            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = '';
            } else if (el.tagName === 'OPTGROUP' || el.tagName === 'OPTION') {
                el.label = '';
                el.text = '';
            } else {
                el.textContent = '';
            }
        });

        // Blank placeholders that use a dedicated key
        root.querySelectorAll('[data-translate-placeholder]').forEach(el => {
            const key = getPlaceholderKey(el);
            if (key && Object.prototype.hasOwnProperty.call(langPack, key)) {
                el.placeholder = '';
            }
        });
    }

    /**
     * Apply translations to a single element if a matching key exists.
     */
    function translateElement(el) {
        const langPack = translations && translations[activeLang];
        if (!langPack) return;

        const key = getKey(el);
        if (!key || !Object.prototype.hasOwnProperty.call(langPack, key)) return;

        const value = langPack[key];
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = value;
        } else if (el.tagName === 'OPTGROUP' || el.tagName === 'OPTION') {
            el.label = value;
            el.text = value;
        } else {
            el.textContent = value;
        }
    }

    /**
     * Apply placeholder translations to inputs/textareas/selects that declare data-translate-placeholder.
     */
    function translatePlaceholder(el) {
        const langPack = translations && translations[activeLang];
        if (!langPack) return;

        const key = getPlaceholderKey(el);
        if (!key || !Object.prototype.hasOwnProperty.call(langPack, key)) return;
        el.placeholder = langPack[key];
    }

    /**
     * Apply translations to all elements under a root node.
     */
    function translateAll(root = document) {
        const elements = root.querySelectorAll('[id], [data-translate]');
        elements.forEach(translateElement);

        const placeholderElements = root.querySelectorAll('[data-translate-placeholder]');
        placeholderElements.forEach(translatePlaceholder);
    }

    /**
     * Run the full cycle: blank first, then translate, ensure <html lang> is set.
     */
    function runTranslations(root = document) {
        document.documentElement.lang = activeLang;
        blankTranslatable(root);
        translateAll(root);
    }

    /**
     * Public setter to allow manual language switches.
     */
    function setLanguage(lang) {
        const normalized = normalizeLang(lang);
        if (!normalized) return;
        activeLang = normalized;
        localStorage.setItem(STORAGE_KEY, activeLang);
        runTranslations();
    }

    /**
     * Observe dynamic additions to keep translations consistent.
     */
    function startObserver() {
        const target = document.body;
        if (!target) return;

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) return; // Only element nodes
                    if (node.id || node.getAttribute?.('data-translate')) {
                        blankTranslatable(node);
                        translateElement(node);
                    }
                    if (node.querySelectorAll) {
                        blankTranslatable(node);
                        translateAll(node);
                    }
                });
            });
        });

        observer.observe(target, { childList: true, subtree: true });
    }

    // Expose minimal API for manual toggles
    window.applyTranslations = function (lang) {
        if (lang) {
            setLanguage(lang);
        } else {
            runTranslations();
        }
    };
    window.getActiveLanguage = function () {
        return activeLang;
    };
    
    /**
     * Legacy-compatible switchLanguage for HTML onclick handlers
     */
    window.switchLanguage = function (lang) {
        setLanguage(lang);
    };

    /**
     * Add language parameter to all relative links for persistence across pages
     */
    function addLangParamToLinks() {
        const links = document.querySelectorAll('a[href]:not([href^="http"]):not([href^="/"]):not([href^="mailto"]):not([href^="tel"]):not([href^="#"])');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (!href.includes('?lang=') && !href.includes('&lang=')) {
                const separator = href.includes('?') ? '&' : '?';
                link.setAttribute('href', href + separator + 'lang=' + activeLang);
            }
        });
    }

    // Run as early as possible when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            runTranslations();
            addLangParamToLinks();
            startObserver();
        });
    } else {
        runTranslations();
        addLangParamToLinks();
        startObserver();
    }

    // Safety pass after all resources load
    window.addEventListener('load', () => {
        runTranslations();
        addLangParamToLinks();
        showLanguageSuggestion();
    });

    /**
     * Detect browser language and show suggestion banner if different from current
     */
    function showLanguageSuggestion() {
        // Don't show on admin/staff pages
        const path = window.location.pathname;
        if (path.includes('03_OPERATIONS') || path.includes('04_ADMIN_METRICS')) return;
        
        // Check if user already dismissed
        const dismissed = sessionStorage.getItem('lang_suggestion_dismissed');
        if (dismissed) return;

        // Get browser language
        const browserLang = navigator.language || navigator.userLanguage;
        const browserLangCode = browserLang.split('-')[0].toLowerCase();
        
        // Map browser language to our supported languages
        let suggestedLang = null;
        if (browserLangCode === 'es' && activeLang === 'en') {
            suggestedLang = 'es';
        } else if (browserLangCode === 'en' && activeLang === 'es') {
            suggestedLang = 'en';
        }
        
        // If no suggestion needed, exit
        if (!suggestedLang) return;

        // Create banner
        const banner = document.createElement('div');
        banner.id = 'lang-suggestion-banner';
        banner.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #008080, #004d4d);
            color: white;
            padding: 16px 24px;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 16px;
            font-family: 'Inter', sans-serif;
            max-width: 90%;
            animation: slideUp 0.4s ease-out;
        `;
        
        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideUp {
                from { transform: translateX(-50%) translateY(100px); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        const flagEmoji = suggestedLang === 'es' ? '🇪🇸' : '🇺🇸';
        const message = suggestedLang === 'es' 
            ? '¿Prefieres ver esta página en Español?' 
            : 'Would you prefer to view this page in English?';
        const btnText = suggestedLang === 'es' ? 'Sí, traducir' : 'Yes, translate';

        banner.innerHTML = `
            <span style="font-size: 24px;">${flagEmoji}</span>
            <span style="font-size: 13px; font-weight: 600;">${message}</span>
            <button id="accept-lang-btn" style="
                background: white;
                color: #008080;
                border: none;
                padding: 10px 20px;
                border-radius: 10px;
                font-weight: 800;
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                cursor: pointer;
                transition: transform 0.2s;
            ">${btnText}</button>
            <button id="dismiss-lang-btn" style="
                background: transparent;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                opacity: 0.7;
                padding: 4px;
            ">✕</button>
        `;

        document.body.appendChild(banner);

        // Event handlers
        document.getElementById('accept-lang-btn').addEventListener('click', () => {
            setLanguage(suggestedLang);
        });

        document.getElementById('dismiss-lang-btn').addEventListener('click', () => {
            sessionStorage.setItem('lang_suggestion_dismissed', 'true');
            banner.remove();
        });
    }
})();