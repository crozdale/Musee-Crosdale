// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing.jsx";
import Home from "./pages/Home.jsx";
import Gallery from "./pages/Gallery.jsx";
import Collection from "./pages/Collection.jsx";
import CollectionExchange from "./pages/CollectionExchange.jsx";
import Vaults from "./pages/Vaults.jsx";
import Whitepaper from "./pages/Whitepaper.jsx";
import BlogazineRedirect from "./pages/BlogazineRedirect.jsx";
// import NotFound from "./NotFound.tsx"; // still unused

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home-legacy" element={<Home />} />

        <Route path="/gallery" element={<Gallery />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/exchange" element={<CollectionExchange />} />
        <Route path="/vaults" element={<Vaults />} />

        <Route path="/whitepaper" element={<Whitepaper />} />
        <Route path="/blogazine" element={<BlogazineRedirect />} />
      </Routes>
    </Router>
  );
}
