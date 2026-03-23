// src/features/vaults/types/vaultDetail.ts

export interface VaultDetailData {
  vault: {
    id: string;
    vaultId: string;
    name: string;
    description: string | null;
    contractAddress: string;
    chainId: number;
    premiumRequired: boolean;

    tvlUsd: string | null;
    sharePriceUsd: string | null;
    volume24hUsd: string | null;
    holders: string | null;

    positions: Array<{
      id: string;
      assetSymbol: string;
      assetAddress: string;
      weightBps: string;
      valueUsd: string | null;
    }>;
  } | null;
}

export interface VaultDetailVars {
  vaultId: string;
}
