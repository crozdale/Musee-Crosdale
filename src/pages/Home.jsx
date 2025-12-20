import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20 text-center">
      <h1 className="font-serif text-4xl md:text-5xl font-bold">
        From Art to Action
      </h1>

      <p className="mt-6 mx-auto max-w-3xl text-lg text-black/70">
        Façinations™ is a fine-art platform that vaults, references,
        and prepares cultural assets for on-chain liquidity.
      </p>

      <div className="mt-10 flex justify-center gap-6">
        <Link
          to="/gallery"
          className="rounded-xl border border-black/10 bg-white px-6 py-3 text-sm font-semibold shadow-sm"
        >
          View Gallery
        </Link>

        <Link
          to="/vault"
          className="rounded-xl border border-black/10 bg-white px-6 py-3 text-sm font-semibold shadow-sm"
        >
          Open Vaults
        </Link>
      </div>
    </div>
  );
}
