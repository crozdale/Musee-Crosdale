// api/mailchimp.js
// POST /api/mailchimp — upsert a subscriber to the Mailchimp audience.
//
// Body: { email, firstName?, lastName?, tags?: string[] }
//
// Requires:
//   MAILCHIMP_API_KEY  — include the datacenter suffix, e.g. abc123xyz-us21
//   MAILCHIMP_LIST_ID  — audience/list ID from Mailchimp dashboard
//
// When not configured, logs the call and returns { ok: true, configured: false }.

import crypto from "crypto";

function md5(str) {
  return crypto.createHash("md5").update(str.toLowerCase()).digest("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, firstName, lastName, tags = [] } = req.body ?? {};

  if (!email) {
    return res.status(400).json({ error: "email is required" });
  }

  const apiKey  = process.env.MAILCHIMP_API_KEY;
  const listId  = process.env.MAILCHIMP_LIST_ID;

  if (!apiKey || !listId) {
    console.log(`[mailchimp] not configured — would subscribe: ${email} tags=${tags.join(",")}`);
    return res.status(200).json({ ok: true, configured: false });
  }

  const dc   = apiKey.split("-").pop(); // e.g. "us21"
  const base = `https://${dc}.api.mailchimp.com/3.0`;
  const auth = Buffer.from(`anystring:${apiKey}`).toString("base64");
  const hash = md5(email);

  try {
    // ── Upsert member ───────────────────────────────────────────────────────
    const memberRes = await fetch(`${base}/lists/${listId}/members/${hash}`, {
      method: "PUT",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        status_if_new: "subscribed",
        status: "subscribed",
        merge_fields: {
          ...(firstName && { FNAME: firstName }),
          ...(lastName  && { LNAME: lastName  }),
        },
      }),
    });

    if (!memberRes.ok) {
      const body = await memberRes.text();
      console.error(`[mailchimp] member upsert ${memberRes.status}: ${body}`);
      return res.status(502).json({ error: "Mailchimp subscription failed" });
    }

    // ── Apply tags (best-effort) ────────────────────────────────────────────
    if (tags.length > 0) {
      await fetch(`${base}/lists/${listId}/members/${hash}/tags`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tags: tags.map((name) => ({ name, status: "active" })),
        }),
      }).catch((e) => console.warn("[mailchimp] tag apply failed:", e.message));
    }

    return res.status(200).json({ ok: true, configured: true });
  } catch (err) {
    console.error("[mailchimp] error:", err.message);
    return res.status(500).json({ error: "Mailchimp error" });
  }
}
