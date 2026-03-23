// src/features/vaults/registry/vaultRegistry.ts

export interface RegistryVault {
  vaultId: string;
  name: string;
  description: string;
  contractAddress: string;
  chainId: number;
  premiumRequired: boolean;
}

export const VAULTS: RegistryVault[] = [
  {
    vaultId: "VAULT-ALBATRIX-001",
    name: "Albatrix I",
    description: "Genesis fractionalized artwork vault.",
    contractAddress: "0x0000000000000000000000000000000000000000",
    chainId: 1,
    premiumRequired: true,
  },
  {
    vaultId: "VAULT-OPEN-ARCHIVE",
    name: "Open Archive",
    description: "Read-only provenance archive.",
    contractAddress: "0x0000000000000000000000000000000000000000",
    chainId: 1,
    premiumRequired: false,
  },
];
