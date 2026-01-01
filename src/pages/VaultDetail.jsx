import { useParams } from "react-router-dom";
import { vaults } from "../data/vaults";

export default function VaultDetail() {
  const { vaultId } = useParams();
  const vault = vaults.find(v => v.id === vaultId);

  if (!vault) {
    return <p>Vault not found.</p>;
  }

  return (
    <section className="page">
      <h1>{vault.title}</h1>
      <p><strong>Artist:</strong> {vault.artist}</p>
      <p><strong>Status:</strong> {vault.status}</p>
 рынок
      <p>{vault.description}</p>
    </section>
  );
}
