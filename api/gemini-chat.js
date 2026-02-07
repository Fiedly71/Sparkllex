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
    // Utilisation de gemini-pro (plus compatible que flash dans certaines régions)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

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

    if (data.error) {
      console.error('Google API Error:', data.error);
      return res.status(500).json({ error: data.error.message });
    }

    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return res.status(200).json({ response: data.candidates[0].content.parts[0].text });
    } else {
      console.error('Structure de réponse inattendue:', data);
      return res.status(500).json({ error: 'Format de réponse invalide' });
    }
  } catch (error) {
    console.error('Erreur Serveur:', error);
    return res.status(500).json({ error: 'Erreur interne de connexion' });
  }
}