// Single source of truth for the salesperson's identity. Every component that
// displays agent details must import from here — never hard-code agent info elsewhere.
// Replace every [PLACEHOLDER] with verified information before publishing.

export const agent = {
  fullName: "Amelia Lek Kai Yi",
  displayName: "Amelia Lek Kai Yi",
  ceaRegistrationNumber: "R072094A",
  estateAgencyName: "Huttons Asia Pte Ltd",
  estateAgencyLicenceNumber: "L3008899K",
  // Agency (not personal) registration details, taken from the Huttons Asia letterhead on the
  // developer authorisation letters. A salesperson has no UEN of their own — this is the
  // company's, published so that the business behind this site is independently verifiable
  // (ACRA/BizFile for the UEN, the CEA register for the licence).
  estateAgencyUen: "200210087C",
  estateAgencyPhone: "+65 6253 0030",
  estateAgencyAddress: {
    streetAddress: "3 Bishan Place, #05-01 CPF Bishan Building",
    addressLocality: "Singapore",
    postalCode: "579838",
    addressCountry: "SG",
  },
  mobileNumber: "+65 8186 6812",
  whatsappNumber: "+65 8186 6812", // digits only with country code, e.g. 65 9XXX XXXX, for wa.me links
  email: "amelialekera@gmail.com",
  profileImage: null as { src: string; alt: string; width: number; height: number } | null,
  shortBio:
    "Amelia Lek is a CEA-registered salesperson with Huttons Asia Pte Ltd, specialising in new-launch private residential projects in Singapore. [SHORT BIOGRAPHY — replace with verified professional background. Do not include unverified achievements, awards, sales figures, or years of experience.]",
  specialisations: [
    "New-launch project analysis",
    "Pricing and unit-selection guidance",
    "Location and connectivity analysis",
    "Exit-strategy and resale planning considerations",
  ],
  socialLinks: [
    { label: "Facebook", url: "[FACEBOOK URL]" },
    { label: "Instagram", url: "[INSTAGRAM URL]" },
    { label: "LinkedIn", url: "[LINKEDIN URL]" },
  ],
  // Stable CEA public-register search page. Do NOT swap this for a deep link to the individual
  // record: those URLs carry a session-style token (".../sales/1/56e219c0-.../sales?name=...")
  // that has been observed rendering a blank page on other devices even while returning HTTP 200.
  // Ad reviewers are pointed at this link as the primary proof of licensing, so it has to resolve
  // for someone who has never visited the site before — reliability beats saving one search.
  ceaVerificationUrl: "https://eservices.cea.gov.sg/aceas/public-register",
} as const;

export type Agent = typeof agent;
