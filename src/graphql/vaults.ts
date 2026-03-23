// src/graphql/queries/vaults.ts
import { gql } from "@apollo/client";

export const VAULTS_QUERY = gql`
  query Vaults(
    $offset: Int! = 0
    $limit: Int! = 20
    $search: String
    $statusIn: [String!]
  ) {
    vaults(
      skip: $offset
      first: $limit
      orderBy: createdAt
      orderDirection: desc
      where: {
        name_contains_nocase: $search
        status_in: $statusIn
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
