// src/components/DealerIntelligencePanel.jsx
import React, { useState } from "react";

export default function DealerIntelligencePanel() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Dealer Intelligence is your Synthetic Intelligence Analyst (SIA) for Fine Art Marketing. Feel free to ask about inventory mix, desk strategy, F&I attach, or marketing performance."
    }
  ]);
  const [loading, setLoading] = useState(false);

  const SYSTEM = `You are the Dealer Intelligence SIA (Synthetic Intelligence Analyst) for Musée-Crosdale / Facinations — a fine art platform that vaults and fractionalises artworks on-chain. You advise gallery owners, dealer principals, and collectors on: inventory mix strategy, acquisition and disposal desking, fractional ownership structures, XER token economics, on-chain provenance, and fine art market performance. Be concise (4 sentences max unless asked to expand), data-oriented, and professional. Where figures are unavailable, give directional guidance. Never fabricate specific auction results.`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const history = messages
      .slice(1) // skip the initial greeting
      .map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/claude/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 500,
          system: SYSTEM,
          messages: [...history, { role: "user", content: trimmed }],
        }),
      });
      const raw = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const d = JSON.parse(raw);
      const reply = d.content?.find((b: any) => b.type === "text")?.text ?? "No response.";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: "assistant", text: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="border border-zinc-800 rounded-xl bg-zinc-950/60 text-zinc-100 p-5 md:p-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg md:text-xl font-semibold tracking-tight">
            Dealer Intelligence
          </h2>
          <p className="text-xs md:text-sm text-zinc-400">
            An AI partner for GMs, GSMs, and dealer principals to interrogate
            the numbers behind the rooftop.
          </p>
        </div>
        <div className="text-[0.65rem] uppercase tracking-[0.2em] text-amber-400">
          Facinations · Salon
        </div>
      </header>

      <div className="border border-zinc-800 rounded-lg bg-black/60 flex flex-col h-72 md:h-80 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={
                m.role === "user"
                  ? "text-right"
                  : "text-left"
              }
            >
              <div
                className={
                  m.role === "user"
                    ? "inline-block rounded-lg bg-amber-500/10 border border-amber-500/40 px-3 py-2 text-amber-100"
                    : "inline-block rounded-lg bg-zinc-900/80 border border-zinc-700 px-3 py-2 text-zinc-100"
                }
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-left">
              <div className="inline-block rounded-lg bg-zinc-900/80 border border-zinc-700 px-3 py-2 text-zinc-400 text-xs">
                Thinking…
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="border-t border-zinc-800 bg-black/80 px-3 py-2 flex gap-2"
        >
          <input
            type="text"
            className="flex-1 bg-transparent text-xs md:text-sm text-zinc-100 placeholder:text-zinc-500 outline-none"
            placeholder="Ask about PVR, lead mix, aged units, or desking scenarios…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="text-[0.65rem] md:text-xs uppercase tracking-[0.2em] text-amber-300 disabled:opacity-40"
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
}
