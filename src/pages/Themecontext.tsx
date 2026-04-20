// src/context/ThemeContext.tsx
// Global light/dark theme context.
// Pages opt in by calling useTheme() and applying the returned className.
// Pages that don't call useTheme() are unaffected — they keep their own styling.

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggle: () => {},
  isDark: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem("fac-theme") as Theme) ?? "light";
    } catch {
      return "light";
    }
  });

  const toggle = useCallback(() => {
    setTheme((t) => {
      const next: Theme = t === "light" ? "dark" : "light";
      try { localStorage.setItem("fac-theme", next); } catch {}
      return next;
    });
  }, []);

  // Keep a data-theme attribute on <html> for any global CSS that wants it
  useEffect(() => {
    document.documentElement.setAttribute("data-fac-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle, isDark: theme === "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ── useTheme ──────────────────────────────────────────────────────────────────
// Call this in any page that wants to respond to the theme toggle.
//
// Usage in a page that supports theming:
//
//   import { useTheme } from "../context/ThemeContext";
//
//   export default function MyPage() {
//     const { isDark } = useTheme();
//     return (
//       <div style={{
//         background: isDark ? "#18160f" : "#faf8f4",
//         color:      isDark ? "#f2ece0" : "#1a1814",
//       }}>
//         ...
//       </div>
//     );
//   }
//
// Pages that don't call useTheme() are completely unaffected.

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
