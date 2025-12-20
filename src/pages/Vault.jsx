import { Link } from "react-router-dom";
import { VAULTS } from "../registry/vaultRegistry";
import ActionLink from "../components/ActionLink";

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs font-medium text-black/70">
      {children}
    </span>
  );
}

function StatusBadge({ status }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs font-semibold text-black/70">
      {status || "unknown"}
    </span>
  );
}

function VaultCard({ vault }) {
  return (
    <div className="relative w-full ma
