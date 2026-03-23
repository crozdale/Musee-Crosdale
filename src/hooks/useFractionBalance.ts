import { useEffect, useState } from "react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import FRACTION_ABI from "../abi/FractionERC20.json";
import { VAULTS } from "../registry/vaultRegistry";

export function useFractionBalance(vaultId, account) {
  const [balance, setBalance] = useState("0");

  useEffect(() => {
    async function load() {
      if (!vaultId || !account || !window.ethereum) return;

      const vault = VAULTS.find(v => v.id === vaultId);
      if (!vault) return;

      const provider = new BrowserProvider(window.ethereum);
      const token = new Contract(
        vault.fractionContract,
        FRACTION_ABI,
        provider
      );

      const raw = await token.balanceOf(account);
      const decimals = await token.decimals();

      setBalance(formatUnits(raw, decimals));
    }

    load();
  }, [vaultId, account]);

  return balance;
}
