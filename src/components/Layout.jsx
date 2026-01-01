import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout() {
  return (
    <>
      <Header />
      <main style={{ minHeight: "100vh", backgroundColor: "#000" }}>
        <Outlet />
      </main>
    </>
  );
}
