// src/features/vaults/hooks/useVaultsQuery.ts
import { useQuery } from "@apollo/client";
import { VAULTS_QUERY } from "../api/vaultsQuery";
import type {
  VaultsQueryData,
  VaultsQueryVars,
} from "../types/vaults";

export interface UseVaultsQueryOptions extends VaultsQueryVars {}

export function useVaultsQuery(options?: UseVaultsQueryOptions) {
  const {
    skip = 0,
    first = 20,
    nameSearch = null,
  } = options || {};

  const { data, loading, error, refetch, networkStatus } =
    useQuery<VaultsQueryData, VaultsQueryVars>(VAULTS_QUERY, {
      variables: { skip, first, nameSearch },
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
    });

  const vaults = data?.vaults ?? [];

  return {
    vaults,
    loading,
    error,
    refetch,
    networkStatus,
  };
}
