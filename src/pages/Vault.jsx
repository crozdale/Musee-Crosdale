import { VAULTS } from "../registry/vaultRegistry";

export default function Vault() {
  return (
    <div className="px-10 py-16 space-y-10">
      {VAULTS.map((vault) => (
        <div
          key={vault.id}
          className="border p-6 flex justify-between items-center"
        >
          <div>
            <h2 className="text-2xl font-serif">{vault.title}</h2>
            <p className="text-sm text-black/70">{vault.artist}</p>
            <p className="text-sm text-black/50">{vault.vaultType}</p>
          </div>

          <a
            href={vault.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            View on XDALE
          </a>
        </div>
      ))}
    </div>
  );
}
