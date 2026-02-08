document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    
    // On initialise le téléphone pour récupérer le format international
    const phoneInput = document.querySelector("#phone-input");
    const iti = (phoneInput) ? window.intlTelInput(phoneInput, {
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js",
        initialCountry: "auto"
    }) : null;

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. COLLECTE DES DONNÉES (Le "sac à dos")
            const userData = {
                email: document.getElementById('email').value.trim(),
                password: document.getElementById('password').value,
                fullName: document.getElementById('fullName').value,
                planId: document.getElementById('plan-select').value,
                country: document.getElementById('country').value,
                city: document.getElementById('city').value,
                address: `${document.getElementById('address1').value}, ${document.getElementById('address2').value || ''}`.trim(),
                zip: document.getElementById('zip').value,
                phone: iti ? iti.getNumber() : document.getElementById('phone-input').value
            };

            // 2. SAUVEGARDE TEMPORAIRE
            // Sans cette ligne, success.html ne pourra jamais créer le compte !
            sessionStorage.setItem('pending_signup', JSON.stringify(userData));

            // 3. LOGIQUE DE REDIRECTION
            let stripeUrl = "";
            switch (userData.planId) {
                case 'basico': 
                    stripeUrl = "https://buy.stripe.com/fZu6oHdNz5dCdRX2Fkb3q06"; 
                    break;
                case 'pro': 
                    stripeUrl = "https://buy.stripe.com/8x29AT5h30Xm6pveo2b3q07"; 
                    break;
                case 'familiar': 
                    stripeUrl = "https://buy.stripe.com/cNi14nbFr35u6pv5Rwb3q08"; 
                    break;
                default:
                    alert('Please select a plan');
                    return;
            }

            // 4. DÉPART VERS STRIPE (avec pré-remplissage de l'email)
            window.location.href = `${stripeUrl}?prefilled_email=${encodeURIComponent(userData.email)}`;
        });
    }
});