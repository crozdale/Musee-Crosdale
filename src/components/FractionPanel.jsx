import { Link } from "react-router-dom";
import { useContext } from "react";
import { Web3Context } from "../providers/Web3Provider";
import { useFraction } from "../hooks/useFraction";
import { useFractionBalance } from "../hooks/useFractionBalance";

export default function FractionPanel({ vaultId }) {
  const web3 = useContext(Web3Context);
  const account = web3?.account;

  const { supply, price, loading } = useFraction(vaultId);
  const balance = useFractionBalance(vaultId, account);

  if (loading) {
    return <div className="border p-6">Loading on-chain data…</div>;
  }

  return (
    <div className="border p-6 space-y-4">
      <h3 className="text-xl font-serif">Fractions</h3>

      <div className="text-sm space-y-1">
        <div>Total Supply: {supply}</div>
        <div>Price (XER): {price}</div>
        {account && <div>Your Balance: {balance}</div>}
      </div>

      <Link to={`/swap/${vaultId}`} className="inline-block underline">
        Trade Fractions
      </Link>
    </div>
  );
}
