import "../styles/layout.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Facinations</p>
      <p>All works registered in the Canonical Vault Registry</p>
    </footer>
  );
}
