// Server-only lead delivery adapter. Runs in the Astro API route (src/pages/api/enquiry.ts),
// never in the browser, so it is safe to read secret environment variables here.
//
// Behaviour:
//  - If CRM_WEBHOOK_URL is set, the lead is POSTed there (bring-your-own CRM / Zapier / Make /
//    Google Sheets webhook / serverless function).
//  - If it is NOT set (the default in local development), the lead is printed to the server
//    console so you can confirm the form works end-to-end without a real CRM connected.
//  - This console fallback is not a production lead pipeline — configure CRM_WEBHOOK_URL
//    before launch. Uses no Node-specific APIs, so it runs unmodified on Vercel, Cloudflare
//    Pages/Workers, or any other Astro deployment target.

export type LeadPayload = {
  fullName: string;
  mobileNumber: string;
  email: string;
  propertyInterest: string;
  preferredUnitType: string;
  preferredContactMethod: string;
  preferredViewingDate: string;
  message: string;
  consentEnquiry: boolean;
  consentMarketing: boolean;
  consentTimestamp: string;
  attribution: {
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    utm_term: string | null;
    utm_content: string | null;
    gclid: string | null;
    gbraid: string | null;
    wbraid: string | null;
    landingPageUrl: string | null;
    referrer: string | null;
  };
  submittedAt: string;
};

export type LeadDeliveryResult = { delivered: boolean; mode: "crm" | "console-log"; error?: string };

export async function deliverLead(
  lead: LeadPayload,
  env: Record<string, string | undefined>
): Promise<LeadDeliveryResult> {
  const webhookUrl = env.CRM_WEBHOOK_URL;

  if (webhookUrl) {
    try {
      const headers = {
        "Content-Type": "application/json",
        ...(env.CRM_WEBHOOK_SECRET ? { Authorization: `Bearer ${env.CRM_WEBHOOK_SECRET}` } : {}),
      };
      const body = JSON.stringify(lead);

      // Some webhook targets (notably Google Apps Script) execute the request synchronously
      // on this initial POST, then reply with a 302 to a one-time content URL holding the
      // response body. That redirect target only accepts GET, so we let fetch()'s default
      // "follow" redirect mode handle it (which auto-downgrades the follow-up to GET per the
      // Fetch spec) rather than forcing POST, which the target would reject with 405.
      const response = await fetch(webhookUrl, { method: "POST", headers, body });

      if (!response.ok) {
        return { delivered: false, mode: "crm", error: `CRM webhook responded with ${response.status}` };
      }
      return { delivered: true, mode: "crm" };
    } catch (err) {
      return { delivered: false, mode: "crm", error: err instanceof Error ? err.message : "Unknown error" };
    }
  }

  // Local development fallback — clearly not a production delivery mechanism.
  console.log("[lead]", JSON.stringify(lead));
  return { delivered: true, mode: "console-log" };
}
