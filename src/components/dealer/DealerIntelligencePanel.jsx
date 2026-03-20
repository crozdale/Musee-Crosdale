// src/components/dealer/DealerIntelligencePanel.jsx
import React, { useState } from "react";

const DEFAULT_PROMPT = `You are Dealer Intelligence, an AI analyst for art dealers, galleries, and collectors.
You analyze inventory, pricing, and market fit for works in the Facinations vault.

For each request, respond with:
- A quick diagnosis of the dealer's situation
- 2–3 specific opportunities (pricing, positioning, curation)
- 1 suggested experiment that could be run this week
Use clear headings and short paragraphs.`;

export function DealerIntelligencePanel() {
  const [dealerContext, setDealerContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [error, setError] = useState("");

  async function runAnalysis(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAnalysis("");

    try {
      const response = await fetch("/api/claude/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 900,
          temperature: 0.4,
          system: DEFAULT_PROMPT,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text:
                    "Dealer context:\n\n" +

