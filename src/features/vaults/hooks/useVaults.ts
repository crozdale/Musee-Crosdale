// src/features/vaults/hooks/useVaults.ts
import { VAULTS } from "../registry/vaultRegistry";

export function useVaults() {
  return {
    vaults: VAULTS,
    loading: false,
    error: null as Error | null,
  };
}
