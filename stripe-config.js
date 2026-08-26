const STRIPE_CONFIG = {
    publishableKey: 'pk_live_51QgKzRIccQ4MNulwUzGnD30ZWfxOkumnWgfe4wOXkZ5nbYtXbAO9SiO9QD99RymodhycNHUd5c7G70RdLA5e54Fz00xqGNTJt4'
};

const STRIPE_PRICING_PLANS = {
    basico: { 
        priceId: 'price_1Ss6yTIccQ4MNulwrZnZFdTx', 
        url: 'https://buy.stripe.com/28EcN5cJv0Xm0175Rwb3q0a' 
    },
    pro: { 
        priceId: 'price_1Ss6zEIccQ4MNulwvkTloCjn', 
        url: 'https://buy.stripe.com/cNi7sL38V0Xm7tz93Ib3q0b' 
    },
    familiar: { 
        priceId: 'price_1Ss703IccQ4MNulwaKlBAh5R', 
        url: 'https://buy.stripe.com/8x29ATdNzcG415bdjYb3q0c' 
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