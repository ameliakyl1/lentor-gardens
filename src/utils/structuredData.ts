// Builds JSON-LD structured data from live page content only — never fabricate reviews,
// ratings, prices or availability here. Validate output with https://validator.schema.org/
// before publishing.

import { agent } from "@/data/agent";
import { project } from "@/data/project";

export function buildRealEstateAgentSchema(canonicalUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: agent.fullName,
    url: canonicalUrl,
    telephone: agent.mobileNumber,
    email: agent.email,
    // The salesperson's own CEA registration, and the agency they are registered under — the
    // two facts a reader needs to verify who operates this site and under whose licence.
    identifier: agent.ceaRegistrationNumber,
    worksFor: {
      "@type": "Organization",
      name: agent.estateAgencyName,
      identifier: agent.estateAgencyUen,
      address: { "@type": "PostalAddress", ...agent.estateAgencyAddress },
    },
    areaServed: "Singapore",
  };
}

// Publishes the agency's verifiable business identity — UEN, licence, registered office — rather
// than a bare country code, so the entity behind this site can be checked against ACRA and the
// CEA register. Machine-readable counterpart to the same details shown in the footer.
export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: agent.estateAgencyName,
    identifier: agent.estateAgencyUen,
    telephone: agent.estateAgencyPhone,
    address: { "@type": "PostalAddress", ...agent.estateAgencyAddress },
  };
}

export function buildWebSiteSchema(canonicalUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: canonicalUrl,
    name: project.general.projectName,
  };
}

export function buildWebPageSchema(canonicalUrl: string, title: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: canonicalUrl,
    name: title,
    description,
    dateModified: project.general.lastUpdated,
  };
}

export function buildBreadcrumbSchema(canonicalUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl },
    ],
  };
}

export function buildFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: project.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

// Describes the development itself, which the other builders do not — they describe the agent,
// the agency and the page. No rich result exists for condominium developments; this exists so
// search engines and assistants can resolve the project as an entity. Prices and availability
// are deliberately absent: add them only from a developer-issued price list.
export function buildApartmentComplexSchema(canonicalUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    name: project.general.projectName,
    url: canonicalUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: project.general.streetAddress,
      addressLocality: "Singapore",
      addressRegion: project.general.district,
      addressCountry: "SG",
    },
    numberOfAccommodationUnits: {
      "@type": "QuantitativeValue",
      value: project.general.residentialUnitCount,
    },
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Direct access to Hillock Park", value: true },
      { "@type": "LocationFeatureSpecification", name: "2-minute walk to Lentor MRT (TE5)", value: true },
      {
        "@type": "LocationFeatureSpecification",
        name: "Carpark lots",
        value: project.general.numberOfCarparkLots,
      },
    ],
  };
}
