export function shortenAddress(address, chars = 4) {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`;
}

export function formatNumber(value) {
  if (value === null || value === undefined) return "—";
  try {
    return Number(value).toLocaleString();
  } catch {
    return String(value);
  }
}

export function formatChain(chainId) {
  if (!chainId) return "—";
  if (chainId === 137) return "Polygon";
  if (chainId === 1) return "Ethereum";
  return `Chain ${chainId}`;
}
