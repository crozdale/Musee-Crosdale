import { ethers } from "ethers";
import FractionalVaultABI from "./abi/FractionalVault.json";

/**
 * Mint fractional tokens from a vault
 * @param {string} vaultAddress - ERC1155 contract address
 * @param {number} tokenId - Vault token ID
 * @param {number} amount - Number of fractions to mint
 */
export async function mintFraction({ vaultAddress, tokenId, amount }) {
  if (!window.ethereum) {
    throw new Error("Wallet not found");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(
    vaultAddress,
    FractionalVaultABI,
    signer
  );

  const tx = await contract.mintFraction(
    tokenId,
    amount,
    { value: 0 } // optional payment hook
  );

  return await tx.wait();
}
