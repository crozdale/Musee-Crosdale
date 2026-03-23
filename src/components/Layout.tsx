import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}