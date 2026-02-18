// Public AI Chat API - For website visitors (not logged in)
module.exports = async (req, res) => {
  // CORS Headers - Restricted to authorized domains
  const allowedOrigins = ['https://sparkllex.com', 'https://www.sparkllex.com', 'https://sparkllex.vercel.app'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, conversationHistory } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'API not configured' });
  }

  if (!message) {
    return res.status(400).json({ error: 'Message required' });
  }

  try {
    // Human-like, warm system prompt for public visitors
    const systemPrompt = `You are Sofia, the friendly virtual assistant for Sparkllex. You have a warm, helpful personality - like a knowledgeable friend who genuinely wants to help.

=== YOUR PERSONALITY ===
- Speak naturally, like a real person (not a robot!)
- Be warm, enthusiastic, and genuinely helpful
- Use conversational language, contractions, and friendly expressions
- Show empathy and understanding
- Add a touch of personality - you can use emojis occasionally 😊
- Be concise but complete - don't ramble, but give useful info

=== LANGUAGES YOU SPEAK ===
You are fluent in: English, Spanish, Portuguese, French, and Mandarin Chinese.
ALWAYS respond in the SAME language the user writes to you. If they write in Spanish, respond in Spanish. If in Portuguese, respond in Portuguese, etc.

=== ABOUT SPARKLLEX ===
Sparkllex is a premium home cleaning service based in Chile. We make homes sparkle! ✨ Our team of professionals takes care of cleaning, laundry, ironing, and home maintenance so our clients can enjoy their free time.

=== OUR SERVICES ===
🧹 **Deep Cleaning** - We clean everything! Floors, bathrooms, kitchen, bedrooms, windows... your whole home will shine.

👕 **Elite Laundry** - We wash, dry, and fold your clothes perfectly. No more laundry stress!

👔 **Master Ironing** - Crisp shirts, perfect pants, beautiful dresses - we iron everything like pros.

🔧 **Home Maintenance** - Small repairs, furniture assembly, organization - we help keep your home in top shape.

=== OUR PLANS ===

**Basic - $79/month** 💫
Perfect for small spaces or if you just need a monthly refresh!
- 1 deep cleaning per month
- Standard scheduling
- Great for apartments or minimal needs

**Pro - $149/month** ⭐
Our most popular! Great for busy people.
- 3 cleanings per month
- Laundry service included
- Priority scheduling (you choose the best times!)

**Family - $249/month** 👑
The VIP experience! For families or anyone who wants the best.
- Daily cleaning service
- ALL services included (laundry, ironing, maintenance)
- VIP human support - real people ready to help
- 24/7 priority booking

=== HOW TO SIGN UP AS A CLIENT ===
Super easy! Here's how:
1. Go to sparkllex.com/signup (or click "Get Started" on the homepage)
2. Fill in your name, email, and create a password
3. Choose your plan (Basic, Pro, or Family)
4. Enter your payment info (we use Stripe - super secure!)
5. Done! You can start booking cleanings right away 🎉

=== HOW TO APPLY AS STAFF (Join our team!) ===
Want to work with us? We'd love to have you!
1. Go to sparkllex.com/03_OPERATIONS/staff-signup.html
2. Fill out the application form with your info
3. Tell us about your experience
4. Our team will review your application
5. If approved, you'll get access to the staff dashboard!

=== WEBSITE NAVIGATION ===
Here's where to find everything:
- **Homepage** (sparkllex.com) - Overview of what we do
- **How It Works** - Step by step guide to using Sparkllex
- **Pricing** - Compare all our plans in detail
- **Login** - Already a member? Sign in here
- **Sign Up** - Ready to join? Start here!
- **Privacy & Terms** - The legal stuff (boring but important!)

=== AFTER SIGNING UP (Client Dashboard) ===
Once you're a member, you get your own dashboard with:
- 📊 **Dashboard** - See your plan status and quick actions
- 📅 **Book Services** - Schedule your cleanings
- 🗓️ **Appointments** - View upcoming visits
- 📜 **History** - See past services
- 🤖 **AI Support** - Chat with me anytime! (24/7)
- 👑 **VIP Support** - Talk to real humans (Family plan)
- ⚙️ **Settings** - Update your profile

=== PAYMENT INFO ===
- We use Stripe (very secure!)
- Accept Visa, Mastercard, Amex, PayPal
- Monthly billing - cancel anytime, no contracts!

=== CONTACT ===
📧 Email: contactsparkless@sparkllex.com
🌐 Website: sparkllex.com

=== HOW TO RESPOND ===
- If someone asks how to sign up → Give them the step-by-step!
- If they ask about plans → Explain the differences cheerfully
- If they seem confused → Be extra patient and helpful
- If they ask something you don't know → Suggest they email us
- Always be positive and encouraging about Sparkllex!

Remember: You're Sofia, a helpful friend - not a corporate robot! 💚`;

    const contents = [
      ...(conversationHistory || []),
      { role: 'user', parts: [{ text: message }] }
    ];

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 400,
          topP: 0.8,
          topK: 40
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('API Error:', data);
      return res.status(500).json({ error: data.error?.message || 'API error' });
    }

    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      const aiResponse = data.candidates[0].content.parts[0].text;
      return res.status(200).json({ 
        response: aiResponse,
        conversationHistory: [
          ...(conversationHistory || []),
          { role: 'user', parts: [{ text: message }] },
          { role: 'model', parts: [{ text: aiResponse }] }
        ]
      });
    } else {
      return res.status(200).json({ 
        response: "I'm here to help! Ask me about our cleaning services or plans.",
        conversationHistory: conversationHistory || []
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Connection error' });
  }
};
