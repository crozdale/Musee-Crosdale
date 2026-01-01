import { Link } from "react-router-dom";
import "./Header.css";
import logo from "../assets/logo.png";

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="logo-wrap">
          <img
            src={logo}
            alt="XDALE"
            className="logo"
          />
        </Link>
<button className="wallet-btn">Connect Wallet</button>

        <nav className="site-nav">
          <Link to="/">Home</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/vaults">Vaults</Link>
          <Link to="/swap">Swap</Link>
          <Link to="/legal">Legal</Link>
        </nav>
      </div>
    </header>
  );
}
