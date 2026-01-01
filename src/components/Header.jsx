import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Header.css";
import logo from "../assets/logo.png";

export default function Header() {
  const { t, i18n } = useTranslation();

  return (
    <header className="nav">
      <div className="left">
        <Link to="/" className="logo-wrap">
          <img src={logo} alt="XDALE" className="logo" />
        </Link>

        <nav>
          <Link to="/">{t("home")}</Link>
          <Link to="/gallery">{t("gallery")}</Link>
          <Link to="/vaults">{t("vaults")}</Link>
          <Link to="/swap">{t("swap")}</Link>
          <Link to="/legal">{t("legal")}</Link>
        </nav>
      </div>

      <div className="right">
        <button className="wallet-btn">Connect Wallet</button>

        <button
          className="lang-btn"
          onClick={() =>
            i18n.changeLanguage(i18n.language === "en" ? "fr" : "en")
          }
        >
          🌐 {i18n.language.toUpperCase()}
        </button>
      </div>
    </header>
  );
}
