// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Gallery from "./pages/Gallery";
import Vaults from "./pages/Vaults";
import VaultDetail from "./pages/VaultDetail";
import Studio from "./pages/Studio";
import Swap from "./pages/Swap";
import About from "./pages/About";
import Architecture from "./pages/Architecture";
import Legal from "./pages/Legal";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Musee Crosdale landing: four quadrants + Dealer Intelligence */}
          <Route path="/" element={<Landing />} />
          
          <Route path="/" element={<Home />}  />}
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/vaults" element={<Vaults />} />
           <Route path="/vaults/:vaultId" element={<VaultDetail />} />
          <Route path="/swap" element={<Swap />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/legal" element={<Legal />} />
        </Routes>
      </Layout>
    </Router>
  );
}