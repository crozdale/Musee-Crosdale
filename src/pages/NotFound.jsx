import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24 text-center">
      <h1 className="font-serif text-4xl font-bold">
        Page not found
      </h1>

      <p className="mt-4 text-black/70">
        The page you are looking for does not exist.
      </p>

      <Link
        to="/"
        className="mt-8 inline-block rounded-xl border border-black/10 bg-white px-6 py-3 text-sm font-semibold shadow-sm"
      >
        Return Home
      </Link>
    </div>
  );
}
