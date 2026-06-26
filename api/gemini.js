import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
Você é um robô amigável de um jogo educativo para crianças de 5 anos chamado TechKid.
Responda SEMPRE em português do Brasil, em frases curtas e simples (no máximo 3-4 frases),
com tom alegre e gentil. Use exemplos do dia a dia de uma criança.
Nunca fale sobre temas assustadores, violentos ou inadequados para crianças.
Se a pergunta não tiver relação com tecnologia ou não for apropriada, redirecione com
gentileza para falar sobre tecnologia.
`.trim();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  try {
    const { prompt, history } = req.body || {};

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Pergunta vazia.' });
    }
    if (prompt.length > 200) {
      return res.status(400).json({ error: 'Pergunta muito longa.' });
    }

    const contents = [];
    if (Array.isArray(history)) {
      for (const msg of history) {
        if (!msg || !msg.content) continue;
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: String(msg.content).slice(0, 500) }],
        });
      }
    }
    contents.push({ role: 'user', parts: [{ text: prompt.trim() }] });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        maxOutputTokens: 300,
        temperature: 0.7,
      },
    });

    const text = response.text
      || 'Hmm, não consegui pensar em uma resposta. Pode perguntar de outro jeito?';

    return res.status(200).json({ text });
  } catch (err) {
    console.error('Erro ao chamar Gemini:', err);
    return res.status(500).json({ error: 'Erro ao falar com o robô. Tente de novo!' });
  }
}