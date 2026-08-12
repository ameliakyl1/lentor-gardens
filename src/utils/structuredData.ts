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
    worksFor: {
      "@type": "Organization",
      name: agent.estateAgencyName,
    },
    areaServed: "Singapore",
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: agent.estateAgencyName,
    address: { "@type": "PostalAddress", addressCountry: "SG" },
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
