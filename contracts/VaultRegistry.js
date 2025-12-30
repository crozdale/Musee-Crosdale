import { ethers } from "ethers";
import VaultRegistryABI from "./VaultRegistry.json";
import { CHAIN_CONFIG } from "../config/chain";

export async function fetchVaultOnChain(vaultId) {
  const provider = new ethers.JsonRpcProvider(CHAIN_CONFIG.rpcUrl);

  const contract = new ethers.Contract(
    CHAIN_CONFIG.vaultRegistryAddress,
    VaultRegistryABI,
    provider
  );

  const result = await contract.getVault(vaultId);

  return {
    vaultId: result[0],
    tokenId: Number(result[1]),
    contractAddress: result[2],
    legalURI: result[3],
    active: result[4],
  };
}
