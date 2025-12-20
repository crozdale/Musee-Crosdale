import { useState } from "react";

export default function Swap() {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  return (
    <div className="mx-auto max-w-xl px-6 py-20">
      <header className="text-center">
        <h1 className="font-serif text-4xl font-bold">
          Swap
        </h1>
        <p className="mt-3 text-black/60">
          Exchange XER liquidity with vault fractions.
        </p>
      </header>

      <div className="mt-12 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        {/* FROM */}
        <div>
          <label className="block text-sm font-semibold text-black/70">
            From (XER)
          </label>
          <input
            type="number"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            placeholder="0.0"
            className="
              mt-2 w-full rounded-lg
              border border-black/20
              px-4 py-3
              text-lg
              focus:outline-none focus:ring-2 focus:ring-blue-400
            "
          />
        </div>

        {/* SWAP ARROW */}
        <div className="my-6 flex justify-center text-black/40">
          ↓
        </div>

        {/* TO */}
        <div>
          <label className="block text-sm font-semibold text-black/70">
            To (Vault Fraction)
          </label>
          <input
            type="number"
            value={toAmount}
            readOnly
            placeholder="—"
            className="
              mt-2 w-full rounded-lg
              border border-black/10
              bg-black/5
              px-4 py-3
              text-lg
            "
          />
        </div>

        {/* ACTION */}
        <button
          disabled
          className="
            mt-8 w-full
            rounded-xl
            bg-blue-600
            px-6 py-3
            text-white font-semibold
            opacity-60
            cursor-not-allowed
          "
        >
          Connect wallet to swap
        </button>
      </div>
    </div>
  );
}
