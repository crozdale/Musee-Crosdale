import { createContext, useContext } from "react";

const ComplianceContext = createContext({
  allowed: true,
  region: "global",
  reason: null,
});

export function ComplianceProvider({ children }) {
  return (
    <ComplianceContext.Provider
      value={{
        allowed: true,
        region: "global",
        reason: null,
      }}
    >
      {children}
    </ComplianceContext.Provider>
  );
}

export function useCompliance() {
  return useContext(ComplianceContext);
}
