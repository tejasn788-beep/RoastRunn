// api/generate.js
export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // support both GET (query param) and POST (json body)
    const input = (req.method === "GET") ? req.query.input : (req.body?.input || "");
    const topic = (input || "life").toString().slice(0, 200).replace(/\n/g, " ");

    const prompt = `Create 3 short, funny Instagram captions (6-12 words) about: "${topic}". Use emojis. Keep them safe and non-offensive. Output each caption on a new line.`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing GEMINI_API_KEY env var" });

    const apiUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
      encodeURIComponent(apiKey);

    const body = { contents: [{ parts: [{ text: prompt }] }] };

    const r = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await r.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return res.status(502).json({ error: "No output from model", debug: data });

    const lines = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    return res.json({ output: lines });
  } catch (err) {
    console.error("generate error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
