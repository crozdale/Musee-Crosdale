import { Link } from "react-router-dom";

export default function ActionLink({ to, children }) {
  return (
    <Link
      to={to}
      className="
        inline-flex items-center
        rounded-lg
        border border-blue-500/30
        bg-blue-50
        px-3 py-1.5
        text-sm font-semibold
        text-blue-700
        hover:bg-blue-100
        hover:border-blue-600/40
        transition
      "
    >
      {children}
    </Link>
  );
}
