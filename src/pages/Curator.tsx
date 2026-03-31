import MistralWidget from "../components/MistralWidget";
import VoiceAICurator from "../components/VoiceAICurator";
import { useTranslation } from "react-i18next";
import { useMeta } from "../hooks/useMeta";

export default function Curator() {
  const { t } = useTranslation();
  useMeta({
    title: t("curator.meta_title", "AI Curator — Musée-Crosdale"),
    description: t("curator.meta_description", "Intelligent art insights powered by AI. Analyse artworks, explore the collection, and get curatorial guidance."),
  });

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a1a", color: "#f2ece0", padding: "4rem 2rem" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <p style={{ fontFamily: "'Cinzel',serif", fontSize: "0.55rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(212,175,55,0.55)", marginBottom: "1rem" }}>
          {t("common.partners_eyebrow", "Facinations · Partners")}
        </p>
        <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 400, color: "#f2ece0", letterSpacing: "0.1em", margin: "0 0 0.75rem" }}>
          {t("curator.heading", "AI Curator")}
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", color: "#8a8278", fontSize: "1.05rem", marginBottom: "3rem" }}>
          {t("curator.subtitle", "Intelligent art insights — analyse any work in the collection.")}
        </p>
        <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "1fr" }}>
          <MistralWidget />
          <VoiceAICurator />
        </div>
      </div>
    </div>
  );
}
