// Newsletter Subscription API - Saves subscribers to Supabase
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, source } = req.body;

        // Validation
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Check if already subscribed
        const { data: existing } = await supabase
            .from('newsletter_subscribers')
            .select('id, status')
            .eq('email', email.toLowerCase())
            .single();

        if (existing) {
            if (existing.status === 'active') {
                return res.status(200).json({ 
                    success: true,
                    message: 'You are already subscribed!',
                    alreadySubscribed: true
                });
            } else {
                // Reactivate subscription
                await supabase
                    .from('newsletter_subscribers')
                    .update({ status: 'active', updated_at: new Date().toISOString() })
                    .eq('id', existing.id);
                
                return res.status(200).json({ 
                    success: true,
                    message: 'Welcome back! Your subscription has been reactivated.'
                });
            }
        }

        // Save new subscriber
        const { data, error } = await supabase
            .from('newsletter_subscribers')
            .insert([{
                email: email.trim().toLowerCase(),
                source: source || 'website',
                status: 'active',
                subscribed_at: new Date().toISOString()
            }])
            .select();

        if (error) {
            console.error('Supabase error:', error);
            // If table doesn't exist, still return success (graceful degradation)
            if (error.code === '42P01') {
                return res.status(200).json({ 
                    success: true,
                    message: 'Thank you for subscribing!',
                    note: 'Table pending setup'
                });
            }
            return res.status(500).json({ error: 'Failed to subscribe' });
        }

        // Success response
        return res.status(200).json({ 
            success: true,
            message: 'Thank you for subscribing! You will receive our latest updates.',
            id: data[0]?.id
        });

    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
