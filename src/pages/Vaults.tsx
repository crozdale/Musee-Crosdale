// src/pages/Vaults.jsx
import React, { useState, useDeferredValue } from "react";
import { Link } from "react-router-dom";
import { useVaults } from "../features/vaults/hooks/useVaultsQuery";

const Vaults = () => {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const { vaults, loading, error } = useVaultsQuery({ first: 24, nameSearch: deferredSearch.trim()  ||  null, });
  const safeVaults = vaults || [];

  const normalizedSearch = deferredSearch.trim().toLowerCase();

  const filteredVaults = safeVaults.filter((v) => {
    if (!normalizedSearch) return true;
    return (
      v.name.toLowerCase().includes(normalizedSearch) ||
      v.vaultId.toLowerCase().includes(normalizedSearch)
    );
  });

  console.log("vaults from hook", vaults);
  console.log("filteredVaults", filteredVaults);

  if (loading && safeVaults.length === 0) {
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
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <h1 style={{ color: "#d4af37", margin: 0 }}>Vaults</h1>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name…"
          style={{
            flex: "0 0 260px",
            padding: "0.4rem 0.6rem",
            borderRadius: 4,
            border: "1px solid rgba(212,175,55,0.4)",
            background: "#050505",
            color: "#eee",
            fontSize: "0.85rem",
          }}
        />
      </header>

      {filteredVaults.length === 0 && !loading && (
        <p style={{ color: "#aaa" }}>No vaults match that search.</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "1rem",
        }}
      >
        {filteredVaults.map((v) => (
          <Link
            key={v.vaultId}
            to={`/vaults/${v.vaultId}`}
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
              {v.name}
            </h2>
            {/* Uncomment when these fields exist on your vault objects */}
            {/* <p>Status: {v.status}</p>
            <p>Owner: {v.owner}</p> */}
          </Link>
        ))}
      </div>
    </main>
  );
};

export default Vaults;
