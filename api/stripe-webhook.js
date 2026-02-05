// Stripe Webhook - Synchronise automatiquement les abonnements avec votre DB
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY // Service key, pas anon key!
);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                // Client a payé pour la première fois
                const session = event.data.object;
                const subscription = await stripe.subscriptions.retrieve(session.subscription);
                
                await supabase
                    .from('profiles')
                    .update({
                        stripe_customer_id: session.customer,
                        stripe_subscription_id: session.subscription,
                        plan: getPlanFromPriceId(subscription.items.data[0].price.id),
                        plan_status: 'active',
                        subscription_current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
                    })
                    .eq('email', session.customer_email);
                break;

            case 'customer.subscription.updated':
                // Changement de plan ou renouvellement
                const updatedSub = event.data.object;
                await supabase
                    .from('profiles')
                    .update({
                        plan: getPlanFromPriceId(updatedSub.items.data[0].price.id),
                        plan_status: updatedSub.status,
                        subscription_current_period_end: new Date(updatedSub.current_period_end * 1000).toISOString()
                    })
                    .eq('stripe_subscription_id', updatedSub.id);
                break;

            case 'customer.subscription.deleted':
                // Abonnement annulé
                const canceledSub = event.data.object;
                await supabase
                    .from('profiles')
                    .update({
                        plan_status: 'canceled',
                        subscription_current_period_end: new Date(canceledSub.current_period_end * 1000).toISOString()
                    })
                    .eq('stripe_subscription_id', canceledSub.id);
                break;

            case 'invoice.payment_failed':
                // Paiement échoué
                const failedInvoice = event.data.object;
                await supabase
                    .from('profiles')
                    .update({ plan_status: 'past_due' })
                    .eq('stripe_customer_id', failedInvoice.customer);
                break;
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Helper pour mapper price_id → plan name
function getPlanFromPriceId(priceId) {
    const priceMap = {
        'price_1Ss6yTIccQ4MNulwrZnZFdTx': 'BASIC',
        'price_1Ss6zEIccQ4MNulwvkTloCjn': 'PRO',
        'price_1Ss703IccQ4MNulwaKlBAh5R': 'FAMILY'
    };
    return priceMap[priceId] || 'BASIC';
}
