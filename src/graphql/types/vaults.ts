// src/graphql/types/vaults.ts

export interface Asset {
  id: string;
  symbol: string | null;
  decimals: number;
  tokenAddress: string; // Bytes -> hex string
}

export interface Vault {
  id: string;
  name: string | null;
  owner: string;        // Bytes -> hex string
  createdAt: string;    // BigInt -> serialized string
  status: string;
  primaryAsset: Asset | null;
}

export interface VaultsQueryData {
  vaults: Vault[];
}

export interface VaultsQueryVars {
  skip?: number;
  first?: number;
  statusIn?: string[] | null;
  nameSearch?: string | null;
}
