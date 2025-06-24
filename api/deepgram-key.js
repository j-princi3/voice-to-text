export default async function handler(req, res) {
  const apiKey = process.env.DEEPGRAM_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key missing' });
  }

  res.status(200).json({ key: apiKey });
}
