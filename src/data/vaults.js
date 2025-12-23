
// Canonical vault registry
// This file is authoritative for:
// - Vault metadata
// - Legal document declaration
// - CI hash verification

export const VAULTS = [
  {
    // Router / UI identifier
    id: "albatrix-001",

    // Filesystem + legal namespace
    vaultId: "VAULT-ALBATRIX-001",

    // Display metadata
    title: "Albatrix I",
    artist: "Artist Name",

    // Legal configuration (UK-only for v1.0)
    legal: {
      default: "UK",

      packs: {
        UK: {
          label: "United Kingdom",
          version: "v1.0",
          filename: "Legal-Pack-UK-VAULT-ALBATRIX-001-v1.0.pdf",
          sha256:
            "3f2d6e7a1c9b8f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2",
        },
      },
    },
  },
];
