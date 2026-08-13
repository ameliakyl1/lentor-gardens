import type { APIRoute } from "astro";
import { validateEnquiry, type EnquiryFormData } from "@/utils/validation";
import { deliverLead, type LeadPayload } from "@/utils/leadAdapter";

// This route runs on-demand (see astro.config.mjs `output: "hybrid"` + this file's
// `prerender = false`), so it can perform server-side validation and lead delivery.
export const prerender = false;

type RequestBody = EnquiryFormData & {
  turnstileToken?: string;
  attribution?: Partial<LeadPayload["attribution"]>;
};

async function verifyTurnstile(
  token: string,
  ip: string,
  env: Record<string, string | undefined>
): Promise<boolean> {
  const secretKey = env.TURNSTILE_SECRET_KEY;
  if (!secretKey) return true; // Not configured — skip verification rather than block all submissions.

  const formData = new FormData();
  formData.append("secret", secretKey);
  formData.append("response", token);
  formData.append("remoteip", ip);

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });
    const result = (await response.json()) as { success: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}

// Simple in-memory rate limiting per server instance. On serverless platforms each
// instance has its own memory, so this is a best-effort guard, not a hard limit — for
// production-grade protection, add a shared store (e.g. Upstash Redis) or a WAF rule.
// See FORM_RATE_LIMIT_WINDOW_SECONDS / FORM_RATE_LIMIT_MAX_SUBMISSIONS in .env.example.
const submissionLog = new Map<string, number[]>();

function isRateLimited(ip: string, env: Record<string, string | undefined>): boolean {
  const windowMs = Number(env.FORM_RATE_LIMIT_WINDOW_SECONDS ?? 60) * 1000;
  const maxSubmissions = Number(env.FORM_RATE_LIMIT_MAX_SUBMISSIONS ?? 3);
  const now = Date.now();
  const timestamps = (submissionLog.get(ip) ?? []).filter((t) => now - t < windowMs);
  timestamps.push(now);
  submissionLog.set(ip, timestamps);
  return timestamps.length > maxSubmissions;
}

// Cloudflare Pages Functions expose secrets/vars via the request-scoped `locals.runtime.env`
// binding, not Node's `process.env` (which is empty at runtime on Workers). Falling back to
// `process.env` keeps this working under plain `astro dev` (no Cloudflare runtime present).
function getEnv(locals: App.Locals): Record<string, string | undefined> {
  const runtimeEnv = (locals as { runtime?: { env?: Record<string, string | undefined> } }).runtime?.env;
  return runtimeEnv ?? (process.env as Record<string, string | undefined>);
}

export const POST: APIRoute = async ({ request, clientAddress, locals }) => {
  const env = getEnv(locals);
  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400 });
  }

  if (isRateLimited(clientAddress ?? "unknown", env)) {
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

  const turnstileOk = await verifyTurnstile(body.turnstileToken ?? "", clientAddress ?? "unknown", env);
  if (!turnstileOk) {
    return new Response(JSON.stringify({ error: "Verification failed. Please try again." }), { status: 403 });
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

  const result = await deliverLead(lead, env);

  if (!result.delivered) {
    console.error("[enquiry] Lead delivery failed:", result.mode, result.error);
    return new Response(JSON.stringify({ error: "Lead delivery failed" }), { status: 502 });
  }

  return new Response(JSON.stringify({ success: true, mode: result.mode }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
