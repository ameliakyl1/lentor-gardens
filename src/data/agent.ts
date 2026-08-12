// Single source of truth for the salesperson's identity. Every component that
// displays agent details must import from here — never hard-code agent info elsewhere.
// Replace every [PLACEHOLDER] with verified information before publishing.

export const agent = {
  fullName: "Amelia Lek Kai Yi",
  displayName: "Amelia Lek",
  ceaRegistrationNumber: "R072094A",
  estateAgencyName: "Huttons Asia Pte Ltd",
  estateAgencyLicenceNumber: "L3008899K",
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
  ceaVerificationUrl: "https://www.cea.gov.sg/public-register/",
} as const;

export type Agent = typeof agent;
