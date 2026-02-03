const STRIPE_CONFIG = {
    publishableKey: 'pk_test_51SZlQ1IccQ4MNulwcJxTi0dO18r1sGlWGc7y7Z8RZRXfCUU58PD7NXL0pYJJM8XuMb2GmNUNPy3fQf2xtaNnOzGb00u76i0tWP'
};

const STRIPE_PRICING_PLANS = {
    basico: { 
        priceId: 'price_1Ss6yTIccQ4MNulwrZnZFdTx', 
        url: 'https://buy.stripe.com/test_aFabJ1dNzeOc5lr2Fkb3q00' 
    },
    pro: { 
        priceId: 'price_1Ss6zEIccQ4MNulwvkTloCjn', 
        url: 'https://buy.stripe.com/test_3cI5kD4cZ9tS6pv0xcb3q01' 
    },
    familiar: { 
        priceId: 'price_1Ss703IccQ4MNulwaKlBAh5R', 
        url: 'https://buy.stripe.com/test_9B6cN54cZ7lK9BH3Job3q02' 
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