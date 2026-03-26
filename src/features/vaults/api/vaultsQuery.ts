// src/features/vaults/api/vaultsQuery.ts
import { gql } from "@apollo/client";

export const VAULTS_QUERY = gql`
  query Vaults($skip: Int!, $first: Int!, $nameSearch: String) {
    vaults(
      skip: $skip
      first: $first
      orderBy: createdAt
      orderDirection: desc
      where: { name_contains_nocase: $nameSearch }
    ) {
      id
      vaultId
      name
      tvlUsd
    }
  }
`;
