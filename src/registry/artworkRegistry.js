export const VAULTS = [
  {
    id: "VAULT-ALBATRIX-001",
    title: "Untitled Study I",
    artist: "Artist Name",
    year: 2024,
    medium: "Mixed Media",
    chain: "Polygon",
    vaultAddress: "0x0000000000000000000000000000000000000000",
    legalPdf: "/legal/Legal-Pack-ALBATRIX.pdf",
    fractionalized: true,
    totalFractions: 1000,
    availableFractions: 420
  }
];

export const getVaults = () => VAULTS;

export const getVaultById = (id) =>
  VAULTS.find(v => v.id === id);
