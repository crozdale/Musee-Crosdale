import { useEffect, useState } from "react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import FRACTION_ABI from "../abi/Fraction.json";
import { VAULTS } from "../registry/vaultRegistry";

export function useFraction(vaultId) {
  const [supply, setSupply] = useState("0");
  const [price, setPrice] = useState("0");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const vault = VAULTS.find(v => v.id === vaultId);
        if (!vault || !vault.fractionContract) return;

        const provider = new BrowserProvider(window.ethereum);
        const contract = new Contract(
          vault.fractionContract,
          FRACTION_ABI,
          provider
        );

        const rawSupply = await contract.totalSupply();
        const rawPrice = await contract.price();

        setSupply(formatUnits(rawSupply, 18));
        setPrice(formatUnits(rawPrice, 18));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [vaultId]);

  return { supply, price, loading };
}
