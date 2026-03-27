/**
 * Compatibility shim — kept so legacy import paths (`../registry/vaultRegistry`)
 * continue to resolve. All source-of-truth data lives in:
 *   src/features/vaults/registry/vaultRegistry.ts
 */

export { VAULTS, type RegistryVault } from "../features/vaults/registry/vaultRegistry";
import { VAULTS } from "../features/vaults/registry/vaultRegistry";

/** Look up a vault by its vaultId string. Returns undefined when not found. */
export function getVaultById(id?: string) {
  if (!id) return undefined;
  return VAULTS.find((v) => v.vaultId === id);
}
