import { useParams } from "react-router-dom";
import { useState } from "react";
import { buyFractions, sellFractions } from "../hooks/useFractionSwap";
import { CHAIN } from "../config/chain";

export default function Swap() {
  const { vaultId } = useParams();
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [txHash, setTxHash] = useState(null);

  async function handleBuy() {
    try {
      setStatus("Approving and buying…");
      setTxHash(null);
      const result = await buyFractions(vaultId, amount);
      setTxHash(result.hash);
      setStatus("Buy complete");
    } catch (e) {
      console.error(e);
      setStatus("Buy failed");
    }
  }

  async function handleSell() {
    try {
      setStatus("Selling…");
      setTxHash(null);
      const result = await sellFractions(vaultId, amount);
      setTxHash(result.hash);
      setStatus("Sell complete");
    } catch (e) {
      console.error(e);
      setStatus("Sell failed");
    }
  }

  return (
    <div className="max-w-xl mx-auto px-10 py-20 space-y-6">
      <h1 className="text-3xl font-serif">Swap Fractions</h1>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border px-4 py-2"
      />

      <div className="flex gap-4">
        <button onClick={handleBuy} className="flex-1 border py-2">
          Buy Fractions
        </button>

        <button onClick={handleSell} className="flex-1 border py-2">
          Sell Fractions
        </button>
      </div>

      {status && <div className="text-sm">{status}</div>}

      {txHash && (
        <a
          href={`${CHAIN.explorer}/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm underline"
        >
          View transaction on {CHAIN.name}
        </a>
      )}
    </div>
  );
}
