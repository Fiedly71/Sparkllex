export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, conversationHistory } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'Clé API manquante sur Vercel' });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [...conversationHistory, { role: "user", parts: [{ text: message }] }]
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      return res.status(200).json({ response: data.candidates[0].content.parts[0].text });
    } else {
      console.error('Réponse Gemini invalide:', data);
      return res.status(500).json({ error: 'Réponse invalide de Gemini' });
    }
  } catch (error) {
    console.error('Erreur Serveur:', error);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}