export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, conversationHistory } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'Clé API manquante' });
  }

  try {
    // Utilisation de la version v1 stable au lieu de v1beta
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          ...(conversationHistory || []), 
          { role: "user", parts: [{ text: message }] }
        ]
      })
    });

    const data = await response.json();

    // Vérification si Google a renvoyé une erreur spécifique
    if (data.error) {
      console.error('Erreur Google API:', data.error);
      return res.status(data.error.code || 500).json({ error: data.error.message });
    }

    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return res.status(200).json({ response: data.candidates[0].content.parts[0].text });
    } else {
      return res.status(500).json({ error: 'Format de réponse inconnu' });
    }
  } catch (error) {
    console.error('Crash Serveur:', error);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}