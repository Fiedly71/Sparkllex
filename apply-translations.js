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
    });
})();