// Server-only lead delivery adapter. Runs in the Astro API route (src/pages/api/enquiry.ts),
// never in the browser, so it is safe to read secret environment variables here.
//
// Behaviour:
//  - If CRM_WEBHOOK_URL is set, the lead is POSTed there (bring-your-own CRM / Zapier / Make /
//    Google Sheets webhook / serverless function).
//  - If it is NOT set (the default in local development), the lead is printed to the server
//    console so you can confirm the form works end-to-end without a real CRM connected.
//  - Independently of the above, if EMAIL_SERVICE_API_KEY and NOTIFY_EMAIL_TO are both set the
//    lead is also emailed via Resend. Email runs alongside the webhook rather than instead of
//    it, so a webhook outage does not silently lose the enquiry — and vice versa.
//  - This console fallback is not a production lead pipeline — configure CRM_WEBHOOK_URL
//    before launch. Uses no Node-specific APIs, so it runs unmodified on Vercel, Cloudflare
//    Pages/Workers, or any other Astro deployment target.

export type LeadPayload = {
  fullName: string;
  mobileNumber: string;
  propertyInterest: string;
  preferredUnitTypes: string[];
  interests: string[];
  message: string;
  consent: boolean;
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

export type LeadDeliveryResult = {
  delivered: boolean;
  mode: "crm" | "console-log";
  error?: string;
  /** Email is a parallel channel; it never decides overall success on its own. */
  emailDelivered?: boolean;
  emailError?: string;
};

function leadToEmailHtml(lead: LeadPayload): string {
  const row = (label: string, value: string) =>
    value ? `<tr><td style="padding:4px 12px 4px 0;color:#555;">${label}</td><td style="padding:4px 0;">${value}</td></tr>` : "";
  const a = lead.attribution;
  return [
    `<h2 style="margin:0 0 12px;">New enquiry — ${lead.propertyInterest}</h2>`,
    '<table style="border-collapse:collapse;font-family:system-ui,sans-serif;font-size:14px;">',
    row("Name", lead.fullName),
    row("Mobile", lead.mobileNumber),
    row("Unit types", lead.preferredUnitTypes.join(", ")),
    row("Interested in", lead.interests.join(", ")),
    row("Message", lead.message),
    row("Consent given", lead.consent ? `Yes (${lead.consentTimestamp})` : "No"),
    row("Submitted", lead.submittedAt),
    row("Landing page", a.landingPageUrl ?? ""),
    row("Referrer", a.referrer ?? ""),
    row("utm_source", a.utm_source ?? ""),
    row("utm_medium", a.utm_medium ?? ""),
    row("utm_campaign", a.utm_campaign ?? ""),
    row("gclid", a.gclid ?? ""),
    "</table>",
  ].join("");
}

/**
 * Emails the lead via Resend. Returns a result rather than throwing: a failure here must not
 * stop the webhook delivery from being reported as successful.
 */
async function deliverViaEmail(
  lead: LeadPayload,
  env: Record<string, string | undefined>
): Promise<{ delivered: boolean; error?: string }> {
  const apiKey = env.EMAIL_SERVICE_API_KEY;
  const to = env.NOTIFY_EMAIL_TO;
  if (!apiKey || !to) return { delivered: false, error: "not configured" };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        from: env.NOTIFY_EMAIL_FROM ?? "Lentor Gardens Residences Enquiries <onboarding@resend.dev>",
        to: [to],
        subject: `New enquiry: ${lead.fullName} — ${lead.propertyInterest}`,
        html: leadToEmailHtml(lead),
      }),
    });
    if (!response.ok) {
      const bodyText = await response.text().catch(() => "");
      return { delivered: false, error: `Resend ${response.status}: ${bodyText}` };
    }
    return { delivered: true };
  } catch (err) {
    return { delivered: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function deliverLead(
  lead: LeadPayload,
  env: Record<string, string | undefined>
): Promise<LeadDeliveryResult> {
  const webhookUrl = env.CRM_WEBHOOK_URL;

  // Start the email immediately so it overlaps the webhook round trip rather than following it.
  const emailPromise = deliverViaEmail(lead, env);

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
  const email = await emailPromise;
  console.log("[lead]", JSON.stringify(lead));
  return { delivered: true, mode: "console-log", emailDelivered: email.delivered, emailError: email.error };
}
