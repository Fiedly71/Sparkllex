export default async function handler(req, res) {
    // Configuration des headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // Récupération de la clé API
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    try {
        const { message, conversationHistory } = req.body;
        if (!message) return res.status(400).json({ error: 'Message is required' });

        const systemPrompt = `You are the AI support assistant for Sparkllex in Chile. 
        Services: Deep Cleaning, Elite Laundry, Master Ironing, Home Maintenance.
        Plans: Basic ($79), Pro ($149), Family ($249).
        Hours: Mon-Sat, 8AM-8PM. Respond in the user's language.`;

        const history = conversationHistory || [];
        history.push({ role: 'user', parts: [{ text: message }] });

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: history,
                generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            history.push({ role: 'model', parts: [{ text: aiResponse }] });
            
            return res.status(200).json({ 
                response: aiResponse, 
                conversationHistory: history 
            });
        } else {
            throw new Error(data.error?.message || 'Gemini Error');
        }

    } catch (error) {
        console.error('Gemini Error:', error.message);
        return res.status(500).json({ error: error.message });
    }
}