// Client-side tracking helpers. All events push to window.dataLayer (GTM convention) and
// are gated on visitor consent (Google Consent Mode v2 shape). No PII is ever pushed here —
// forms send lead data server-side via the lead adapter, not through analytics events.
//
// IMPORTANT for the administrator: replace the placeholder IDs in .env before go-live, and do
// not enable enhanced conversions until consent collection, a privacy policy review, and
// server-side hashing (if used) have been implemented and reviewed.

export type ConsentState = {
  analytics_storage: "granted" | "denied";
  ad_storage: "granted" | "denied";
};

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

export function pushEvent(eventName: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...payload });
}

export function setConsent(state: ConsentState) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "consent_update", ...state });
  try {
    localStorage.setItem("consent-preferences", JSON.stringify(state));
  } catch {
    // localStorage unavailable (private browsing) — consent will be asked again next visit.
  }
}

export function getStoredConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("consent-preferences");
    return raw ? (JSON.parse(raw) as ConsentState) : null;
  } catch {
    return null;
  }
}

// Canonical event names used across this template — keep in sync with README tracking section.
export const trackingEvents = {
  viewProject: "view_project",
  clickWhatsapp: "click_whatsapp",
  clickCall: "click_call",
  bookShowflat: "book_showflat",
  requestPriceList: "request_price_list",
  requestFloorplans: "request_floorplans",
  viewBrochure: "view_brochure",
  requestBrochure: "request_brochure",
  downloadBrochure: "download_brochure",
  viewGallery: "view_gallery",
  formStart: "form_start",
  formError: "form_error",
  formSubmit: "form_submit",
  generateLead: "generate_lead",
} as const;
