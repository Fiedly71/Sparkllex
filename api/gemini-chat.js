export default async function handler(req, res) {
    // Autoriser uniquement le POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message, conversationHistory } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: "La clé API n'est pas configurée sur Vercel" });
    }

    try {
        // Préparation du corps pour l'API Google
        // On s'assure que l'historique contient au moins le message actuel
        const contents = conversationHistory && conversationHistory.length > 0 
            ? [...conversationHistory, { role: "user", parts: [{ text: message }] }]
            : [{ role: "user", parts: [{ text: message }] }];

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            return res.status(200).json({ response: data.candidates[0].content.parts[0].text });
        } else {
            console.error('Gemini Error Details:', data);
            return res.status(500).json({ error: 'Gemini a renvoyé une réponse vide ou une erreur' });
        }
    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}