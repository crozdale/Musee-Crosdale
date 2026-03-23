// src/pages/VaultDetail.tsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { VAULTS } from "../features/vaults/registry/vaultRegistry";
import { useVaultDetail } from "../features/vaults/hooks/useVaultDetail";

const labelStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#888",
};

const VaultDetail: React.FC = () => {
  const { vaultId } = useParams<{ vaultId: string }>();

  // Registry for canonical metadata
  const registryVault = VAULTS.find((v) => v.vaultId === vaultId);

  const {
    vault: liveVault,
    loading,
    error,
  } = useVaultDetail(vaultId);

  // Prefer live data if present, fall back to registry
  const vault = liveVault ?? registryVault ?? null;

  if (!vault) {
    return (
      <main style={{ padding: "2rem", color: "#eee" }}>
        <p>Vault not found.</p>
        <Link to="/vaults" style={{ color: "#d4af37" }}>
          ← Back to vaults
        </Link>
      </main>
    );
  }

  const tvlDisplay =
    liveVault?.tvlUsd != null ? `$${Number(liveVault.tvlUsd).toLocaleString()}` : "—";

  const sharePriceDisplay =
    liveVault?.sharePriceUsd != null ? `$${Number(liveVault.sharePriceUsd).toLocaleString()}` : "—";

  const volume24hDisplay =
    liveVault?.volume24hUsd != null ? `$${Number(liveVault.volume24hUsd).toLocaleString()}` : "—";

  const holdersDisplay =
    liveVault?.holders != null ? Number(liveVault.holders).toLocaleString() : "—";

  const positions = liveVault?.positions ?? [];

  return (
    <main style={{ padding: "2rem", color: "#eee" }}>
      <Link
        to="/vaults"
        style={{
          color: "#d4af37",
          display: "inline-block",
          marginBottom: "1rem",
          textDecoration: "none",
        }}
      >
        ← Back to vaults
      </Link>

      {/* Header */}
      <header style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ color: "#d4af37", marginBottom: "0.5rem" }}>
          {vault.name}
        </h1>
        <p style={{ margin: 0, color: "#aaa" }}>{vault.description}</p>

        {loading && (
          <p style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "#777" }}>
            Loading live metrics…
          </p>
        )}
        {error && (
          <p style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "#f88" }}>
            Live metrics unavailable.
          </p>
        )}
      </header>

      {/* Core info */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div>
          <div style={labelStyle}>Vault ID</div>
          <div style={{ fontFamily: "monospace", fontSize: "0.9rem" }}>
            {vault.vaultId}
          </div>
        </div>

        <div>
          <div style={labelStyle}>Contract</div>
          <div style={{ fontFamily: "monospace", fontSize: "0.9rem" }}>
            {vault.contractAddress}
          </div>
        </div>

        <div>
          <div style={labelStyle}>Chain</div>
          <div>Mainnet (chainId {vault.chainId})</div>
        </div>

        <div>
          <div style={labelStyle}>Access</div>
          <div>{vault.premiumRequired ? "Premium required" : "Open access"}</div>
        </div>
      </section>

      {/* Metrics & Price */}
      <section
        style={{
          marginBottom: "2rem",
          padding: "1.5rem",
          borderRadius: 8,
          border: "1px solid rgba(212,175,55,0.25)",
          background: "#050505",
        }}
      >
        <h2
          style={{
            fontSize: "0.95rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#d4af37",
            marginTop: 0,
            marginBottom: "1rem",
          }}
        >
          Metrics & Price
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
          }}
        >
          <div>
            <div style={labelStyle}>TVL</div>
            <div style={{ fontSize: "1rem" }}>{tvlDisplay}</div>
          </div>

          <div>
            <div style={labelStyle}>Share price</div>
            <div style={{ fontSize: "1rem" }}>{sharePriceDisplay}</div>
          </div>

          <div>
            <div style={labelStyle}>24h volume</div>
            <div style={{ fontSize: "1rem" }}>{volume24hDisplay}</div>
          </div>

          <div>
            <div style={labelStyle}>Holders</div>
            <div style={{ fontSize: "1rem" }}>{holdersDisplay}</div>
          </div>
        </div>
      </section>

      {/* Positions */}
      <section
        style={{
          padding: "1.5rem",
          borderRadius: 8,
          border: "1px solid rgba(212,175,55,0.25)",
          background: "#050505",
        }}
      >
        <h2
          style={{
            fontSize: "0.95rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#d4af37",
            marginTop: 0,
            marginBottom: "1rem",
          }}
        >
          Positions
        </h2>

        {positions.length === 0 ? (
          <p style={{ fontSize: "0.85rem", color: "#aaa" }}>
            Positions will appear here when wired to live data.
          </p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.85rem",
              color: "#ddd",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "0.5rem 0.25rem",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  Asset
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "0.5rem 0.25rem",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  Weight
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "0.5rem 0.25rem",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  Value (USD)
                </th>
              </tr>
            </thead>
            <tbody>
              {positions.map((p) => (
                <tr key={p.id}>
                  <td style={{ padding: "0.5rem 0.25rem" }}>
                    {p.assetSymbol}
                  </td>
                  <td
                    style={{
                      padding: "0.5rem 0.25rem",
                      textAlign: "right",
                    }}
                  >
                    {Number(p.weightBps) / 100}%
                  </td>
                  <td
                    style={{
                      padding: "0.5rem 0.25rem",
                      textAlign: "right",
                    }}
                  >
                    {p.valueUsd != null
                      ? `$${Number(p.valueUsd).toLocaleString()}`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
};

export default VaultDetail;
