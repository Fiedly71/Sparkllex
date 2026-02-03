/**
 * SPARKLLEX - Stripe Checkout Session Creator
 * 
 * BACKEND API ENDPOINT
 * This file should run on your SERVER (Node.js/Express/Vercel/Netlify Functions)
 * 
 * DEPLOYMENT OPTIONS:
 * 1. Vercel Serverless Function: Place in /api folder
 * 2. Netlify Function: Place in /netlify/functions folder
 * 3. Express.js: Use as route handler
 * 4. AWS Lambda: Deploy as Lambda function
 */

// ==========================================
// REQUIRED: Install Stripe SDK
// ==========================================
// npm install stripe
// or
// yarn add stripe

const stripe = require('stripe');

// Price IDs from your Stripe Dashboard
const PRICE_IDS = {
    basico: 'price_1Ss6yTIccQ4MNulwrZnZFdTx',   // Basic - $79/month
    pro: 'price_1Ss6zEIccQ4MNulwvkTloCjn',      // Pro - $149/month
    familiar: 'price_1Ss703IccQ4MNulwaKlBAh5R'   // Family - $249/month
};

/**
 * Create Stripe Checkout Session
 * 
 * REQUEST BODY:
 * {
 *   "planId": "basico" | "pro" | "familiar",
 *   "customerEmail": "user@example.com",
 *   "customerName": "John Doe",
 *   "userId": "uuid-from-supabase"
 * }
 * 
 * RESPONSE:
 * {
 *   "sessionId": "cs_test_...",
 *   "url": "https://checkout.stripe.com/..."
 * }
 */

// ==========================================
// FOR VERCEL/NETLIFY SERVERLESS FUNCTIONS
// ==========================================
module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle OPTIONS preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { planId, customerEmail, customerName, userId } = req.body;
        
        // Validate input
        if (!planId || !PRICE_IDS[planId]) {
            return res.status(400).json({ error: 'Invalid plan ID' });
        }
        
        if (!customerEmail) {
            return res.status(400).json({ error: 'Customer email required' });
        }
        
        console.log('Creating Stripe Checkout Session:', {
            planId,
            priceId: PRICE_IDS[planId],
            customerEmail,
            customerName
        });
        
        // Get the domain from the request
        const domain = req.headers.origin || 'http://localhost:3000';
        
        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            customer_email: customerEmail,
            client_reference_id: userId, // Link to your Supabase user
            line_items: [
                {
                    price: PRICE_IDS[planId],
                    quantity: 1,
                }
            ],
            success_url: `${domain}/02_MEMBERS_APP/membership-status.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${domain}/01_MARKETING/signup.html?canceled=true`,
            metadata: {
                userId: userId,
                customerName: customerName,
                plan: planId
            },
            subscription_data: {
                metadata: {
                    userId: userId,
                    customerName: customerName,
                    plan: planId
                }
            }
        });
        
        console.log('✓ Checkout Session created:', session.id);
        
        // Return session ID and URL
        return res.status(200).json({
            sessionId: session.id,
            url: session.url
        });
        
    } catch (error) {
        console.error('❌ Stripe Checkout Error:', error);
        return res.status(500).json({ 
            error: error.message || 'Internal server error' 
        });
    }
};

// ==========================================
// FOR EXPRESS.JS / TRADITIONAL NODE.JS
// ==========================================
/*
const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/create-checkout-session', async (req, res) => {
    // Same code as above
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
*/

// ==========================================
// ENVIRONMENT VARIABLES NEEDED:
// ==========================================
/*
STRIPE_SECRET_KEY=sk_live_...
*/

// ==========================================
// DEPLOYMENT INSTRUCTIONS:
// ==========================================
/*

OPTION 1: VERCEL (Recommended - Free)
1. Install Vercel CLI: npm i -g vercel
2. Place this file in /api/create-checkout-session.js
3. Create vercel.json:
   {
     "functions": {
       "api/create-checkout-session.js": {
         "memory": 128,
         "maxDuration": 10
       }
     }
   }
4. Deploy: vercel --prod
5. Set environment variable: vercel env add STRIPE_SECRET_KEY
6. Your endpoint: https://your-project.vercel.app/api/create-checkout-session

OPTION 2: NETLIFY
1. Place this file in /netlify/functions/create-checkout-session.js
2. Create netlify.toml:
   [build]
     functions = "netlify/functions"
3. Deploy: netlify deploy --prod
4. Set environment variable in Netlify Dashboard
5. Your endpoint: https://your-project.netlify.app/.netlify/functions/create-checkout-session

OPTION 3: AWS LAMBDA
1. Zip this file with node_modules
2. Upload to Lambda
3. Set STRIPE_SECRET_KEY environment variable
4. Create API Gateway endpoint
5. Your endpoint: https://xxxxx.execute-api.us-east-1.amazonaws.com/prod/create-checkout-session

OPTION 4: TRADITIONAL SERVER (Express.js)
1. Install: npm install express stripe cors
2. Create server.js:
   const express = require('express');
   const cors = require('cors');
   const createCheckoutSession = require('./api/create-checkout-session');
   
   const app = express();
   app.use(cors());
   app.use(express.json());
   
   app.post('/api/create-checkout-session', createCheckoutSession);
   
   app.listen(3000, () => console.log('Server running on port 3000'));
3. Run: node server.js
4. Your endpoint: http://localhost:3000/api/create-checkout-session

*/

// ==========================================
// TESTING WITH CURL:
// ==========================================
/*
curl -X POST https://your-domain.com/api/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "pro",
    "customerEmail": "test@example.com",
    "customerName": "Test User",
    "userId": "123e4567-e89b-12d3-a456-426614174000"
  }'

Expected Response:
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/c/pay/..."
}
*/

// ==========================================
// IMPORTANT: WEBHOOK HANDLER
// ==========================================
/*
You MUST also create a webhook handler to update Supabase when payment succeeds.
See webhook-handler.js for implementation.

Key events to listen for:
- checkout.session.completed: Payment successful
- customer.subscription.deleted: Subscription canceled
- invoice.payment_failed: Payment failed

When checkout.session.completed fires:
1. Get userId from session.metadata.userId
2. Update Supabase profiles table:
   - membership_status = 'active'
   - stripe_customer_id = session.customer
   - stripe_subscription_id = session.subscription
*/
