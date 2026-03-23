// src/graphql/types/vaultDetail.ts

// What your subgraph returns for a single vault
export interface VaultDetailData {
  vault: {
    id: string;                 // subgraph ID
    vaultId: string;            // matches VAULTS.vaultId
    name: string;
    description: string | null;
    contractAddress: string;
    chainId: number;
    premiumRequired: boolean;

    // Metrics
    tvlUsd: string | null;      // store as string from Graph
    sharePriceUsd: string | null;
    volume24hUsd: string | null;
    holders: string | null;

    // Positions (stub shape for later)
    positions: Array<{
      id: string;
      assetSymbol: string;
      assetAddress: string;
      weightBps: string;        // basis points (e.g. "2500" = 25%)
      valueUsd: string | null;
    }>;
  } | null;
}

// Query variables
export interface VaultDetailVars {
  vaultId: string;
}
