import { ethers } from "ethers";
import VaultABI from "../abi/Vault1155.json";

export async function mintFraction({
  vaultAddress,
  tokenId,
  amount
}) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(vaultAddress, VaultABI, signer);
  const tx = await contract.mint(
    await signer.getAddress(),
    tokenId,
    amount
  );

  return await tx.wait();
}
