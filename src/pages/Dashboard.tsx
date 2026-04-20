// src/pages/Dashboard.tsx
// Wallet-gated personal dashboard — theme-aware via useTheme().

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ethers } from "ethers";
import { useQuery, gql } from "@apollo/client";
import { useKyc } from "../context/KycContext";
import { useSubscription } from "../context/SubscriptionContext";
import { useTheme } from "../context/ThemeContext";
import { useMeta } from "../hooks/useMeta";
import { VAULTS } from "../features/vaults/registry/vaultRegistry";
import AICurator from "../components/AICurator";
import SubscriptionGate from "../components/SubscriptionGate";
import CommunityPortal from "../components/community/CommunityPortal";

// ── Subgraph queries ──────────────────────────────────────────────────────────
const USER_POSITIONS_QUERY = gql`
  query UserPositions($address: String!) {
    userPositions(where:{user:$address} orderBy:updatedAt orderDirection:desc) {
      id vaultId fractionBalance entryXerAmount updatedAt
    }
  }
`;
const USER_TRADES_QUERY = gql`
  query UserTrades($address: String!) {
    trades(where:{user:$address} first:20 orderBy:timestamp orderDirection:desc) {
      id fractionId xerAmount fractionAmount timestamp
    }
  }
`;

interface Position { id:string; vaultId:string; fractionBalance:string; entryXerAmount:string; updatedAt:string; }
interface Trade    { id:string; fractionId:string; xerAmount:string; fractionAmount:string; timestamp:string; }

function useEthAddress() {
  const [address, setAddress]     = useState<string|null>(null);
  const [connecting, setConnecting] = useState(false);
  useEffect(() => {
    if (!window.ethereum) return;
    (async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum as any);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) setAddress(await accounts[0].getAddress());
      } catch {}
    })();
    (window.ethereum as any).on("accountsChanged", (accounts: string[]) => setAddress(accounts[0] ?? null));
  }, []);
  async function connect() {
    if (!window.ethereum) { alert("No wallet detected. Install MetaMask."); return; }
    setConnecting(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAddress(accounts[0] ?? null);
    } catch {}
    setConnecting(false);
  }
  return { address, connect, disconnect: () => setAddress(null), connecting };
}

function useXerBalance(address: string|null) {
  const [balance, setBalance] = useState<string|null>(null);
  useEffect(() => {
    if (!address || !window.ethereum) { setBalance(null); return; }
    let cancelled = false;
    (async () => {
      try {
        const xerAddr = import.meta.env.VITE_XER_TOKEN_ADDRESS as string|undefined;
        if (!xerAddr || xerAddr === "0x0000000000000000000000000000000000000000") { setBalance("—"); return; }
        const provider = new ethers.BrowserProvider(window.ethereum as any);
        const abi = ["function balanceOf(address) view returns (uint256)","function decimals() view returns (uint8)"];
        const token = new ethers.Contract(xerAddr, abi, provider);
        const [raw, dec] = await Promise.all([token.balanceOf(address), token.decimals()]);
        if (!cancelled) setBalance(parseFloat(ethers.formatUnits(raw, dec)).toLocaleString(undefined, { maximumFractionDigits: 4 }));
      } catch { if (!cancelled) setBalance("—"); }
    })();
    return () => { cancelled = true; };
  }, [address]);
  return balance;
}

function short(addr: string) { return `${addr.slice(0,6)}…${addr.slice(-4)}`; }
function tsToDate(ts: string) { return new Date(parseInt(ts)*1000).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" }); }
function vaultName(vaultId: string) { return VAULTS.find(v => v.vaultId===vaultId || v.contractAddress.toLowerCase()===vaultId.toLowerCase())?.name ?? vaultId; }

export default function Dashboard() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  useMeta({ title: t("dashboard.title"), description: "Your Facinations account — vault positions, XER balance, trade history, KYC and subscription status.", noIndex: true });

  const { address, connect, disconnect, connecting } = useEthAddress();
  const xerBalance = useXerBalance(address);
  const { status: kycStatus } = useKyc();
  const { tier, activePlan }  = useSubscription();
  const lowerAddr = address?.toLowerCase() ?? "";

  const { data: posData,   loading: posLoading,   error: posError   } = useQuery<{ userPositions: Position[] }>(USER_POSITIONS_QUERY,  { variables: { address: lowerAddr }, skip: !address, errorPolicy: "all" });
  const { data: tradeData, loading: tradeLoading, error: tradeError } = useQuery<{ trades: Trade[] }>(USER_TRADES_QUERY, { variables: { address: lowerAddr }, skip: !address, errorPolicy: "all" });

  const positions = posData?.userPositions ?? [];
  const trades    = tradeData?.trades ?? [];
  const totalEntryXer = positions.reduce((s,p) => s + parseFloat(p.entryXerAmount||"0"), 0);
  const totalFees     = trades.reduce((s,t)   => s + parseFloat(t.xerAmount||"0") * 0.003, 0);
  const subgraphUnavailable = !!(posError || tradeError);

  // ── Theme tokens ──
  const bg        = isDark ? "#1c1c1c" : "#faf8f4";
  const fg        = isDark ? "#f2ece0" : "#1a1814";
  const fgMuted   = isDark ? "#ccc"    : "#4a4640";
  const fgSubtle  = isDark ? "#8a8278" : "#6a6258";
  const gold      = isDark ? "#d4af37" : "#b8975a";
  const cardBg    = isDark ? "#202020" : "#f0ede6";
  const cardBorder= isDark ? "rgba(212,175,55,0.15)" : "rgba(26,24,20,0.1)";
  const borderFaint=isDark ? "rgba(212,175,55,0.08)" : "rgba(26,24,20,0.06)";
  const borderMid = isDark ? "rgba(212,175,55,0.1)"  : "rgba(26,24,20,0.1)";
  const tableRow  = isDark ? "rgba(255,255,255,0.03)": "rgba(26,24,20,0.02)";
  const emptyBorder=isDark ? "rgba(212,175,55,0.06)" : "rgba(26,24,20,0.06)";
  const headingColor=isDark ? "#f8f2e4" : "#1a1814";

  const kycBadge = {
    idle:     { color: isDark ? "#6a6258"  : "#888",    borderColor: isDark ? "#222"                   : "rgba(0,0,0,0.1)",      label: t("dashboard.kyc_not_started") },
    pending:  { color: isDark ? "#d4af37"  : "#b8975a", borderColor: isDark ? "rgba(212,175,55,0.3)"   : "rgba(184,151,90,0.3)", label: t("dashboard.kyc_pending") },
    approved: { color: isDark ? "#5cb85c"  : "#3a8a3a", borderColor: isDark ? "rgba(92,184,92,0.3)"    : "rgba(58,138,58,0.3)",  label: t("dashboard.kyc_verified") },
    rejected: { color: isDark ? "#e00050"  : "#c0003a", borderColor: isDark ? "rgba(220,0,80,0.3)"     : "rgba(192,0,58,0.3)",   label: t("dashboard.kyc_failed") },
  }[kycStatus];

  const badge = (color: string, borderColor: string, label: string) => (
    <span style={{ display:"inline-block", fontFamily:"'Cinzel',serif", fontSize:"0.52rem", letterSpacing:"0.15em", textTransform:"uppercase", padding:"0.2rem 0.6rem", border:`1px solid ${borderColor}`, color }}>
      {label}
    </span>
  );

  const ctaStyle: React.CSSProperties = { display:"inline-block", marginTop:"0.75rem", padding:"0.45rem 1.25rem", fontFamily:"'Cinzel',serif", fontSize:"0.55rem", letterSpacing:"0.15em", textTransform:"uppercase", textDecoration:"none", background: gold, color: isDark ? "#141414" : "#fff", border:"none", cursor:"pointer" };
  const ctaGhost: React.CSSProperties = { display:"inline-block", marginTop:"0.75rem", padding:"0.45rem 1.25rem", fontFamily:"'Cinzel',serif", fontSize:"0.55rem", letterSpacing:"0.15em", textTransform:"uppercase", textDecoration:"none", background:"transparent", color: fgSubtle, border:`1px solid ${cardBorder}`, cursor:"pointer" };

  const th: React.CSSProperties = { fontFamily:"'Cinzel',serif", fontSize:"0.55rem", letterSpacing:"0.12em", textTransform:"uppercase", color: fgSubtle, padding:"0.5rem 0.75rem", textAlign:"left", borderBottom:`1px solid ${borderMid}` };
  const td: React.CSSProperties = { fontFamily:"'Cormorant Garamond',serif", fontSize:"0.88rem", color: fgMuted, padding:"0.55rem 0.75rem", borderBottom:`1px solid ${tableRow}` };

  if (!address) {
    return (
      <div style={{ background: bg, minHeight:"100vh", transition:"background 0.3s" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600;700&display=swap');`}</style>
        <header style={{ textAlign:"center", padding:"4rem 2rem 3rem", position:"relative", borderBottom:`1px solid ${borderFaint}` }}>
          <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 70% 60% at 50% 0%, ${isDark?"rgba(212,175,55,0.05)":"rgba(184,151,90,0.04)"} 0%, transparent 70%)`, pointerEvents:"none" }} />
          <p style={{ fontFamily:"'Cinzel',serif", fontSize:"0.6rem", letterSpacing:"0.35em", textTransform:"uppercase", color: gold, marginBottom:"1rem", position:"relative" }}>Facinations Protocol</p>
          <h1 style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(1.6rem,3.5vw,2.4rem)", fontWeight:400, color: fg, letterSpacing:"0.1em", margin:0, position:"relative" }}>{t("dashboard.title")}</h1>
          <div style={{ width:60, height:1, background:`linear-gradient(to right,transparent,${gold},transparent)`, margin:"1.5rem auto 0" }} />
        </header>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh" }}>
          <div style={{ textAlign:"center", maxWidth:400 }}>
            <div style={{ fontSize:"2rem", marginBottom:"1rem", color:`rgba(${isDark?"212,175,55":"184,151,90"},0.3)` }}>◈</div>
            <h1 style={{ fontFamily:"'Cinzel',serif", fontSize:"1.1rem", fontWeight:400, color: headingColor, letterSpacing:"0.08em", margin:"0 0 0.5rem" }}>{t("dashboard.connect_heading")}</h1>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"0.9rem", color: fgSubtle, lineHeight:1.7, fontStyle:"italic", margin:0 }}>{t("dashboard.connect_body")}</p>
            <button onClick={connect} disabled={connecting} style={{ padding:"0.75rem 2.5rem", background: gold, border:"none", color: isDark?"#141414":"#fff", fontFamily:"'Cinzel',serif", fontSize:"0.65rem", letterSpacing:"0.2em", textTransform:"uppercase", cursor: connecting?"not-allowed":"pointer", marginTop:"1.5rem", opacity: connecting?0.6:1 }}>
              {connecting ? t("wallet.connecting") : t("wallet.connect")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: bg, minHeight:"100vh", fontFamily:"'Cormorant Garamond',serif", color: fg, transition:"background 0.3s, color 0.3s" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600;700&display=swap');`}</style>

      <header style={{ textAlign:"center", padding:"4rem 2rem 3rem", position:"relative", borderBottom:`1px solid ${borderFaint}` }}>
        <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 70% 60% at 50% 0%, ${isDark?"rgba(212,175,55,0.05)":"rgba(184,151,90,0.04)"} 0%, transparent 70%)`, pointerEvents:"none" }} />
        <p style={{ fontFamily:"'Cinzel',serif", fontSize:"0.6rem", letterSpacing:"0.35em", textTransform:"uppercase", color: gold, marginBottom:"1rem", position:"relative" }}>Facinations Protocol</p>
        <h1 style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(1.6rem,3.5vw,2.4rem)", fontWeight:400, color: fg, letterSpacing:"0.1em", margin:0, position:"relative" }}>{t("dashboard.title")}</h1>
        <div style={{ width:60, height:1, background:`linear-gradient(to right,transparent,${gold},transparent)`, margin:"1.5rem auto 0" }} />
      </header>

      <div style={{ maxWidth:1040, margin:"0 auto", padding:"2.5rem 1.5rem 6rem" }}>

        {/* Header row */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:"1rem", marginBottom:"0.5rem" }}>
          <div>
            <p style={{ fontFamily:"'Cinzel',serif", fontSize:"0.55rem", letterSpacing:"0.4em", textTransform:"uppercase", color: gold, marginBottom:"0.4rem" }}>{t("dashboard.section_account")}</p>
            <h1 style={{ fontFamily:"'Cinzel',serif", fontSize:"1.6rem", fontWeight:400, color: headingColor, letterSpacing:"0.08em", margin:"0 0 0.25rem" }}>{t("dashboard.title")}</h1>
            <p style={{ fontFamily:"monospace", fontSize:"0.8rem", color: fgSubtle }}>{address}</p>
          </div>
          <button onClick={disconnect} style={ctaGhost}>{t("dashboard.btn_disconnect")}</button>
        </div>

        {/* Cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:"1rem", margin:"2rem 0" }}>
          {[
            { label: t("dashboard.card_xer_balance"), value: xerBalance ?? "…",    sub: t("dashboard.card_xer_unit") },
            { label: t("dashboard.card_positions"),   value: posLoading ? "…" : String(positions.filter(p => parseFloat(p.fractionBalance)>0).length), sub: t("dashboard.card_positions_unit") },
            { label: t("dashboard.card_entry_value"), value: totalEntryXer>0 ? totalEntryXer.toFixed(2) : "—", sub: t("dashboard.card_entry_unit") },
            { label: t("dashboard.card_fees"),        value: totalFees>0 ? totalFees.toFixed(4) : "—",          sub: t("dashboard.card_fees_unit") },
          ].map(c => (
            <div key={c.label} style={{ border:`1px solid ${cardBorder}`, background: cardBg, padding:"1.25rem 1.5rem", transition:"background 0.3s" }}>
              <p style={{ fontFamily:"'Cinzel',serif", fontSize:"0.52rem", letterSpacing:"0.18em", textTransform:"uppercase", color: fgSubtle, margin:"0 0 0.4rem" }}>{c.label}</p>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.6rem", color: gold, margin:0, lineHeight:1.1 }}>{c.value}</p>
              <p style={{ fontSize:"0.72rem", color: fgSubtle, margin:"0.2rem 0 0", fontStyle:"italic" }}>{c.sub}</p>
            </div>
          ))}
        </div>

        {/* Subgraph notice */}
        {subgraphUnavailable && (
          <div style={{ marginBottom:"1.5rem", padding:"0.65rem 1rem", border:`1px solid ${cardBorder}`, background: isDark?"rgba(212,175,55,0.03)":"rgba(184,151,90,0.03)", fontSize:"0.78rem", color: fgSubtle, fontStyle:"italic" }}>
            On-chain data is temporarily unavailable — the subgraph may be syncing.
          </div>
        )}

        {/* Vault Positions */}
        <div style={{ marginTop:"2.5rem" }}>
          <p style={{ fontFamily:"'Cinzel',serif", fontSize:"0.6rem", letterSpacing:"0.3em", textTransform:"uppercase", color: gold, margin:"0 0 1rem" }}>{t("dashboard.section_positions")}</p>
          {posLoading ? (
            <p style={{ fontSize:"0.85rem", color: fgSubtle, fontStyle:"italic" }}>{t("dashboard.positions_loading")}</p>
          ) : positions.length === 0 ? (
            <div style={{ fontSize:"0.88rem", color: fgSubtle, fontStyle:"italic", padding:"1.5rem 0", textAlign:"center", border:`1px solid ${emptyBorder}` }}>{t("dashboard.positions_empty")}</div>
          ) : (
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr>
                  <th style={th}>{t("nav.vaults")}</th>
                  <th style={{ ...th, textAlign:"right" }}>{t("dashboard.col_fraction")}</th>
                  <th style={{ ...th, textAlign:"right" }}>{t("dashboard.col_entry")}</th>
                  <th style={th}>{t("dashboard.col_updated")}</th>
                  <th style={th}></th>
                </tr>
              </thead>
              <tbody>
                {positions.map(p => (
                  <tr key={p.id}>
                    <td style={td}>{vaultName(p.vaultId)}</td>
                    <td style={{ ...td, textAlign:"right" }}>{parseFloat(p.fractionBalance).toLocaleString(undefined,{maximumFractionDigits:4})}</td>
                    <td style={{ ...td, color: gold, textAlign:"right" }}>{parseFloat(p.entryXerAmount).toFixed(4)}</td>
                    <td style={{ ...td, fontFamily:"monospace", fontSize:"0.75rem", color: fgSubtle }}>{tsToDate(p.updatedAt)}</td>
                    <td style={td}><Link to={`/vaults/${p.vaultId}`} style={{ fontFamily:"'Cinzel',serif", fontSize:"0.55rem", letterSpacing:"0.1em", color: isDark?"rgba(212,175,55,0.5)":"rgba(184,151,90,0.6)", textDecoration:"none" }}>{t("dashboard.col_link")}</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Trade History */}
        <div style={{ marginTop:"2.5rem" }}>
          <p style={{ fontFamily:"'Cinzel',serif", fontSize:"0.6rem", letterSpacing:"0.3em", textTransform:"uppercase", color: gold, margin:"0 0 1rem" }}>{t("dashboard.section_trades")}</p>
          {tradeLoading ? (
            <p style={{ fontSize:"0.85rem", color: fgSubtle, fontStyle:"italic" }}>{t("dashboard.trades_loading")}</p>
          ) : trades.length === 0 ? (
            <div style={{ fontSize:"0.88rem", color: fgSubtle, fontStyle:"italic", padding:"1.5rem 0", textAlign:"center", border:`1px solid ${emptyBorder}` }}>{t("dashboard.trades_empty")}</div>
          ) : (
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr>
                  <th style={th}>{t("dashboard.col_date")}</th>
                  <th style={th}>{t("dashboard.col_fraction_label")}</th>
                  <th style={{ ...th, textAlign:"right" }}>{t("dashboard.col_xer_amount")}</th>
                  <th style={{ ...th, textAlign:"right" }}>{t("dashboard.col_fraction_amount")}</th>
                  <th style={{ ...th, textAlign:"right" }}>{t("dashboard.col_fee")}</th>
                </tr>
              </thead>
              <tbody>
                {trades.map(tr => (
                  <tr key={tr.id}>
                    <td style={{ ...td, fontFamily:"monospace", fontSize:"0.75rem", color: fgSubtle }}>{tsToDate(tr.timestamp)}</td>
                    <td style={td}>{vaultName(tr.fractionId)}</td>
                    <td style={{ ...td, color: gold, textAlign:"right" }}>{parseFloat(tr.xerAmount).toFixed(4)}</td>
                    <td style={{ ...td, textAlign:"right" }}>{parseFloat(tr.fractionAmount).toFixed(4)}</td>
                    <td style={{ ...td, textAlign:"right", color:"#5cb85c" }}>{(parseFloat(tr.xerAmount)*0.003).toFixed(5)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Collector Intelligence */}
        <div style={{ marginTop:"2.5rem" }}>
          <p style={{ fontFamily:"'Cinzel',serif", fontSize:"0.6rem", letterSpacing:"0.3em", textTransform:"uppercase", color: gold, margin:"0 0 1rem" }}>Collector Intelligence</p>
          <div style={{ display:"flex", alignItems:"flex-start", gap:"1rem", flexWrap:"wrap" }}>
            <AICurator context={[
              `Wallet: ${address ? short(address) : "connected"}`,
              xerBalance && xerBalance !== "—" ? `XER balance: ${xerBalance}` : "",
              positions.length > 0 ? `Vault positions: ${positions.filter(p => parseFloat(p.fractionBalance)>0).map(p => vaultName(p.vaultId)).join(", ")}` : "No vault positions yet",
              totalEntryXer > 0 ? `Total entry value: ${totalEntryXer.toFixed(2)} XER` : "",
              trades.length > 0 ? `${trades.length} trade${trades.length!==1?"s":""} on record` : "",
              tier !== "none" ? `Subscription tier: ${tier}` : "No active subscription",
            ].filter(Boolean).join(". ")} />
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"0.82rem", color: fgSubtle, fontStyle:"italic", margin:0, alignSelf:"center" }}>
              Ask SIA about your portfolio, strategy, or fractional ownership.
            </p>
          </div>
        </div>

        {/* Community Portal */}
        <div style={{ marginTop:"2.5rem" }}>
          <p style={{ fontFamily:"'Cinzel',serif", fontSize:"0.6rem", letterSpacing:"0.3em", textTransform:"uppercase", color: gold, margin:"0 0 1rem" }}>Community Portal</p>
          <SubscriptionGate required="gallery" featureName="Community Portal">
            <CommunityPortal />
          </SubscriptionGate>
        </div>

        {/* Account status */}
        <div style={{ marginTop:"2.5rem" }}>
          <p style={{ fontFamily:"'Cinzel',serif", fontSize:"0.6rem", letterSpacing:"0.3em", textTransform:"uppercase", color: gold, margin:"0 0 1rem" }}>{t("dashboard.section_status")}</p>
          <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>

            {/* KYC */}
            <div style={{ flex:1, minWidth:220, border:`1px solid ${cardBorder}`, background: cardBg, padding:"1.25rem", transition:"background 0.3s" }}>
              <p style={{ fontFamily:"'Cinzel',serif", fontSize:"0.55rem", letterSpacing:"0.2em", textTransform:"uppercase", color: fgSubtle, margin:"0 0 0.6rem" }}>{t("dashboard.kyc_label")}</p>
              {badge(kycBadge.color, kycBadge.borderColor, kycBadge.label)}
              {kycStatus === "idle" && <>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"0.82rem", color: fgSubtle, fontStyle:"italic", margin:"0.6rem 0 0" }}>{t("dashboard.kyc_required_note")}</p>
                <Link to="/kyc" style={ctaStyle}>{t("dashboard.kyc_start")}</Link>
              </>}
              {kycStatus === "pending" && <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"0.82rem", color: fgSubtle, fontStyle:"italic", margin:"0.6rem 0 0" }}>{t("dashboard.kyc_review_note")}</p>}
              {kycStatus === "rejected" && <Link to="/kyc" style={ctaStyle}>{t("dashboard.kyc_retry")}</Link>}
              {kycStatus === "approved" && <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"0.82rem", color:"#5cb85c", fontStyle:"italic", margin:"0.6rem 0 0" }}>{t("dashboard.kyc_complete")}</p>}
            </div>

            {/* Subscription */}
            <div style={{ flex:1, minWidth:220, border:`1px solid ${cardBorder}`, background: cardBg, padding:"1.25rem", transition:"background 0.3s" }}>
              <p style={{ fontFamily:"'Cinzel',serif", fontSize:"0.55rem", letterSpacing:"0.2em", textTransform:"uppercase", color: fgSubtle, margin:"0 0 0.6rem" }}>{t("dashboard.subscription_label")}</p>
              {badge(tier !== "none" ? "#5cb85c" : fgSubtle, tier !== "none" ? "rgba(92,184,92,0.3)" : cardBorder, tier === "none" ? t("dashboard.subscription_none") : activePlan?.label ?? tier)}
              {tier === "none" ? <>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"0.82rem", color: fgSubtle, fontStyle:"italic", margin:"0.6rem 0 0" }}>{t("dashboard.subscription_note")}</p>
                <Link to="/studio" style={ctaStyle}>{t("dashboard.subscription_plans")}</Link>
              </> : <>
                {activePlan?.priceMonthly && <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"0.82rem", color: fgSubtle, fontStyle:"italic", margin:"0.6rem 0 0" }}>{t("dashboard.subscription_price",{price:activePlan.priceMonthly})}</p>}
                <Link to="/studio" style={ctaGhost}>{t("dashboard.subscription_manage")}</Link>
              </>}
            </div>

            {/* Wallet */}
            <div style={{ flex:1, minWidth:220, border:`1px solid ${cardBorder}`, background: cardBg, padding:"1.25rem", transition:"background 0.3s" }}>
              <p style={{ fontFamily:"'Cinzel',serif", fontSize:"0.55rem", letterSpacing:"0.2em", textTransform:"uppercase", color: fgSubtle, margin:"0 0 0.6rem" }}>{t("dashboard.wallet_label")}</p>
              {badge("#5cb85c","rgba(92,184,92,0.3)",t("dashboard.wallet_connected"))}
              <p style={{ fontFamily:"monospace", fontSize:"0.72rem", color: fgSubtle, margin:"0.6rem 0 0", wordBreak:"break-all" }}>{short(address)}</p>
              <Link to="/swap" style={ctaGhost}>{t("dashboard.wallet_go_swap")}</Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
