import { useEffect, useState } from "react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import ERC20_ABI from "../abi/ERC20.json";
import { XER_TOKEN } from "../config/tokens";

export function useXerBalance(account) {
  const [balance, setBalance] = useState("0");

  useEffect(() => {
    async function load() {
      if (!account || !window.ethereum) return;

      const provider = new BrowserProvider(window.ethereum);
      const token = new Contract(
        XER_TOKEN.address,
        ERC20_ABI,
        provider
      );

      const raw = await token.balanceOf(account);
      setBalance(formatUnits(raw, XER_TOKEN.decimals));
    }

    load();
  }, [account]);

  return balance;
}
