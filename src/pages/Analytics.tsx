// src/pages/Analytics.tsx
// Internal analytics dashboard — theme-aware via useTheme().

import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useMeta } from "../hooks/useMeta";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { fetchAnalytics } from "../api/analyticsApi";
import type { DailyRow, VaultRow, BusinessMetrics } from "../api/analyticsApi";

const DAILY_PLACEHOLDER: DailyRow[] = [
  { date: "2026-03-25", swapCount: 14, swapVolumeXer: 310.5,  xerFeesCollected: 0.9315, activeVaultCount: 2 },
  { date: "2026-03-24", swapCount: 9,  swapVolumeXer: 198.2,  xerFeesCollected: 0.5946, activeVaultCount: 2 },
  { date: "2026-03-23", swapCount: 21, swapVolumeXer: 540.0,  xerFeesCollected: 1.62,   activeVaultCount: 2 },
  { date: "2026-03-22", swapCount: 6,  swapVolumeXer: 87.4,   xerFeesCollected: 0.2622, activeVaultCount: 2 },
  { date: "2026-03-21", swapCount: 18, swapVolumeXer: 412.7,  xerFeesCollected: 1.2381, activeVaultCount: 2 },
  { date: "2026-03-20", swapCount: 3,  swapVolumeXer: 55.0,   xerFeesCollected: 0.165,  activeVaultCount: 1 },
  { date: "2026-03-19", swapCount: 11, swapVolumeXer: 250.0,  xerFeesCollected: 0.75,   activeVaultCount: 1 },
];

const VAULT_PLACEHOLDER: VaultRow[] = [
  { vaultId: "VAULT-ALBATRIX-001",  tradeCount: 52, xerInflow: 1420.3 },
  { vaultId: "VAULT-OPEN-ARCHIVE",  tradeCount: 30, xerInflow:  433.1 },
];

const TAB_KEYS = ["tab_volume", "tab_tvl", "tab_fees"] as const;
type TabKey = typeof TAB_KEYS[number];

export default function Analytics() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  useMeta({
    title: t("analytics.title"),
    description: "Internal analytics dashboard — daily swap volume, vault TVL, and XER fee accumulation for the Facinations protocol.",
    noIndex: true,
  });

  const [tab, setTab]           = useState<TabKey>("tab_volume");
  const [daily, setDaily]       = useState<DailyRow[]>(DAILY_PLACEHOLDER);
  const [vaultTvl, setVaultTvl] = useState<VaultRow[]>(VAULT_PLACEHOLDER);
  const [business, setBusiness] = useState<BusinessMetrics|null>(null);
  const [isLive, setIsLive]     = useState(false);
  const [loading, setLoading]   = useState(true);
  const [fetchError, setFetchError] = useState<string|null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchAnalytics();
        if (cancelled) return;
        if (data.configured) {
          if (data.daily.length > 0)    setDaily(data.daily);
          if (data.vaultTvl.length > 0) setVaultTvl(data.vaultTvl);
          if (data.business)            setBusiness(data.business);
          setIsLive(true);
        }
      } catch (err: any) {
        if (!cancelled) setFetchError(err?.message ?? "Failed to load analytics");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const cumulativeFees = useMemo(() =>
    daily.slice().reverse().reduce<{ date:string; daily:number; cumulative:number }[]>(
      (acc, row) => {
        const prev = acc.length > 0 ? acc[acc.length-1].cumulative : 0;
        acc.push({ date: row.date, daily: row.xerFeesCollected, cumulative: +(prev + row.xerFeesCollected).toFixed(4) });
        return acc;
      }, []
    ).reverse(),
  [daily]);

  const totalSwaps   = daily.reduce((s,r) => s + r.swapCount, 0);
  const totalVolume  = daily.reduce((s,r) => s + r.swapVolumeXer, 0).toFixed(1);
  const totalFees    = daily.reduce((s,r) => s + r.xerFeesCollected, 0).toFixed(4);
  const activeVaults = daily[0]?.activeVaultCount ?? 0;

  // ── Theme tokens ──
  const bg        = isDark ? "#1c1c1c" : "#faf8f4";
  const fg        = isDark ? "#f2ece0" : "#1a1814";
  const fgMuted   = isDark ? "#ccc"    : "#4a4640";
  const fgSubtle  = isDark ? "#8a8278" : "#6a6258";
  const fgVeryDim = isDark ? "#333"    : "#aaa";
  const gold      = isDark ? "#d4af37" : "#b8975a";
  const cardBg    = isDark ? "#202020" : "#f0ede6";
  const cardBorder= isDark ? "rgba(212,175,55,0.2)"  : "rgba(26,24,20,0.1)";
  const borderMid = isDark ? "rgba(212,175,55,0.15)" : "rgba(26,24,20,0.1)";
  const tableRow  = isDark ? "rgba(255,255,255,0.04)": "rgba(26,24,20,0.02)";
  const codeBg    = isDark ? "rgba(80,20,200,0.07)"  : "rgba(80,20,200,0.04)";
  const codeBorder= isDark ? "rgba(100,60,220,0.2)"  : "rgba(100,60,220,0.15)";
  const tabActive  = isDark ? "#d4af37" : "#b8975a";
  const tabInactive= isDark ? "#8a8278" : "#6a6258";
  const headingColor=isDark ? "#d4af37" : "#b8975a";

  const TH: React.CSSProperties = { fontFamily:"'Cinzel',serif", fontSize:"0.65rem", letterSpacing:"0.12em", textTransform:"uppercase", color: fgSubtle, padding:"0.5rem 0.75rem", textAlign:"left", borderBottom:`1px solid ${borderMid}` };
  const TD: React.CSSProperties = { fontFamily:"'Cormorant Garamond',serif", fontSize:"0.9rem", color: fgMuted, padding:"0.5rem 0.75rem", borderBottom:`1px solid ${tableRow}` };
  const NUM: React.CSSProperties = { ...TD, color: gold, textAlign:"right" };

  return (
    <main style={{ background: bg, minHeight:"100vh", transition:"background 0.3s, color 0.3s" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Cinzel:wght@400;600&display=swap');`}</style>

      {/* Admin banner */}
      <div style={{ background: codeBg, borderBottom:`1px solid ${codeBorder}`, padding:"0.6rem 2rem", display:"flex", alignItems:"center", gap:"0.75rem" }}>
        <span style={{ color:"#9060e0", fontSize:"0.85rem", flexShrink:0 }}>🔒</span>
        <p style={{ fontSize:"0.75rem", color:"rgba(160,120,240,0.85)", margin:0 }}>
          {t("analytics.admin_banner")}
        </p>
      </div>

      <div style={{ padding:"2rem", color: fg }}>
        <header style={{ display:"flex", alignItems:"baseline", gap:"1rem", flexWrap:"wrap", marginBottom:"1.5rem" }}>
          <div>
            <h1 style={{ fontFamily:"'Cinzel',serif", fontWeight:400, letterSpacing:"0.08em", color: headingColor, margin:"0 0 0.25rem", fontSize:"1.4rem" }}>
              {t("analytics.title")}
            </h1>
            <p style={{ color: fgSubtle, fontSize:"0.85rem", margin:0, fontStyle:"italic" }}>
              {t("analytics.subtitle")}
            </p>
          </div>
          {!loading && (
            <span style={{ fontFamily:"'Cinzel',serif", fontSize:"0.52rem", letterSpacing:"0.15em", textTransform:"uppercase", padding:"0.2rem 0.6rem", border:`1px solid ${isLive?"rgba(92,184,92,0.3)":cardBorder}`, color: isLive?"#5cb85c": fgSubtle }}>
              {isLive ? "Live" : "Placeholder"}
            </span>
          )}
        </header>

        {fetchError && (
          <div style={{ marginBottom:"1.5rem", padding:"0.65rem 1rem", border:"1px solid rgba(220,80,30,0.25)", background:"rgba(220,80,30,0.04)", fontSize:"0.78rem", color:"rgba(220,120,80,0.9)" }}>
            ⚠ Could not reach analytics API — showing cached data. ({fetchError})
          </div>
        )}

        {/* Business metrics */}
        {business && (
          <div style={{ marginBottom:"2.5rem" }}>
            <p style={{ fontFamily:"'Cinzel',serif", fontSize:"0.55rem", letterSpacing:"0.25em", textTransform:"uppercase", color:`rgba(${isDark?"212,175,55":"184,151,90"},0.4)`, margin:"0 0 0.75rem" }}>
              Studio · Business
            </p>
            <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap", marginBottom:"1rem" }}>
              {[
                { label:"MRR",         value:`$${business.mrr.toLocaleString()}` },
                { label:"Active Subs", value: business.activeSubs },
                { label:"New (7d)",    value: business.newThisWeek },
                { label:"Past Due",    value: business.pastDue,  dim: business.pastDue === 0 },
                { label:"Waitlist",    value: business.waitlistCount },
              ].map(c => (
                <div key={c.label} style={{ border:`1px solid ${c.dim ? (isDark?"rgba(212,175,55,0.08)":"rgba(26,24,20,0.06)") : cardBorder}`, padding:"1rem 1.25rem", background: cardBg, minWidth:120, flex:"1 1 120px", transition:"background 0.3s" }}>
                  <p style={{ margin:"0 0 0.4rem", fontSize:"0.6rem", fontFamily:"'Cinzel',serif", letterSpacing:"0.12em", color: fgSubtle, textTransform:"uppercase" }}>{c.label}</p>
                  <p style={{ margin:0, fontSize:"1.4rem", color: c.dim ? (isDark?"#484848":"#bbb") : gold, fontFamily:"'Cormorant Garamond',serif" }}>{c.value}</p>
                </div>
              ))}
            </div>
            {business.tierBreakdown.length > 0 && (
              <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap" }}>
                {business.tierBreakdown.map(tier => (
                  <span key={tier.tier} style={{ fontFamily:"'Cinzel',serif", fontSize:"0.5rem", letterSpacing:"0.15em", textTransform:"uppercase", padding:"0.2rem 0.6rem", border:`1px solid ${cardBorder}`, color: fgSubtle }}>
                    {tier.tier} · {tier.count}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Summary cards */}
        <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap", marginBottom:"2rem" }}>
          {[
            { label: t("analytics.card_swaps"),  value: loading ? "…" : String(totalSwaps)  },
            { label: t("analytics.card_volume"), value: loading ? "…" : totalVolume },
            { label: t("analytics.card_fees"),   value: loading ? "…" : totalFees   },
            { label: t("analytics.card_vaults"), value: loading ? "…" : String(activeVaults) },
          ].map(c => (
            <div key={c.label} style={{ border:`1px solid ${cardBorder}`, padding:"1rem 1.25rem", background: cardBg, minWidth:140, flex:"1 1 140px", transition:"background 0.3s" }}>
              <p style={{ margin:"0 0 0.4rem", fontSize:"0.6rem", fontFamily:"'Cinzel',serif", letterSpacing:"0.12em", color: fgSubtle, textTransform:"uppercase" }}>{c.label}</p>
              <p style={{ margin:0, fontSize:"1.4rem", color: gold, fontFamily:"'Cormorant Garamond',serif" }}>{c.value}</p>
            </div>
          ))}
        </div>

        {/* Tab nav */}
        <div style={{ display:"flex", borderBottom:`1px solid ${borderMid}`, marginBottom:"1.25rem" }}>
          {TAB_KEYS.map(key => (
            <button key={key} onClick={() => setTab(key)} style={{ padding:"0.5rem 1rem", border:"none", borderBottom: key===tab ? `2px solid ${tabActive}` : "2px solid transparent", background:"transparent", color: key===tab ? tabActive : tabInactive, fontFamily:"'Cinzel',serif", fontSize:"0.68rem", letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer" }}>
              {t(`analytics.${key}`)}
            </button>
          ))}
        </div>

        {/* Tables */}
        {tab === "tab_volume" && (
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>
              <th style={TH}>{t("analytics.col_date")}</th>
              <th style={{ ...TH, textAlign:"right" }}>{t("analytics.col_swaps")}</th>
              <th style={{ ...TH, textAlign:"right" }}>{t("analytics.col_volume")}</th>
              <th style={{ ...TH, textAlign:"right" }}>{t("analytics.col_fees")}</th>
              <th style={{ ...TH, textAlign:"right" }}>{t("analytics.col_active_vaults")}</th>
            </tr></thead>
            <tbody>
              {daily.map(row => (
                <tr key={row.date}>
                  <td style={TD}>{row.date}</td>
                  <td style={NUM}>{row.swapCount}</td>
                  <td style={NUM}>{row.swapVolumeXer.toFixed(1)}</td>
                  <td style={NUM}>{row.xerFeesCollected.toFixed(4)}</td>
                  <td style={NUM}>{row.activeVaultCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "tab_tvl" && (
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>
              <th style={TH}>{t("analytics.col_vault_id")}</th>
              <th style={{ ...TH, textAlign:"right" }}>{t("analytics.col_trades")}</th>
              <th style={{ ...TH, textAlign:"right" }}>{t("analytics.col_inflow")}</th>
            </tr></thead>
            <tbody>
              {vaultTvl.map(row => (
                <tr key={row.vaultId}>
                  <td style={{ ...TD, fontFamily:"monospace", fontSize:"0.8rem", color: fgSubtle }}>{row.vaultId}</td>
                  <td style={NUM}>{row.tradeCount}</td>
                  <td style={NUM}>{row.xerInflow.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "tab_fees" && (
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>
              <th style={TH}>{t("analytics.col_date")}</th>
              <th style={{ ...TH, textAlign:"right" }}>{t("analytics.col_daily_fees")}</th>
              <th style={{ ...TH, textAlign:"right" }}>{t("analytics.col_cumulative")}</th>
            </tr></thead>
            <tbody>
              {cumulativeFees.map(row => (
                <tr key={row.date}>
                  <td style={TD}>{row.date}</td>
                  <td style={NUM}>{row.daily.toFixed(4)}</td>
                  <td style={{ ...NUM, color:"#5cb85c" }}>{row.cumulative.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <p style={{ marginTop:"2rem", fontSize:"0.7rem", color: fgVeryDim, fontStyle:"italic" }}>
          {isLive ? "Live data from ETL pipeline." : t("analytics.placeholder_note")}{" "}
          <Link to="/architecture" style={{ color: fgSubtle }}>{t("architecture.eyebrow")}</Link>.
        </p>
      </div>
    </main>
  );
}
