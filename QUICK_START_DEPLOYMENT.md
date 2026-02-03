# 🚀 QUICK START: Deploy Stripe Checkout Backend

**Time Required**: 5-10 minutes  
**Cost**: FREE (Vercel/Netlify)

---

## 📋 Prerequisites

- [x] Stripe account with test mode enabled
- [x] Price IDs created (already done):
  - Basic: `price_1Ss6yTIccQ4MNulwrZnZFdTx`
  - Pro: `price_1Ss6zEIccQ4MNulwvkTloCjn`
  - Family: `price_1Ss703IccQ4MNulwaKlBAh5R`

---

## 🎯 Option 1: Vercel (RECOMMENDED - Fastest)

### Step 1: Install Vercel CLI
```powershell
npm install -g vercel
```

### Step 2: Initialize Project
```powershell
cd "c:\Users\Tic Isteah\Documents\SPARKLLEX_OFFICIAL"
npm init -y
npm install stripe
```

### Step 3: Create vercel.json
Create file: `c:\Users\Tic Isteah\Documents\SPARKLLEX_OFFICIAL\vercel.json`

```json
{
  "functions": {
    "api/create-checkout-session.js": {
      "memory": 128,
      "maxDuration": 10
    }
  }
}
```

### Step 4: Deploy
```powershell
vercel login
vercel --prod
```

### Step 5: Set Environment Variable
```powershell
vercel env add STRIPE_SECRET_KEY production
```

When prompted, paste:
```
S_51SZlQ1IccQ4MNulwYh5KTF2TIoRyOWJGh6Izkz3o0sAJU3qXx2V0Z7WMGB0gkBCh1nxYEzDJPF5Lk7Pk8WZTMQdI00TgMxn7vW
```

### Step 6: Test Your Endpoint
```powershell
curl -X POST https://your-project.vercel.app/api/create-checkout-session -H "Content-Type: application/json" -d "{\"planId\":\"pro\",\"customerEmail\":\"test@example.com\",\"customerName\":\"Test User\",\"userId\":\"123\"}"
```

### Step 7: Update Frontend (Optional)
If your Vercel domain is different from where you serve the frontend, update `stripe-config.js` line 95:

```javascript
const apiEndpoint = 'https://your-project.vercel.app/api/create-checkout-session';
```

---

## 🎯 Option 2: Payment Links (NO BACKEND - 5 Minutes)

### Step 1: Create Payment Links in Stripe

1. Go to: https://dashboard.stripe.com/test/payment-links
2. Click **"+ New"**

### Step 2: Create Basic Plan Link
- **Product**: Select "Basic Plan" (or create new)
- **Price**: $79.00 USD / month (recurring)
- **Price ID**: Should match `price_1Ss6yTIccQ4MNulwrZnZFdTx`
- **Payment link URL**: Note the URL (e.g., `https://buy.stripe.com/test_abc123`)
- Click **"Create link"**

### Step 3: Repeat for Pro and Family Plans

### Step 4: Update stripe-config.js

Open: `c:\Users\Tic Isteah\Documents\SPARKLLEX_OFFICIAL\stripe-config.js`

Find lines ~127-136 and replace with your actual Payment Links:

```javascript
const paymentLinks = {
    basico: 'https://buy.stripe.com/test_YOUR_BASIC_LINK',   // Paste your Basic link
    pro: 'https://buy.stripe.com/test_YOUR_PRO_LINK',        // Paste your Pro link
    familiar: 'https://buy.stripe.com/test_YOUR_FAMILY_LINK'  // Paste your Family link
};

// UNCOMMENT these lines to activate:
if (paymentLinks[planId] && !paymentLinks[planId].includes('test_YOUR')) {
    const paymentUrl = paymentLinks[planId] + `?prefilled_email=${encodeURIComponent(customerData.email || '')}`;
    window.location.href = paymentUrl;
    return { success: true, mode: 'payment_link' };
}
```

### Step 5: Test
1. Visit: `http://localhost:5500/01_MARKETING/signup.html`
2. Fill form and select a plan
3. Click "Continuar al Pago Seguro"
4. Should redirect to Stripe Payment Link
5. Complete payment with test card: `4242 4242 4242 4242`

---

## 🎯 Option 3: Netlify Functions

### Step 1: Install Netlify CLI
```powershell
npm install -g netlify-cli
```

### Step 2: Prepare Project
```powershell
cd "c:\Users\Tic Isteah\Documents\SPARKLLEX_OFFICIAL"
npm init -y
npm install stripe
```

### Step 3: Move API File
```powershell
mkdir netlify\functions
copy api\create-checkout-session.js netlify\functions\
```

### Step 4: Create netlify.toml
Create file: `c:\Users\Tic Isteah\Documents\SPARKLLEX_OFFICIAL\netlify.toml`

```toml
[build]
  functions = "netlify/functions"

[functions]
  node_bundler = "esbuild"
```

### Step 5: Deploy
```powershell
netlify login
netlify init
netlify deploy --prod
```

### Step 6: Set Environment Variable
In Netlify Dashboard:
1. Go to Site settings → Environment variables
2. Click "Add a variable"
3. Key: `STRIPE_SECRET_KEY`
4. Value: (Secret key should be securely stored in environment variables)

### Step 7: Update Frontend
Update `stripe-config.js` line 95:

```javascript
const apiEndpoint = 'https://your-site.netlify.app/.netlify/functions/create-checkout-session';
```

---

## 🧪 Testing Checklist

### Test 1: Backend Health Check
```powershell
# Replace with your deployed URL
curl https://your-project.vercel.app/api/create-checkout-session
```

**Expected**: `{"error":"Method not allowed"}` (means endpoint is live)

### Test 2: Create Checkout Session
```powershell
curl -X POST https://your-project.vercel.app/api/create-checkout-session `
  -H "Content-Type: application/json" `
  -d '{"planId":"pro","customerEmail":"test@example.com","customerName":"Test User","userId":"123"}'
```

**Expected**:
```json
{
  "sessionId": "cs_test_a1B2c3...",
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

### Test 3: Full Signup Flow
1. Open: `http://localhost:5500/01_MARKETING/signup.html`
2. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Password: testpass123
   - Confirm Password: testpass123
   - WhatsApp: +1 555 123 4567
   - Plan: Pro - $149/mes
3. Click "Continuar al Pago Seguro"
4. **Expected**: Account created → Alert dismissed → Redirected to Stripe Checkout
5. Enter test card: `4242 4242 4242 4242`
6. Date: Any future date (e.g., 12/34)
7. CVC: Any 3 digits (e.g., 123)
8. Click "Pay"
9. **Expected**: Payment succeeds → Redirected to membership dashboard

---

## 🔐 Stripe Test Cards

| Card Number | Brand | Result |
|------------|-------|--------|
| 4242 4242 4242 4242 | Visa | Success |
| 4000 0025 0000 3155 | Visa (3DS) | Requires authentication |
| 4000 0000 0000 9995 | Visa | Declined (insufficient funds) |
| 5555 5555 5555 4444 | Mastercard | Success |

**All test cards**:
- Expiration: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

---

## 📊 Monitoring

### Stripe Dashboard
- **Payments**: https://dashboard.stripe.com/test/payments
- **Customers**: https://dashboard.stripe.com/test/customers
- **Subscriptions**: https://dashboard.stripe.com/test/subscriptions
- **Events**: https://dashboard.stripe.com/test/events

### Check Recent Checkout Sessions
```powershell
# In your terminal (requires Stripe CLI)
stripe checkout sessions list --limit 10
```

---

## ⚠️ Common Issues

### Issue: "Stripe Secret Key not found"
**Solution**: Ensure environment variable is set in Vercel/Netlify dashboard

### Issue: "Invalid Price ID"
**Check**: Verify Price IDs in Stripe Dashboard match `stripe-config.js`

### Issue: "CORS error"
**Solution**: Backend adds these headers (already included in api/create-checkout-session.js):
```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
```

### Issue: "Backend endpoint not found (404)"
**Check**: 
- Vercel: File must be in `/api` folder
- Netlify: File must be in `/netlify/functions` folder

---

## ✅ Success Indicators

You'll know it's working when:
1. ✅ Signup form creates Supabase account
2. ✅ Alert shows "Redirigiendo a Pago Seguro..."
3. ✅ Browser redirects to `https://checkout.stripe.com/...`
4. ✅ Stripe page shows correct plan ($79/$149/$249)
5. ✅ Customer email is pre-filled
6. ✅ After payment, redirects to membership dashboard
7. ✅ Stripe Dashboard shows new payment

---

## 🚀 Production Checklist (When Going Live)

- [ ] Replace test Stripe keys with live keys
- [ ] Update Price IDs to live Price IDs (start with `price_` not `price_test_`)
- [ ] Set up webhook endpoint (see `WEBHOOK_SETUP.md`)
- [ ] Test with real card (use $1 test subscription first)
- [ ] Enable Stripe email receipts
- [ ] Configure customer portal for subscription management
- [ ] Update success/cancel URLs to production domains
- [ ] Enable Stripe Radar for fraud detection
- [ ] Set up billing notifications

---

## 📞 Need Help?

**Stripe Documentation**:
- Checkout: https://stripe.com/docs/payments/checkout
- Subscriptions: https://stripe.com/docs/billing/subscriptions/overview
- Testing: https://stripe.com/docs/testing

**Vercel Documentation**:
- Serverless Functions: https://vercel.com/docs/functions

**Netlify Documentation**:
- Functions: https://docs.netlify.com/functions/overview/

---

**Current Status**: Ready to deploy - Choose Option 1 (Vercel) or Option 2 (Payment Links)

**Recommendation**: Start with Payment Links (5 min setup) to validate the flow, then move to Vercel backend for full production features.
