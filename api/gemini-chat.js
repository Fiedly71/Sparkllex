// Gemini AI Chat API - Utilise gemini-pro (modèle stable)
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

  const { message, conversationHistory } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCz1oqdPayE-5JrtNG_Rr1UfWDfavptp4I';

  if (!API_KEY) {
    return res.status(500).json({ error: 'Clé API manquante' });
  }

  if (!message) {
    return res.status(400).json({ error: 'Message requis' });
  }

  try {
    // System prompt pour Sparkllex
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

    // Utilisation de gemini-1.5-flash (modèle stable et compatible)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const { data } = await axios.post(url, {
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
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000
    });

    if (data.error) {
      console.error('Google API Error:', data.error);
      return res.status(500).json({ error: data.error.message || 'Erreur API Gemini' });
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
    } else {
      console.error('Structure de réponse inattendue:', data);
      return res.status(500).json({ error: 'Format de réponse invalide' });
    }
  } catch (error) {
    console.error('Erreur Serveur:', error.response?.data || error.message);
    return res.status(500).json({ 
      error: error.response?.data?.error?.message || error.message || 'Erreur interne de connexion' 
    });
  }
};