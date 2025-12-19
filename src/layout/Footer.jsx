import { xdaleUrl } from "../config/links";

export default function Footer() {
  return (
    <footer className="mt-20 border-t px-8 py-6 text-sm text-black/70">
      <div className="flex justify-between items-center">
        <span>© {new Date().getFullYear()} XDALE</span>

        <a
          href={xdaleUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          xdale.io
        </a>
      </div>
    </footer>
  );
}
