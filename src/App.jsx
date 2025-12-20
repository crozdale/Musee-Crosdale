import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";

import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Vault from "./pages/Vault";
import VaultDetail from "./pages/VaultDetail";
import Swap from "./pages/Swap";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/vault" element={<Vault />} />
        <Route path="/vault/:vaultId" element={<VaultDetail />} />
        <Route path="/swap" element={<Swap />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
