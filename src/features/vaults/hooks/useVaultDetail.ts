// src/features/vaults/hooks/useVaultDetail.ts
import { useQuery } from "@apollo/client";
import { VAULT_DETAIL_QUERY } from "../api/vaultDetailQuery";
import type {
  VaultDetailData,
  VaultDetailVars,
} from "../types/vaultDetail";

export function useVaultDetail(vaultId: string | undefined) {
  const { data, loading, error, refetch, networkStatus } =
    useQuery<VaultDetailData, VaultDetailVars>(VAULT_DETAIL_QUERY, {
      variables: { vaultId: vaultId ?? "" },
      skip: !vaultId, // do not fire query until we have an ID
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
