import VaultABI from "../abis/Vault.json";

export const VAULT_ADDRESS = "0x0000000000000000000000000000000000000000";

export function getVaultContract(provider) {
  if (!provider) return null;
  return new provider.constructor.Contract(
    VAULT_ADDRESS,
    VaultABI,
    provider
  );
}
