// src/features/vaults/types/vaults.ts

export interface VaultListItem {
  id: string;          // subgraph ID
  vaultId: string;     // canonical ID ("VAULT-ALBATRIX-001")
  name: string;
  tvlUsd: string | null;
}

export interface VaultsQueryData {
  vaults: VaultListItem[];
}

export interface VaultsQueryVars {
  skip?: number;
  first?: number;
  nameSearch?: string | null;
}
