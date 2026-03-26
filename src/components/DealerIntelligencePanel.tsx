// src/components/DealerIntelligencePanel.tsx
import React, { useState, useRef, useEffect } from "react";

const S = {
  section: {
    border: "1px solid rgba(212,175,55,0.15)",
    background: "#080808",
    padding: "1.75rem",
  } as React.CSSProperties,
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1.25rem",
    gap: "1rem",
    flexWrap: "wrap" as const,
  } as React.CSSProperties,
  eyebrow: {
    fontFamily: "'Cinzel',serif",
    fontSize: "0.52rem",
    letterSpacing: "0.35em",
    textTransform: "uppercase" as const,
    color: "#d4af37",
    margin: "0 0 0.3rem",
  } as React.CSSProperties,
  title: {
    fontFamily: "'Cinzel',serif",
    fontSize: "1rem",
    fontWeight: 400,
    color: "#f0e8d0",
    letterSpacing: "0.06em",
    margin: "0 0 0.25rem",
  } as React.CSSProperties,
  subtitle: {
    fontFamily: "'Cormorant Garamond',serif",
    fontSize: "0.85rem",
    color: "#6a6258",
    fontStyle: "italic",
    margin: 0,
  } as React.CSSProperties,
  chatBox: {
    border: "1px solid rgba(212,175,55,0.08)",
    background: "#050505",
    display: "flex",
    flexDirection: "column" as const,
    height: "280px",
    overflow: "hidden",
  } as React.CSSProperties,
  messages: {
    flex: 1,
    overflowY: "auto" as const,
    padding: "1rem",
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.75rem",
  } as React.CSSProperties,
  bubbleUser: {
    alignSelf: "flex-end" as const,
    background: "rgba(212,175,55,0.06)",
    border: "1px solid rgba(212,175,55,0.2)",
    padding: "0.5rem 0.85rem",
    fontFamily: "'Cormorant Garamond',serif",
    fontSize: "0.9rem",
    color: "#e8e0d0",
    maxWidth: "80%",
    lineHeight: 1.6,
  } as React.CSSProperties,
  bubbleAi: {
    alignSelf: "flex-start" as const,
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(212,175,55,0.06)",
    padding: "0.5rem 0.85rem",
    fontFamily: "'Cormorant Garamond',serif",
    fontSize: "0.9rem",
    color: "#ccc4b8",
    maxWidth: "88%",
    lineHeight: 1.6,
    fontStyle: "italic",
  } as React.CSSProperties,
  thinking: {
    alignSelf: "flex-start" as const,
    fontFamily: "'Cinzel',serif",
    fontSize: "0.5rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: "rgba(212,175,55,0.3)",
    padding: "0.5rem 0",
  } as React.CSSProperties,
  form: {
    borderTop: "1px solid rgba(212,175,55,0.08)",
    background: "#030303",
    padding: "0.65rem 1rem",
    display: "flex",
    gap: "0.75rem",
    alignItems: "center",
  } as React.CSSProperties,
  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    fontFamily: "'Cormorant Garamond',serif",
    fontSize: "0.92rem",
    color: "#e8e0d0",
  } as React.CSSProperties,
  sendBtn: {
    fontFamily: "'Cinzel',serif",
    fontSize: "0.5rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: "#d4af37",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "0.25rem 0",
    opacity: 1,
  } as React.CSSProperties,
};

const SYSTEM = `You are the Dealer Intelligence SIA (Synthetic Intelligence Analyst) for Musée-Crosdale / Facinations — a fine art platform that vaults and fractionalises artworks on-chain. You advise gallery owners, dealer principals, and collectors on: inventory mix strategy, acquisition and disposal desking, fractional ownership structures, XER token economics, on-chain provenance, and fine art market performance. Be concise (4 sentences max unless asked to expand), data-oriented, and professional. Where figures are unavailable, give directional guidance. Never fabricate specific auction results.`;

export default function DealerIntelligencePanel() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Dealer Intelligence is your Synthetic Intelligence Analyst for Fine Art. Ask about inventory strategy, fractional ownership, XER economics, or market performance.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const history = messages
      .slice(1)
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
      const d = await res.json();
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const reply = d.content?.find((b: { type: string; text?: string }) => b.type === "text")?.text ?? "No response.";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err: unknown) {
      setMessages((prev) => [...prev, { role: "assistant", text: `Error: ${err instanceof Error ? err.message : "Unknown error"}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={S.section}>
      <div style={S.header}>
        <div>
          <p style={S.eyebrow}>Facinations · SIA</p>
          <h2 style={S.title}>Dealer Intelligence</h2>
          <p style={S.subtitle}>
            AI partner for gallery owners, dealer principals, and collectors.
          </p>
        </div>
      </div>

      <div style={S.chatBox}>
        <div style={S.messages}>
          {messages.map((m, idx) => (
            <div key={idx} style={m.role === "user" ? S.bubbleUser : S.bubbleAi}>
              {m.text}
            </div>
          ))}
          {loading && (
            <div style={S.thinking}>Analysing…</div>
          )}
          <div ref={endRef} />
        </div>

        <form onSubmit={handleSubmit} style={S.form}>
          <input
            style={S.input}
            placeholder="Ask about inventory strategy, XER economics, provenance…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" disabled={loading} style={{ ...S.sendBtn, opacity: loading ? 0.35 : 1 }}>
            Send
          </button>
        </form>
      </div>
    </section>
  );
}
