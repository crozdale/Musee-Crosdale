// src/hooks/useVaultDetail.ts
import { useQuery } from "@apollo/client";
import { VAULT_DETAIL_QUERY } from "../graphql/queries/vaultDetail";
import type { VaultDetailData, VaultDetailVars } from "../graphql/types/vaultDetail";

export function useVaultDetail(vaultId: string | undefined) {
  const { data, loading, error, refetch, networkStatus } =
    useQuery<VaultDetailData, VaultDetailVars>(VAULT_DETAIL_QUERY, {
      variables: { vaultId: vaultId ?? "" },
      skip: !vaultId,                    // don't fire until we have an ID
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
    });

  const vault = data?.vault ?? null;

  return {
    vault,
    loading,
    error,
    refetch,
    networkStatus,
  };
}
