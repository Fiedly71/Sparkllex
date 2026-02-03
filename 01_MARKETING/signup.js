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
                    stripeUrl = "https://buy.stripe.com/test_aFabJ1dNzeOc5lr2Fkb3q00"; 
                    break;
                case 'pro': 
                    stripeUrl = "https://buy.stripe.com/test_3cI5kD4cZ9tS6pv0xcb3q01"; 
                    break;
                case 'familiar': 
                    stripeUrl = "https://buy.stripe.com/test_9B6cN54cZ7lK9BH3Job3q02"; 
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