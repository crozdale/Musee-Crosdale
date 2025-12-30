
import { getVaults } from "../registry/artworkRegistry";

export default function Admin() {
  const vaults = getVaults();

  return (
    <div className="admin">
      <h1>Vault Administration</h1>

      {vaults.map(v => (
        <div key={v.id} className="admin-card">
          <h3>{v.title}</h3>

          <button>Mint Fractions</button>
          <button>Pause Trading</button>
          <button>Update Metadata</button>
        </div>
      ))}
    </div>
  );
}
