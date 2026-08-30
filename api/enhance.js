export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, type } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const prompt =
    type === 'summary'
      ? `Rewrite the following resume professional summary to sound more polished, concise, and professional. Keep it to 2-3 sentences. Return ONLY the rewritten text, no explanations:\n\n${text}`
      : `Rewrite the following resume bullet point/description to sound more professional, using strong action verbs and highlighting impact. Keep it concise. Return ONLY the rewritten text, no explanations:\n\n${text}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: data.error?.message || 'AI request failed' });
    }

    const enhancedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!enhancedText) {
      return res.status(500).json({ error: 'No response from AI' });
    }

    return res.status(200).json({ enhancedText });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}