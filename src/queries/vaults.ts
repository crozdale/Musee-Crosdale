
import { useQuery } from "@apollo/client";
import { VAULTS_QUERY } from "../graphql/queries/vaults";
import type { VaultsQueryData, VaultsQueryVars, Vault } from "../graphql/types/vaults";

export function useVaults(options?: VaultsQueryVars) {
  const {
    skip = 0,
    first = 20,
    statusIn = ["ACTIVE"],
    nameSearch = null,
  } = options || {};

  const { data, loading, error, refetch, networkStatus } =
    useQuery<VaultsQueryData, VaultsQueryVars>(VAULTS_QUERY, {
      variables: { skip, first, statusIn, nameSearch },
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
    });

  return {
    vaults: data?.vaults ?? [],
    loading,
    error,
    refetch,
    networkStatus,
  };
}

export type { Vault };
2. Use it inside Vaults.tsx
tsx
// src/pages/Vaults.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useVaults } from "../hooks/useVaults";

const VaultsPage: React.FC = () => {
  const { vaults, loading, error } = useVaults({
    first: 24,
    statusIn: ["ACTIVE"],
  });

  if (loading && vaults.length === 0) {
    return <div style={{ color: "#ccc" }}>Loading vaults…</div>;
  }

  if (error) {
    return (
      <div style={{ color: "#f88" }}>
        Unable to load vaults right now.
      </div>
    );
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1 style={{ color: "#d4af37", marginBottom: "1rem" }}>Vaults</h1>

      {vaults.length === 0 && (
        <p style={{ color: "#aaa" }}>No vaults found.</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "1rem",
        }}
      >
        {vaults.map((v) => (
          <Link
            key={v.id}
            to={`/vaults/${v.id}`}
            style={{
              textDecoration: "none",
              border: "1px solid rgba(212,175,55,0.25)",
              padding: "1rem",
              borderRadius: "6px",
              background: "#0a0a0a",
              color: "#eee",
            }}
          >
            <h2
              style={{
                margin: "0 0 0.5rem",
                fontSize: "1rem",
                color: "#d4af37",
              }}
            >
              {v.name ?? v.id}
            </h2>
            <p style={{ margin: "0.15rem 0", fontSize: "0.85rem" }}>
              Status: {v.status}
            </p>
            <p style={{ margin: "0.15rem 0", fontSize: "0.8rem" }}>
              Owner: {v.owner}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default VaultsPage;
