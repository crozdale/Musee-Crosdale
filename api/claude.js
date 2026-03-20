export default async function handler(req, res) {
  const response = await fetch("https://api.anthropic.com" + req.url.replace("/api/claude", ""), {
    method: req.method,
    headers: {
      "x-api-key": process.env.VITE_ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
      "content-type": "application/json",
    },
    body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
  });

  const data = await response.json();
  res.status(response.status).json(data);
}