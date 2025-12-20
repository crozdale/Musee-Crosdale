import { createContext, useContext } from "react";

const Web3Context = createContext({
  provider: null,
  account: null,
  chainId: null,
});

export function Web3Provider({ children }) {
  return (
    <Web3Context.Provider
      value={{
        provider: null,
        account: null,
        chainId: null,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}
