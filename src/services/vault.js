import { ethers } from "ethers";
import VaultRegistryABI from "../abi/VaultRegistry.json";

const REGISTRY_ADDRESS = "0xYourRegistryAddressHere";

export async function getVaultFromChain(vaultId) {
  if (!window.ethereum) {
    throw new Error("Web3 wallet not detected");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(
    REGISTRY_ADDRESS,
    VaultRegistryABI,
    provider
  );

  return await contract.getVault(vaultId);
}
