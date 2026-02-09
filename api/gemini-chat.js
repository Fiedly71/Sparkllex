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
    // System prompt for Sparkllex
    const systemPrompt = `You are the AI support assistant for Sparkllex, a premium home cleaning and maintenance service in Chile. 
Your name is Sparkllex Bot. Be helpful, friendly, and professional.

Key information about Sparkllex:
- Services: Deep Cleaning, Elite Laundry, Master Ironing, Home Maintenance
- Plans: Basic ($79/month - 1 visit), Pro ($149/month - 3 visits + laundry), Family ($249/month - daily cleaning + all services)
- Hours: Monday to Saturday, 8:00 AM to 8:00 PM
- Location: Chile (prices also shown in CLP for Chilean users)
- Booking: Users can book through the "Book" section in their dashboard

Always respond in the same language the user writes to you (Spanish or English).
Keep responses concise and helpful. If asked about something outside Sparkllex services, politely redirect to relevant topics.`;

    // Build conversation
    const contents = [
      ...(conversationHistory || []),
      { role: 'user', parts: [{ text: message }] }
    ];

    // Use gemini-2.0-flash (current stable model)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

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