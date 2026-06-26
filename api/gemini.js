export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  try {
    const { prompt, history } = req.body;

    const contents = buildContents(prompt, history);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: 'Você é o TechKid, um robô amigável que conversa com crianças de 5 anos sobre tecnologia. Use linguagem simples, frases curtas, e seja sempre positivo e encorajador. Não use termos técnicos complicados. Máximo 3 frases por resposta.' }],
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 256,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
          ],
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: 'Gemini API error', detail: err });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return res.status(200).json({ text });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error', detail: error.message });
  }
}

function buildContents(prompt, history) {
  const contents = [];

  if (history && history.length > 0) {
    for (const msg of history) {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      });
    }
  }

  contents.push({
    role: 'user',
    parts: [{ text: prompt }],
  });

  return contents;
}