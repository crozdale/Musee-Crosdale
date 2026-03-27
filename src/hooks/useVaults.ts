/**
 * Compatibility shim — kept so legacy import paths (`../hooks/useVaults`)
 * continue to resolve. The real implementation (subgraph + registry merge) is:
 *   src/features/vaults/hooks/useVaults.ts
 */
export { useVaults } from "../features/vaults/hooks/useVaults";
