/**
 * Sparkllex - Cookie Consent System (Bilingual EN/ES)
 * Remembers the user's choice permanently
 */

const cookieTexts = {
    en: {
        title: '🍪 Cookies & Privacy',
        message: 'To enhance your premium experience, we use cookies. By continuing, you accept our privacy policy.',
        accept: 'Accept',
        decline: 'Decline'
    },
    es: {
        title: '🍪 Cookies y Privacidad',
        message: 'Para mejorar tu experiencia premium, usamos cookies. Al continuar, aceptas nuestra política de privacidad.',
        accept: 'Aceptar',
        decline: 'Rechazar'
    }
};

function getCookieLang() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang === 'es' || urlLang === 'en') return urlLang;
    const stored = localStorage.getItem('preferredLang');
    if (stored === 'es' || stored === 'en') return stored;
    return 'en';
}

document.addEventListener('DOMContentLoaded', () => {
    const cookieConsent = localStorage.getItem('sparkllex_cookies');

    if (!cookieConsent) {
        createCookieBanner();
    }
});

function createCookieBanner() {
    const lang = getCookieLang();
    const t = cookieTexts[lang];

    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    
    banner.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border: 1px solid #008080;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        border-radius: 15px;
        padding: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        max-width: 500px;
        margin: 0 auto;
        animation: slideUp 0.5s ease-out;
    `;

    banner.innerHTML = `
        <div style="text-align: center;">
            <h4 style="color: #008080; font-weight: bold; margin-bottom: 8px; font-family: sans-serif;">${t.title}</h4>
            <p style="color: #666; font-size: 14px; line-height: 1.4; font-family: sans-serif; margin: 0;">
                ${t.message}
            </p>
        </div>
        <div style="display: flex; gap: 10px; width: 100%;">
            <button id="accept-cookies" style="
                flex: 1;
                background: #008080;
                color: white;
                border: none;
                padding: 12px;
                border-radius: 8px;
                font-weight: bold;
                cursor: pointer;
                transition: 0.3s;
            ">${t.accept}</button>
            <button id="decline-cookies" style="
                flex: 1;
                background: transparent;
                color: #008080;
                border: 1px solid #008080;
                padding: 12px;
                border-radius: 8px;
                font-weight: bold;
                cursor: pointer;
                transition: 0.3s;
            ">${t.decline}</button>
        </div>
    `;

    // Ajouter l'animation CSS
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes slideUp {
            from { transform: translateY(100px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        #accept-cookies:hover { background: #006666 !important; transform: scale(1.02); }
        #decline-cookies:hover { background: #f0fdfa !important; }
    `;
    document.head.appendChild(style);

    // Ajouter au body
    document.body.appendChild(banner);

    // Événements des boutons
    document.getElementById('accept-cookies').addEventListener('click', () => {
        saveChoice('accepted');
    });

    document.getElementById('decline-cookies').addEventListener('click', () => {
        saveChoice('declined');
    });
}

function saveChoice(choice) {
    // Sauvegarde dans le localStorage (persiste après rafraîchissement)
    localStorage.setItem('sparkllex_cookies', choice);
    
    // Animation de sortie
    const banner = document.getElementById('cookie-banner');
    banner.style.transition = '0.5s';
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        banner.remove();
    }, 500);
}