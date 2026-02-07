// Gemini AI Chat Proxy - Sécurise la clé API côté serveur
const axios = require('axios');

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

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAmcaAcoRqstLDI6LZlTPokMhiaGbjAnQ';
    
    if (!GEMINI_API_KEY) {
        console.error('GEMINI_API_KEY not configured');
        return res.status(500).json({ error: 'API key not configured' });
    }

    try {
        const { message, conversationHistory } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

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

        // Build conversation history
        const history = conversationHistory || [];
        history.push({ role: 'user', parts: [{ text: message }] });

        const { data } = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: history,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500
                }
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            
            // Add AI response to history for return
            history.push({ role: 'model', parts: [{ text: aiResponse }] });
            
            return res.status(200).json({ 
                response: aiResponse,
                conversationHistory: history
            });
        } else {
            console.error('Gemini API error:', data);
            return res.status(500).json({ error: 'No response from AI' });
        }

    } catch (error) {
        console.error('Gemini Chat Error:', error.response?.data || error.message);
        return res.status(500).json({ 
            error: error.response?.data?.error?.message || error.message || 'API Error'
        });
    }
};
