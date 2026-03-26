// api/galleries.js
// GET /api/galleries — public list of all active galleries.

import { query } from "./lib/db.js";

const FALLBACK = [
  {
    slug: "xdale",
    name: "Xdale",
    blurb: "Contemporary and emerging artists at the intersection of materiality and the archive.",
    location: "London · New York · On-Chain",
    logo_url: null,
  },
];

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  if (!process.env.DATABASE_URL) {
    return res.status(200).json({ galleries: FALLBACK, configured: false });
  }

  try {
    const { rows } = await query(
      `SELECT slug, name, blurb, location, logo_url FROM galleries
       WHERE active = true ORDER BY name`
    );
    return res.status(200).json({ galleries: rows.length ? rows : FALLBACK, configured: true });
  } catch (err) {
    console.error("[galleries]", err.message);
    return res.status(500).json({ error: "Database error" });
  }
}
