import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const STORAGE_KEY = "xv_ref";

/**
 * Returns true when the current session originated from xervault.com
 * (?ref=xervault). The flag is persisted for the browser session so it
 * survives page navigation within Musée-Crosdale.
 */
export function useXerVaultRef(): boolean {
  const [searchParams] = useSearchParams();
  const fromParam = searchParams.get("ref") === "xervault";

  useEffect(() => {
    if (fromParam) {
      try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch {}
    }
  }, [fromParam]);

  const fromStorage = (() => {
    try { return sessionStorage.getItem(STORAGE_KEY) === "1"; } catch { return false; }
  })();

  return fromParam || fromStorage;
}
