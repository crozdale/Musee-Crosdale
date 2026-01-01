import { Link } from "react-router-dom";
import { vaults } from "../data/vaults";

export default function Vaults() {
  return (
    <section className="page">
      <h1>Fractionalized Vaults</h1>

      <div className="vault-grid">
        {vaults.map(vault => (
          <Link
            key={vault.id}
            to={`/vaults/${vault.id}`}
            className="vault-card"
          >
            <h2>{vault.title}</h2>
            <p>{vault.description}</p>
            <span>Status: {vault.status}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
