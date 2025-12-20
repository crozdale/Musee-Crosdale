import { Link } from "react-router-dom";
import { useWeb3 } from "../providers/Web3Provider";

export default function Header() {
  const { account, xerBalance, connect, disconnect } = useWeb3();

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-black">
      {/* Brand */}
      <Link to="/gallery" className="flex items-center gap-3">
        <img
          src="/logos/facinations-gold.svg"
          alt="Façinations™"
          className="h-8"
        />
      </Link>

      {/* Wallet */}
      {!account ? (
        <button
          onClick={connect}
          className="px-4 py-2 border border-gold text-gold rounded"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="flex items-center gap-4 text-gold">
          <span className="text-sm">
            {xerBalance} XER
          </span>
          <span className="text-sm font-mono">
            {account.slice(0, 6)}…{account.slice(-4)}
          </span>
          <button
            onClick={disconnect}
            className="px-3 py-1 border border-gold rounded"
          >
            Disconnect
          </button>
        </div>
      )}
    </header>
  );
}
