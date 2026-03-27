import { useTranslation } from "react-i18next";
import { CHAINS } from "../chains/chains";
import { useChain } from "../hooks/useChain";

export default function ChainGuard({ children }) {
  const { t } = useTranslation();
  const chainId = useChain();

  if (!chainId) return null;

  if (!CHAINS[chainId]) {
    return (
      <main className="app-main">
        <h2>{t("wallet.unsupported_network", "Unsupported Network")}</h2>
        <p>{t("wallet.switch_network", "Please switch to a supported chain.")}</p>
      </main>
    );
  }

  return children;
}
