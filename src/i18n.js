import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      home: "Home",
      gallery: "Gallery",
      vaults: "Vaults",
      swap: "Swap",
      legal: "Legal",
      connect: "Connect Wallet",
      description:
        "This is a curated digital platform for presenting, managing, and interacting with high-value or conceptually significant works of art."
    }
  },
  fr: {
    translation: {
      home: "Accueil",
      gallery: "Galerie",
      vaults: "Coffres",
      swap: "Échanger",
      legal: "Mentions légales",
      connect: "Connecter le portefeuille",
      description:
        "Plateforme numérique dédiée à la présentation et à la gestion d'œuvres d'art de grande valeur."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;
