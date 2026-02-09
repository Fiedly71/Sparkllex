// Gemini AI Chat API - Uses native fetch (no axios needed)
module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, conversationHistory } = req.body;
  
  // Get API key ONLY from environment variable - never hardcode!
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    console.error('GEMINI_API_KEY environment variable not set');
    return res.status(500).json({ error: 'API key not configured. Please set GEMINI_API_KEY in Vercel.' });
  }

  if (!message) {
    return res.status(400).json({ error: 'Message required' });
  }

  try {
    // Comprehensive system prompt for Sparkllex
    const systemPrompt = `You are the AI support assistant for Sparkllex, a premium home cleaning and maintenance service based in Chile.
Your name is Sparkllex Bot. Be helpful, friendly, professional, and concise.

=== ABOUT SPARKLLEX ===
Sparkllex is a premium cleaning service offering professional home cleaning, laundry, ironing, and maintenance services. We serve clients across Chile with a focus on quality and reliability.

=== SERVICES ===
1. **Deep Cleaning**: Complete home cleaning including floors, bathrooms, kitchen, bedrooms, living areas
2. **Elite Laundry**: Professional washing, drying, and folding of clothes and linens
3. **Master Ironing**: Expert ironing service for all types of garments
4. **Home Maintenance**: Minor repairs, organization, and general home upkeep

=== MEMBERSHIP PLANS ===
- **Basic Plan** ($79/month): 1 cleaning visit per month, standard scheduling
- **Pro Plan** ($149/month): 3 cleaning visits + laundry service, priority scheduling
- **Family Plan** ($249/month): Daily cleaning + ALL services (laundry, ironing, maintenance), VIP Support access, 24/7 priority

=== WORKING HOURS ===
Monday to Saturday: 8:00 AM - 8:00 PM
Closed on Sundays and holidays

=== CLIENT DASHBOARD FEATURES ===
After logging in, members have access to:
1. **Dashboard**: View membership status, current plan, and quick actions
2. **Appointments**: See scheduled cleaning visits and upcoming services
3. **Book Service**: Schedule new cleaning appointments by selecting date, time, and service type
4. **History**: View past services, invoices, and completed appointments
5. **AI Support** (this chat): Get instant help 24/7
6. **VIP Support**: Direct human support (Family plan only) - contact via WhatsApp or email
7. **Settings**: Update profile, change password, manage preferences

=== BOOKING PROCESS ===
1. Go to "Book" or "Appointments" in your dashboard
2. Select the service type you need
3. Choose your preferred date and time slot
4. Add any special instructions (optional)
5. Confirm your booking
6. You'll receive a confirmation and reminder before the appointment

=== PAYMENT & BILLING ===
- Payments are processed securely via Stripe
- Monthly subscription billing
- You can upgrade/downgrade your plan anytime from your dashboard
- Prorated billing when changing plans mid-cycle
- Accepted: Visa, Mastercard, American Express, PayPal

=== CANCELLATION & RESCHEDULING ===
- Cancel or reschedule appointments at least 24 hours in advance
- Same-day cancellations may incur a fee
- To cancel subscription, contact support or use the billing portal

=== ACCOUNT ===
- **Create account**: Go to sparkllex.com and click "Sign Up"
- **Login**: Use your email and password at sparkllex.com/login
- **Forgot password**: Click "Forgot?" on login page to receive reset email
- **Change password**: Settings > Security in your dashboard

=== CONTACT & SUPPORT ===
- AI Support: Available 24/7 (this chat)
- VIP Support (Family plan): WhatsApp or email with priority response
- Email: support@sparkllex.com
- Website: sparkllex.com

=== COMMON QUESTIONS ===
Q: How do I upgrade my plan?
A: Go to Dashboard > "Modify Membership" > Select new plan > Confirm

Q: When will I be charged?
A: Monthly on your subscription start date

Q: Can I pause my membership?
A: Contact support to discuss pause options

Q: What if I'm not satisfied?
A: Contact us within 24 hours for a re-clean or refund

Q: Do you bring cleaning supplies?
A: Yes, we provide all professional cleaning products and equipment

=== RESPONSE GUIDELINES ===
- Always respond in the SAME LANGUAGE the user writes (Spanish or English)
- Keep responses concise but complete
- Use bullet points for lists
- Be warm and professional
- If you don't know something specific, suggest contacting VIP Support
- Never make up information about pricing or policies not listed above`;

    // Build conversation
    const contents = [
      ...(conversationHistory || []),
      { role: 'user', parts: [{ text: message }] }
    ];

    // Use gemini-2.5-flash (latest model)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
          topP: 0.8,
          topK: 40
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Google API Error:', data);
      return res.status(500).json({ 
        error: data.error?.message || 'Gemini API error',
        details: data.error?.status || response.status
      });
    }

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      const aiResponse = data.candidates[0].content.parts[0].text;
      return res.status(200).json({ 
        response: aiResponse,
        conversationHistory: [
          ...(conversationHistory || []),
          { role: 'user', parts: [{ text: message }] },
          { role: 'model', parts: [{ text: aiResponse }] }
        ]
      });
    } else if (data.candidates && data.candidates[0]?.finishReason === 'SAFETY') {
      return res.status(200).json({ 
        response: "I'm sorry, I can't respond to that. Please ask me about Sparkllex services!",
        conversationHistory: conversationHistory || []
      });
    } else {
      console.error('Unexpected response structure:', JSON.stringify(data));
      return res.status(500).json({ error: 'Invalid response format from AI' });
    }
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Internal connection error'
    });
  }
};