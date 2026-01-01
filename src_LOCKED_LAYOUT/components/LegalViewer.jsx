export default function LegalViewer({ pdf, hash }) {
  return (
    <section className="legal-viewer">
      <h3>Legal Documentation</h3>

      <a
        href={pdf}
        target="_blank"
        rel="noopener noreferrer"
        className="btn"
      >
        View Signed PDF
      </a>

      <p className="hash">
        Document Hash: <code>{hash}</code>
      </p>
    </section>
  );
}
