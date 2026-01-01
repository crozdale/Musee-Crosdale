import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Vaults from "./pages/Vaults";
import VaultDetail from "./pages/VaultDetail";
import Swap from "./pages/Swap";
import Legal from "./pages/Legal";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/vaults" element={<Vaults />} />
        <Route path="/vaults/:vaultId" element={<VaultDetail />} />
        <Route path="/swap" element={<Swap />} />
        <Route path="/legal" element={<Legal />} />
      </Route>
    </Routes>
  );
}

export default App;
