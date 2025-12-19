import { useEffect, useState } from "react";

export function useFraction(vaultId) {
  const [supply, setSupply] = useState("0");
  const [price, setPrice] = useState("0");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vaultId) return;

    // TEMP: mock data until contracts are wired
    setSupply("100000");
    setPrice("0.25");
    setLoading(false);
  }, [vaultId]);

  return { supply, price, loading };
}
