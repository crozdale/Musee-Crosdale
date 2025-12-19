import { GALLERY } from "../data/gallery";

export default function Gallery() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-10 py-16">
      {GALLERY.map((item) => (
        <a
          key={item.id}
          href={item.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block border p-6 hover:shadow-md transition"
        >
          <img
            src={item.image}
            alt={item.title}
            className="mb-4 w-full object-cover"
          />

          <h2 className="text-xl font-serif">{item.title}</h2>
          <p className="text-sm text-black/70">{item.artist}</p>
          <p className="text-sm text-black/50">{item.year}</p>
        </a>
      ))}
    </div>
  );
}
