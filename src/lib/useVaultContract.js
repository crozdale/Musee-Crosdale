import { useEffect, useState } from "react";
import { ethers } from "ethers";
import VaultABI from "../abis/Vault.json";

const VAULT_ADDRESS = "0xYOUR_CONTRACT_ADDRESS_HERE";

export function useVaultContract() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);

  async function connectWallet() {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not installed");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      const signer = await provider.getSigner();
      const vault = new ethers.Contract(VAULT_ADDRESS, VaultABI, signer);

      setAccount(accounts[0]);
      setContract(vault);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  return { contract, account, error, connectWallet };
}
