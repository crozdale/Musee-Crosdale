import { Web3Provider } from "./Web3Provider";
import { ThemeProvider } from "./ThemeProvider";
import { ComplianceProvider } from "./ComplianceProvider";
import { I18nProvider } from "./i18nProvider";

export default function AppProviders({ children }) {
  return (
    <Web3Provider>
      <ComplianceProvider>
        <ThemeProvider>
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
      </ComplianceProvider>
    </Web3Provider>
  );
}
