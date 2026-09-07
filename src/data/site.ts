// Site-wide configuration: navigation, tracking placeholders, and theme selection.
// Tracking IDs are read from environment variables at build time — see .env.example.
// Do NOT hard-code real tracking IDs here.

// Nav deliberately carries an "About This Website" entry and no developer entry. On a site whose
// core disclosure is "I am an independent agent, this is not the developer's site", giving the
// developer a permanent top-level nav slot foregrounds the wrong party; the developer is still
// described in its own section further down the page, just not promoted in the navigation.
// The project overview is labelled "Overview" so that "About" is free to mean the disclosure.
export const nav = [
  { label: "Overview", href: "#about" },
  { label: "Location", href: "#location" },
  { label: "Price", href: "#price" },
  { label: "Floorplans", href: "#floorplans" },
  { label: "Brochure", href: "#brochure" },
  { label: "Gallery", href: "#gallery" },
  { label: "FAQ", href: "#faq" },
  { label: "About Amelia", href: "/about-amelia" },
  { label: "About This Website", href: "#about-website" },
  { label: "Contact", href: "#contact" },
] as const;

export type ThemeName = "urban-editorial" | "garden-contemporary" | "coastal-minimal" | "heritage-blush";

// Active visual theme for this deployment. Duplicate the project for a different theme,
// or change this value — see src/styles/global.css for the token sets each theme swaps.
export const activeTheme: ThemeName = "urban-editorial";

export const tracking = {
  gtmId: import.meta.env.PUBLIC_GTM_ID ?? "GTM-XXXXXXX",
  ga4Id: import.meta.env.PUBLIC_GA4_ID ?? "G-XXXXXXXXXX",
  adsConversionId: import.meta.env.PUBLIC_ADS_CONVERSION_ID ?? "AW-XXXXXXXXX",
  adsConversionLabel: import.meta.env.PUBLIC_ADS_CONVERSION_LABEL ?? "[CONVERSION LABEL]",
  metaPixelId: import.meta.env.PUBLIC_META_PIXEL_ID ?? "[META PIXEL ID]",
} as const;

export const site = {
  name: "Lentor Gardens Residences | Amelia Lek Kai Yi, Huttons Asia",
  legalDisclosureShort:
    "Independent marketing website operated by Amelia Lek Kai Yi, a CEA-registered salesperson with Huttons Asia Pte Ltd. Not the official developer website.",
  copyrightHolder: "Amelia Lek Kai Yi",
} as const;
