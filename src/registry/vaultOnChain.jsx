import { ethers } from "ethers";
import VaultABI from "../abis/Vault.json";

// Replace with your actual deployed contract address
const CONTRACT_ADDRESS = "0xYourContractAddressHere";

export async function fetchVaultOnChain(vaultId) {
  const provider = new ethers.JsonRpcProvider(
    "https://mainnet.infura.io/v3/YOUR_KEY"
  );

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    VaultABI,
    provider
  );

  return await contract.getVault(vaultId);
}
