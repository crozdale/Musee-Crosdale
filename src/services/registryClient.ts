import { ethers } from "ethers";
import VaultRegistryABI from "../abi/VaultRegistry.json";

const REGISTRY_ADDRESS = "0xYourRegistryAddressHere";

export async function fetchVault(vaultId) {
  if (!window.ethereum) {
    throw new Error("No Web3 wallet detected");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(
    REGISTRY_ADDRESS,
    VaultRegistryABI,
    provider
  );

  return await contract.getVault(vaultId);
}
