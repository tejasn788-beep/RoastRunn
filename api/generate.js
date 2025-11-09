// api/generate.js
export default async function handler(req, res) {
  const { input } = req.query;

  // Call Google Gemini (replace with your Gemini API key)
  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `Create a funny AI meme caption about: ${input}` }] }]
    }),
  });

  const data = await response.json();
  const result = data.candidates?.[0]?.content?.parts?.[0]?.text || "No result";
  res.status(200).json({ result });
}
