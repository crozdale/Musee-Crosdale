import { useState } from "react";
import { ethers } from "ethers";
import VaultABI from "../abis/Vault.json";
import { VAULTS } from "../data/vaults";

export default function Vaults() {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const [vaults, setVaults] = useState([]);

  async function connectWallet() {
    try {
      if (!window.ethereum) {
        setError("MetaMask not installed");
        return;
      }

      // 🔒 Only request once
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const results = [];

      for (const vault of VAULTS) {
        const contract = new ethers.Contract(
          vault.address,
          VaultABI,
          signer
        );

        const name = await contract.name();
        const symbol = await contract.symbol();
        const totalSupply = await contract.totalSupply();

        results.push({
          ...vault,
          name,
          symbol,
          totalSupply: totalSupply.toString(),
        });
      }

      setVaults(results);
      setConnected(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "Wallet connection failed");
    }
  }

  return (
    <div style={{ padding: 32 }}>
      <h1>Facinations</h1>

      {!connected && (
        <button onClick={connectWallet}>
          Connect Wallet
        </button>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {vaults.map((v) => (
        <div key={v.address} style={{ marginTop: 24 }}>
          <h3>{v.name}</h3>
          <p>Symbol: {v.symbol}</p>
          <p>Total Supply: {v.totalSupply}</p>
        </div>
      ))}
    </div>
  );
}
