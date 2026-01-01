import { Link } from "react-router-dom";
import { GALLERY_ITEMS } from "../data/gallery";

export default function GalleryPanel() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {GALLERY_ITEMS.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm"
        >
          <h3 className="font-serif text-xl font-semibold">
            {item.title}
          </h3>
          <p className="mt-1 text-sm text-black/70">
            {item.artist} · {item.year}
          </p>
          <p className="mt-3 text-sm text-black/60">
            {item.medium}
          </p>

          <div className="mt-4 flex gap-3">
            <a
              href={item.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-black/70 underline"
            >
              View on XdaleGallery
            </a>
            <Link
              to={`/vault/${item.id}`}
              className="text-sm font-semibold text-black/70 underline"
            >
              Open Vault
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
