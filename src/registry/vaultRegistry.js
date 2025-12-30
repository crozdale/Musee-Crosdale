import { ethers } from "ethers";
// import VaultRegistryABI from "../abis/VaultRegistry.json";

// On-chain registry contract
const REGISTRY_ADDRESS = "0xYOUR_DEPLOYED_REGISTRY_ADDRESS";

export async function getVault(vaultId) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(
    REGISTRY_ADDRESS,
    //VaultRegistryABI,
    provider
  );

  return await contract.vaults(vaultId);
}

export async function registerVault(vaultId, tokenId, contractAddress, legalURI) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(
    REGISTRY_ADDRESS,
   // VaultRegistryABI,
    signer
  );

  return contract.registerVault(vaultId, tokenId, contractAddress, legalURI);
}
