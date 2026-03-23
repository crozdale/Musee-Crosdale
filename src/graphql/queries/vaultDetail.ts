// src/graphql/queries/vaultDetail.ts
import { gql } from "@apollo/client";

export const VAULT_DETAIL_QUERY = gql`
  query VaultDetail($vaultId: String!) {
    vault(where: { vaultId: $vaultId }) {
      id
      vaultId
      name
      description
      contractAddress
      chainId
      premiumRequired

      tvlUsd
      sharePriceUsd
      volume24hUsd
      holders

      positions {
        id
        assetSymbol
        assetAddress
        weightBps
        valueUsd
      }
    }
  }
`;
