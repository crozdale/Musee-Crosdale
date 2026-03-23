// src/graphql/queries/vaults.ts
import { gql } from "@apollo/client";

export const VAULTS_QUERY = gql`
  query Vaults(
    $skip: Int = 0
    $first: Int = 20
    $statusIn: [String!]
    $nameSearch: String
  ) {
    vaults(
      skip: $skip
      first: $first
      orderBy: createdAt
      orderDirection: desc
      where: {
        status_in: $statusIn
        name_contains_nocase: $nameSearch
      }
    ) {
      id
      name
      owner
      createdAt
      status
      primaryAsset {
        id
        symbol
        decimals
        tokenAddress
      }
    }
  }
`;
