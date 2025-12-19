import { useFraction } from "../hooks/useFraction";
import { formatFractionAmount } from "../config/fraction";
import { Link } from "react-router-dom";

export default function FractionPanel({ vaultId }) {
  const { supply, price, loading } = useFraction(vaultId);

  if (loading) {
    return <div className="border p-6">Loading fractions…</div>;
  }

  return (
    <div className="border p-6 space-y-4">
      <h3 className="text-xl font-serif">Fractions</h3>

      <div className="text-sm">
        <div>Total Supply: {formatFractionAmount(supply)}</div>
        <div>Price (XER): {price}</div>
      </div>

      <Link
        to={`/swap/${vaultId}`}
        className="inline-block underline mt-4"
      >
        Trade Fractions
      </Link>
    </div>
  );
}
