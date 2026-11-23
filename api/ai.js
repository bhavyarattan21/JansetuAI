// Vercel Serverless Function: /api/ai
// Handles secure LLM calls server-side so API keys are NEVER exposed to the client.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, text, category, location, description, urgency, lang } = req.body || {};

  // Check for server-side API keys
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY;

  if (!apiKey) {
    // Graceful signal to use client-side high-fidelity statutory template engine
    return res.status(200).json({ status: 'fallback_to_client', note: 'No API key configured; client template fallback active.' });
  }

  try {
    // If Gemini API is available
    if (process.env.GEMINI_API_KEY) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are JanSetu AI, an independent civic copilot in India. Respond in structured JSON.
Action: ${action}
Language: ${lang || 'English'}
Input: ${JSON.stringify({ text, category, location, description, urgency })}`
            }]
          }]
        })
      });

      const geminiData = await response.json();
      const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        // Strip markdown backticks if returned
        const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        return res.status(200).json(JSON.parse(cleaned));
      }
    }

    return res.status(200).json({ status: 'fallback_to_client' });
  } catch (error) {
    console.error('Server AI Error:', error);
    return res.status(200).json({ status: 'fallback_to_client', error: error.message });
  }
}
