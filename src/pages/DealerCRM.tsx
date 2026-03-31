import { useTranslation } from "react-i18next";
import { useMeta } from "../hooks/useMeta";

const HUBSPOT_PORTAL = "1611965";
const HUBSPOT_BASE = `https://app.hubspot.com/contacts/${HUBSPOT_PORTAL}`;

const LINKS = [
  { labelKey: "dealer_crm.contacts", label: "Contacts", descKey: "dealer_crm.contacts_desc", desc: "Browse and manage collector & dealer contacts", href: `${HUBSPOT_BASE}/contacts/list/view/all/` },
  { labelKey: "dealer_crm.deals", label: "Deals Pipeline", descKey: "dealer_crm.deals_desc", desc: "Track active opportunities and pipeline value", href: `${HUBSPOT_BASE}/deals/` },
  { labelKey: "dealer_crm.sequences", label: "Email Sequences", descKey: "dealer_crm.sequences_desc", desc: "Automated nurture sequences for collectors", href: `${HUBSPOT_BASE}/sequences/` },
  { labelKey: "dealer_crm.tasks", label: "Tasks", descKey: "dealer_crm.tasks_desc", desc: "Follow-up tasks and activity queue", href: `${HUBSPOT_BASE}/tasks/` },
  { labelKey: "dealer_crm.reports", label: "Reports", descKey: "dealer_crm.reports_desc", desc: "Pipeline and revenue analytics", href: `${HUBSPOT_BASE}/reports-list/` },
];

export default function DealerCRM() {
  const { t } = useTranslation();
  useMeta({
    title: t("dealer_crm.meta_title", "Dealer CRM — Musée-Crosdale"),
    description: t("dealer_crm.meta_description", "Client and deal management for Facinations dealers."),
  });

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a1a", color: "#f2ece0", padding: "4rem 2rem" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <p style={{ fontFamily: "'Cinzel',serif", fontSize: "0.55rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(212,175,55,0.55)", marginBottom: "1rem" }}>
          {t("common.partners_eyebrow", "Facinations · Partners")}
        </p>
        <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 400, color: "#f2ece0", letterSpacing: "0.1em", margin: "0 0 0.75rem" }}>
          {t("dealer_crm.heading", "Dealer CRM")}
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", color: "#8a8278", fontSize: "1.05rem", marginBottom: "3rem" }}>
          {t("dealer_crm.subtitle", "Client & deal management via HubSpot CRM — Portal {{portal}}.", { portal: HUBSPOT_PORTAL })}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem 1.25rem",
                background: "rgba(212,175,55,0.03)",
                border: "1px solid rgba(212,175,55,0.12)",
                borderLeft: "2px solid rgba(212,175,55,0.35)",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(212,175,55,0.07)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(212,175,55,0.03)"; }}
            >
              <div>
                <p style={{ fontFamily: "'Cinzel',serif", fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#d4af37", margin: 0 }}>
                  {t(link.labelKey, link.label)}
                </p>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.9rem", color: "#8a8278", margin: "0.2rem 0 0", fontStyle: "italic" }}>
                  {t(link.descKey, link.desc)}
                </p>
              </div>
              <span style={{ color: "rgba(212,175,55,0.4)", fontSize: "0.8rem" }}>↗</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
