import { useParams } from "react-router-dom";

export default function Swap() {
  const { vaultId } = useParams();

  return (
    <div className="max-w-xl mx-auto px-10 py-20 space-y-6">
      <h1 className="text-3xl font-serif">Swap Fractions</h1>

      <p className="text-sm text-black/70">
        Vault: {vaultId}
      </p>

      <div className="border p-6 space-y-4">
        <input
          type="number"
          placeholder="Amount"
          className="w-full border px-4 py-2"
        />

        <button className="w-full border py-2">
          Swap (XER ⇄ Fraction)
        </button>
      </div>
    </div>
  );
}

