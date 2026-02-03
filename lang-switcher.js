/**
 * SPARKLLEX LANGUAGE SWITCHER COMPONENT
 * Add this to the navigation of every page
 */

// Language switcher HTML for desktop navigation
const LANG_SWITCHER_DESKTOP = `
<div class="flex items-center gap-2 border border-amber-gold border-opacity-40 rounded-lg px-3 py-1.5">
    <button onclick="switchLanguage('es')" id="lang-es" class="text-amber-gold font-semibold transition hover:opacity-80">
        ES
    </button>
    <span class="text-gray-600">|</span>
    <button onclick="switchLanguage('en')" id="lang-en" class="text-gray-400 font-semibold transition hover:text-amber-gold">
        EN
    </button>
</div>
`;

// Language switcher HTML for mobile navigation
const LANG_SWITCHER_MOBILE = `
<div class="flex items-center justify-center gap-2 px-3 py-2">
    <button onclick="switchLanguage('es')" id="lang-es-mobile" class="text-amber-gold font-semibold transition hover:opacity-80">
        ES
    </button>
    <span class="text-gray-600">|</span>
    <button onclick="switchLanguage('en')" id="lang-en-mobile" class="text-gray-400 font-semibold transition hover:text-amber-gold">
        EN
    </button>
</div>
`;

// Export for use if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LANG_SWITCHER_DESKTOP, LANG_SWITCHER_MOBILE };
}
