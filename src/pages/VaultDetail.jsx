import { Link, useParams } from "react-router-dom";
import { VAULTS } from "../registry/vaultRegistry";

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-medium text-black/80">
      {children}
    </span>
  );
}

function Panel({ title, children }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm">
      <h3 className="font-serif text-lg font-semibold">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ExternalLink({ href, label }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black/80 shadow-sm"
    >
      {label}
      <span className="text-black/50">↗</span>
    </a>
  );
}

export default function VaultDetail() {
  const { vaultId } = useParams();
  const vault = VAULTS.find((v) => v.id === vaultId);

  if (!vault) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-2xl border border-black/10 bg-white/80 p-8 text-center shadow-sm">
          <h1 className="font-serif text-2xl font-semibold">Vault not found</h1>
          <p className="mt-3 text-black/70">
            No vault with id{" "}
            <span className="font-mono text-black/80">{vaultId}</span>
          </p>
          <Link
            to="/vault"
            className="mt-6 inline-block rounded-xl border border-black/10 bg-white px-5 py-2 text-sm font-semibold shadow-sm"
          >
            Back to Vault Index
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between">
          <div>
            <Link
              to="/vault"
              className="text-sm font-medium text-black/60"
            >
              ← Back to Vault Index
            </Link>

            <h1 className="mt-3 font-serif text-3xl md:text-4xl font-bold">
              {vault.title}
            </h1>

            <p className="mt-1 text-black/70">{vault.artist}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge>{vault.vaultType || "Vault"}</Badge>
              <Badge>Chain {vault.network}</Badge>
              <Badge>Status: {vault.status || "unknown"}</Badge>
            </div>
          </div>

          <div className="flex gap-3">
            <ExternalLink
              href={vault.externalUrl}
              label="View on XdaleGallery.com"
            />
            <ExternalLink
              href={vault.marketplaceUrl}
              label="View on Marketplace"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Panel title="Vault Reference">
            <div className="space-y-4 text-sm text-black/70">
              <div>
                <div className="text-xs font-semibold text-black/50">Vault ID</div>
                <div className="font-mono text-black/80">{vault.id}</div>
              </div>

              <div>
                <div className="text-xs font-semibold text-black/50">Contract</div>
                <div className="font-mono break-all text-black/80">
                  {vault.contract || "—"}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-black/50">Network</div>
                <div className="text-black/80">{vault.network}</div>
              </div>
            </div>
          </Panel>

          <div className="lg:col-span-2 space-y-6">
            <Panel title="On-Chain Metrics">
              <div className="grid grid-cols-3 gap-4">
                <div className="border border-black/10 rounded-xl p-4">
                  <div className="text-xs text-black/50">Total Supply</div>
                  <div className="text-2xl font-serif">—</div>
                </div>
                <div className="border border-black/10 rounded-xl p-4">
                  <div className="text-xs text-black/50">Price</div>
                  <div className="text-2xl font-serif">—</div>
                </div>
                <div className="border border-black/10 rounded-xl p-4">
                  <div className="text-xs text-black/50">Liquidity</div>
                  <div className="text-2xl font-serif">—</div>
                </div>
              </div>
            </Panel>

            <Panel title="Actions">
              <div className="flex gap-3">
                <button disabled className="px-5 py-2 border rounded-xl text-black/40">
                  Buy Fractions
                </button>
                <button disabled className="px-5 py-2 border rounded-xl text-black/40">
                  Redeem / Claim
                </button>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}
