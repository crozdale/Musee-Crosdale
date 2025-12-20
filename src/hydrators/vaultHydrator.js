import { Contract } from "ethers";

/**
 * Read-only vault hydrator (safe stub)
 */
export async function hydrateVaultFromChain({
  provider,
  vaultAddress,
  vaultAbi,
}) {
  if (!provider || !vaultAddress || !vaultAbi) {
    return {
      name: null,
      totalSupply: null,
      owner: null,
    };
  }

  try {
    const contract = new Contract(vaultAddress, vaultAbi, provider);

    const [name, totalSupply, owner] = await Promise.all([
      contract.name?.().catch(() => null),
      contract.totalSupply?.().catch(() => null),
      contract.owner?.().catch(() => null),
    ]);

    return {
      name,
      totalSupply,
      owner,
    };
  } catch {
    return {
      name: null,
      totalSupply: null,
      owner: null,
    };
  }
}
