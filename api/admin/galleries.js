// api/admin/galleries.js
// CRUD for gallery profiles stored in Postgres.
// All methods require the X-Admin-Secret header.
//
// GET    /api/admin/galleries          — list all galleries
// POST   /api/admin/galleries          — create gallery
// PUT    /api/admin/galleries          — update gallery (slug in body)
// DELETE /api/admin/galleries?slug=xxx — delete gallery

import { query }        from "../lib/db.js";
import { runMigrations } from "../lib/migrate.js";

function isAuthorised(req) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return req.headers["x-admin-secret"] === secret;
}

let _migrated = false;
async function ensureMigrated() {
  if (!_migrated) { await runMigrations(); _migrated = true; }
}

export default async function handler(req, res) {
  if (!isAuthorised(req)) return res.status(401).json({ error: "Unauthorised" });
  await ensureMigrated();

  if (req.method === "GET") {
    const { rows } = await query(`SELECT * FROM galleries ORDER BY name`);
    return res.status(200).json({ galleries: rows });
  }

  if (req.method === "POST") {
    const { slug, name, blurb, location, external_url, enquiry_email, logo_url } = req.body ?? {};
    if (!slug || !name) return res.status(400).json({ error: "slug and name are required" });
    if (!/^[a-z0-9_-]{1,64}$/.test(slug)) return res.status(400).json({ error: "slug must be lowercase alphanumeric, hyphens or underscores" });

    const { rows } = await query(
      `INSERT INTO galleries (slug, name, blurb, location, external_url, enquiry_email, logo_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [slug, name, blurb ?? null, location ?? null, external_url ?? null, enquiry_email ?? null, logo_url ?? null]
    );
    return res.status(201).json({ gallery: rows[0] });
  }

  if (req.method === "PUT") {
    const { slug, ...fields } = req.body ?? {};
    if (!slug) return res.status(400).json({ error: "slug is required" });

    const allowed = ["name","blurb","location","external_url","enquiry_email","logo_url","active"];
    const updates = Object.entries(fields).filter(([k]) => allowed.includes(k));
    if (!updates.length) return res.status(400).json({ error: "No valid fields to update" });

    const setClauses = updates.map(([k], i) => `"${k}" = $${i + 2}`).join(", ");
    const values     = [slug, ...updates.map(([, v]) => v)];

    const { rows } = await query(
      `UPDATE galleries SET ${setClauses}, updated_at = NOW() WHERE slug = $1 RETURNING *`,
      values
    );
    if (!rows.length) return res.status(404).json({ error: "Gallery not found" });
    return res.status(200).json({ gallery: rows[0] });
  }

  if (req.method === "DELETE") {
    const { slug } = req.query;
    if (!slug) return res.status(400).json({ error: "slug is required" });
    const { rowCount } = await query(`DELETE FROM galleries WHERE slug = $1`, [slug]);
    if (!rowCount) return res.status(404).json({ error: "Gallery not found" });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
