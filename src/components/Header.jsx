export default function Header() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        padding: "16px 32px",
        borderBottom: "1px solid #222",
        background: "#000",
      }}
    >
      <img
        src="/logo-gold.png"
        alt="Facinations"
        height="42"
        style={{ marginRight: 16 }}
      />
      <h1 style={{ color: "#d4af37", fontWeight: 500 }}>
        Facinations
      </h1>
    </header>
  );
}
