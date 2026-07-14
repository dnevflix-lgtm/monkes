// File: api/ask-ai.js
export default async function handler(req, res) {
  // Hanya izinkan metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  
  // MENGAMBIL KUNCI RAHASIA DARI VERCEL ENVIRONMENT VARIABLES
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'API Key tidak ditemukan di server.' });
  }

  try {
    // Backend Vercel menembak ke Groq secara rahasia
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    
    // Kembalikan jawaban Groq ke Frontend (HTML)
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Gagal terhubung ke AI.' });
  }
}