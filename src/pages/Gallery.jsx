export default function Gallery() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <header className="text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-bold">
          Gallery
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-black/70">
          Curated fine-art works referenced by Façinations™.
        </p>
      </header>

      <section className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm">
          <h3 className="font-serif text-xl font-semibold">
            Untitled Study I
          </h3>
          <p className="mt-1 text-sm text-black/70">
            Artist Name · 2024
          </p>
          <p className="mt-4 text-sm text-black/60">
            Referenced artwork prepared for vaulting.
          </p>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm">
          <h3 className="font-serif text-xl font-semibold">
            Additional Works
          </h3>
          <p className="mt-1 text-sm text-black/70">
            Placeholder
          </p>
          <p className="mt-4 text-sm text-black/60">
            Further artworks will appear here.
          </p>
        </div>
      </section>
    </div>
  );
}
