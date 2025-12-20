import { Outlet, NavLink, Link } from "react-router-dom";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? "text-sm font-semibold text-white"
          : "text-sm font-semibold text-white/70 hover:text-white"
      }
    >
      {children}
    </NavLink>
  );
}

export default function Layout() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4">
            {/* XDALE Sigil (actual file you have) */}
            <img
              src="/logos/XDALE Sigil.png"
              alt="XDALE Sigil"
              style={{ height: 38 }}
            />

            {/* Façinations Wordmark (actual file you have) */}
            <img
              src="/logos/Facinations.png"
              alt="Façinations"
              style={{ height: 28 }}
            />
          </Link>

          <nav className="flex items-center gap-6">
            <NavItem to="/gallery">Gallery</NavItem>
            <NavItem to="/vault">Vault</NavItem>
            <NavItem to="/swap">Swap</NavItem>


          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-white/10 mt-20">
        <div className="mx-auto max-w-7xl px-6 py-6 text-sm text-white/50">
          © {new Date().getFullYear()} Xdale · Façinations™
        </div>
      </footer>
    </div>
  );
}
