import { createContext, useContext } from "react";

const I18nContext = createContext({
  locale: "en",
  t: (key) => key,
});

export function I18nProvider({ children }) {
  return (
    <I18nContext.Provider
      value={{
        locale: "en",
        t: (key) => key,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
