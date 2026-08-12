import type { APIRoute } from "astro";
import { validateEnquiry, type EnquiryFormData } from "@/utils/validation";
import { deliverLead, type LeadPayload } from "@/utils/leadAdapter";

// This route runs on-demand (see astro.config.mjs `output: "hybrid"` + this file's
// `prerender = false`), so it can perform server-side validation and lead delivery.
export const prerender = false;

type RequestBody = EnquiryFormData & {
  attribution?: Partial<LeadPayload["attribution"]>;
};

// Simple in-memory rate limiting per server instance. On serverless platforms each
// instance has its own memory, so this is a best-effort guard, not a hard limit — for
// production-grade protection, add a shared store (e.g. Upstash Redis) or a WAF rule.
// See FORM_RATE_LIMIT_WINDOW_SECONDS / FORM_RATE_LIMIT_MAX_SUBMISSIONS in .env.example.
const submissionLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const windowMs = Number(process.env.FORM_RATE_LIMIT_WINDOW_SECONDS ?? 60) * 1000;
  const maxSubmissions = Number(process.env.FORM_RATE_LIMIT_MAX_SUBMISSIONS ?? 3);
  const now = Date.now();
  const timestamps = (submissionLog.get(ip) ?? []).filter((t) => now - t < windowMs);
  timestamps.push(now);
  submissionLog.set(ip, timestamps);
  return timestamps.length > maxSubmissions;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400 });
  }

  if (isRateLimited(clientAddress ?? "unknown")) {
    return new Response(JSON.stringify({ error: "Too many submissions. Please try again shortly." }), {
      status: 429,
    });
  }

  const errors = validateEnquiry(body);
  if (body.honeypot && body.honeypot.trim() !== "") {
    // Silently accept without delivering the lead — bots receive a normal-looking response.
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }
  if (Object.keys(errors).length > 0) {
    return new Response(JSON.stringify({ error: "Validation failed", fields: errors }), { status: 422 });
  }

  const lead: LeadPayload = {
    fullName: body.fullName,
    mobileNumber: body.mobileNumber,
    email: body.email ?? "",
    propertyInterest: body.propertyInterest,
    preferredUnitType: body.preferredUnitType,
    preferredContactMethod: body.preferredContactMethod,
    preferredViewingDate: body.preferredViewingDate,
    message: body.message ?? "",
    consentEnquiry: body.consentEnquiry,
    consentMarketing: body.consentMarketing,
    consentTimestamp: new Date().toISOString(),
    attribution: {
      utm_source: body.attribution?.utm_source ?? null,
      utm_medium: body.attribution?.utm_medium ?? null,
      utm_campaign: body.attribution?.utm_campaign ?? null,
      utm_term: body.attribution?.utm_term ?? null,
      utm_content: body.attribution?.utm_content ?? null,
      gclid: body.attribution?.gclid ?? null,
      gbraid: body.attribution?.gbraid ?? null,
      wbraid: body.attribution?.wbraid ?? null,
      landingPageUrl: body.attribution?.landingPageUrl ?? null,
      referrer: body.attribution?.referrer ?? null,
    },
    submittedAt: new Date().toISOString(),
  };

  const result = await deliverLead(lead);

  if (!result.delivered) {
    return new Response(JSON.stringify({ error: "Lead delivery failed" }), { status: 502 });
  }

  return new Response(JSON.stringify({ success: true, mode: result.mode }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
