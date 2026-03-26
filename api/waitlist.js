// api/waitlist.js
// POST /api/waitlist — record a Studio waitlist signup.
//
// Body: { email, practice?, goal? }
// - Inserts into the waitlist table (idempotent on email)
// - Tags subscriber in Mailchimp as "waitlist"
// - Sends a confirmation email via Resend
//
// Requires: DATABASE_URL (optional — logs if absent), MAILCHIMP_*, RESEND_API_KEY

import { query } from "./lib/db.js";
import { sendEmail, tplWaitlist } from "./lib/email.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, practice, goal } = req.body ?? {};

  if (!email) {
    return res.status(400).json({ error: "email is required" });
  }

  // ── 1. Persist to DB ───────────────────────────────────────────────────────
  if (process.env.DATABASE_URL) {
    await query(
      `INSERT INTO waitlist (email, practice, goal)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING`,
      [email.toLowerCase(), practice ?? null, goal ?? null]
    ).catch((e) => console.warn("[waitlist] DB insert failed:", e.message));
  } else {
    console.log(`[waitlist] not persisted (no DATABASE_URL) — ${email}`);
  }

  // ── 2. Mailchimp tag (best-effort) ─────────────────────────────────────────
  fetch("/api/mailchimp", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ email, tags: ["waitlist"] }),
  }).catch(() => {});

  // ── 3. Confirmation email (best-effort) ────────────────────────────────────
  sendEmail({
    to:      email,
    subject: "You're on the Musée-Crosdale Studio waitlist",
    html:    tplWaitlist(),
  }).catch((e) => console.warn("[waitlist] email failed:", e.message));

  return res.status(200).json({ ok: true });
}
