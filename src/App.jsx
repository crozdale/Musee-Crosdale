import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Vaults from "./pages/Vaults";

export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <main style={{ padding: "24px" }}>
        <Routes>
          <Route path="/" element={<Vaults />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
