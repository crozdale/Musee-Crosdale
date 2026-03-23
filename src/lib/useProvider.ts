import { useEffect, useState } from "react";
import { ethers } from "ethers";

export function useProvider() {
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const p = new ethers.BrowserProvider(window.ethereum);
      setProvider(p);
    }
  }, []);

  return provider;
}
