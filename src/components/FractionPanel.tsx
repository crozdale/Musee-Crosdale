import { useState } from "react";

export default function FractionPanel({ vault }) {
  const [amount, setAmount] = useState(1);

  return (
    <div className="fraction-panel">
      <h3>Fractional Ownership</h3>

      <p>
        Total Fractions: <strong>{vault.totalFractions}</strong>
      </p>
      <p>
        Available: <strong>{vault.availableFractions}</strong>
      </p>

      <input
        type="number"
        min="1"
        max={vault.availableFractions}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button className="primary">
        Purchase Fraction
      </button>

      <p className="note">
        Ownership recorded on-chain. Subject to legal documentation.
      </p>
    </div>
  );
}
