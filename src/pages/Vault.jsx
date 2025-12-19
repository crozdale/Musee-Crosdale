import { VAULTS } from "../registry/vaultRegistry";
import FractionPanel from "../components/FractionPanel";

export default function Vault() {
  return (
    <div className="px-10 py-16 space-y-12">
      {VAULTS.map((vault) => (
        <div key={vault.id} className="space-y-6">
          <div className="border p-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-serif">{vault.title}</h2>
              <p className="text-sm text-black/70">{vault.artist}</p>
              <p className="text-sm text-black/50">{vault.vaultType}</p>
            </div>
          </div>

          <FractionPanel vaultId={vault.id} />
        </div>
      ))}
    </div>
  );
}
