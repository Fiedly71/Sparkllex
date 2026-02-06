const STRIPE_CONFIG = {
    publishableKey: 'pk_live_51QgKzRIccQ4MNulwUzGnD30ZWfxOkumnWgfe4wOXkZ5nbYtXbAO9SiO9QD99RymodhycNHUd5c7G70RdLA5e54Fz00xqGNTJt4'
};

const STRIPE_PRICING_PLANS = {
    basico: { 
        priceId: 'price_1Ss6yTIccQ4MNulwrZnZFdTx', 
        url: 'https://buy.stripe.com/8x2cN5cJv6hG4hnfs6b3q09' 
    },
    pro: { 
        priceId: 'price_1Ss6zEIccQ4MNulwvkTloCjn', 
        url: 'https://buy.stripe.com/8x29AT5h30Xm6pveo2b3q07' 
    },
    familiar: { 
        priceId: 'price_1Ss703IccQ4MNulwaKlBAh5R', 
        url: 'https://buy.stripe.com/cNi14nbFr35u6pv5Rwb3q08' 
    }
};

let stripe = null;

function initializeStripe() {
    try {
        if (typeof Stripe !== 'undefined') {
            stripe = Stripe(STRIPE_CONFIG.publishableKey);
            return stripe;
        }
    } catch (e) { console.error("Stripe error", e); }
    return null;
}

async function createStripeCheckout(planId, customerData) {
    const plan = STRIPE_PRICING_PLANS[planId];
    if (plan && plan.url) {
        // Redirection vers ton lien Stripe avec l'email pré-rempli
        const finalUrl = plan.url + "?prefilled_email=" + encodeURIComponent(customerData.email);
        window.location.href = finalUrl;
        return { success: true };
    } else {
        throw new Error("Plan no encontrado");
    }
}

initializeStripe();