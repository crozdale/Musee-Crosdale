// Infura key is read from VITE_INFURA_KEY (set in .env.local / Vercel dashboard).
// Never hardcode the key here.
const INFURA = import.meta.env.VITE_INFURA_KEY as string | undefined;

function infuraRpc(network: string) {
  return INFURA
    ? `https://${network}.infura.io/v3/${INFURA}`
    : "";
}

function infuraWs(network: string) {
  return INFURA
    ? `wss://${network}.infura.io/ws/v3/${INFURA}`
    : "";
}

export const CHAINS: Record<number, { id: number; name: string; rpc: string; ws: string; subgraph: string }> = {
  // Ethereum mainnet
  1: {
    id: 1,
    name: "Ethereum",
    rpc: infuraRpc("mainnet"),
    ws:  infuraWs("mainnet"),
    subgraph: "https://api.thegraph.com/subgraphs/name/facinations/mainnet",
  },
  // Polygon
  137: {
    id: 137,
    name: "Polygon",
    rpc: "https://polygon-rpc.com",
    ws:  infuraWs("polygon-mainnet"),
    subgraph: "https://api.thegraph.com/subgraphs/name/facinations/polygon",
  },
  // Sepolia testnet — active deployment
  11155111: {
    id: 11155111,
    name: "Sepolia",
    rpc: infuraRpc("sepolia"),
    ws:  infuraWs("sepolia"),
    subgraph: "https://api.studio.thegraph.com/query/1722298/facinations/v0.0.2",
  },
};
