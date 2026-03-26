// api/gallery.js
// GET /api/gallery?slug=xdale — public endpoint, returns gallery metadata + artworks.

import { query } from "./lib/db.js";

// Fallback registry for when DB is not configured
const REGISTRY = {
  xdale: {
    slug: "xdale",
    name: "Xdale",
    blurb: "Xdale represents a curated roster of contemporary and emerging artists whose work engages with the intersection of materiality, concept, and the archive.",
    location: "London · New York · On-Chain",
    external_url: "https://xdale.io",
    enquiry_email: "enquiries@xdale.io",
    logo_url: null,
    active: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { slug } = req.query;
  if (!slug) return res.status(400).json({ error: "slug is required" });

  // Sanitise slug
  if (!/^[a-z0-9_-]{1,64}$/.test(slug)) {
    return res.status(400).json({ error: "Invalid slug" });
  }

  if (!process.env.DATABASE_URL) {
    // Fall back to in-memory registry
    const gallery = REGISTRY[slug];
    if (!gallery) return res.status(404).json({ error: "Gallery not found" });
    return res.status(200).json({ gallery, artworks: [], configured: false });
  }

  try {
    const [galleryRes, artworksRes] = await Promise.all([
      query(`SELECT * FROM galleries WHERE slug = $1 AND active = true`, [slug]),
      query(
        `SELECT * FROM artworks WHERE gallery = $1 ORDER BY sort_order, created_at`,
        [slug]
      ),
    ]);

    if (!galleryRes.rows.length) {
      // Fall back to registry for known slugs
      const fallback = REGISTRY[slug];
      if (!fallback) return res.status(404).json({ error: "Gallery not found" });
      return res.status(200).json({ gallery: fallback, artworks: artworksRes.rows, configured: true });
    }

    return res.status(200).json({
      gallery:  galleryRes.rows[0],
      artworks: artworksRes.rows,
      configured: true,
    });
  } catch (err) {
    console.error("[gallery]", err.message);
    return res.status(500).json({ error: "Database error" });
  }
}
