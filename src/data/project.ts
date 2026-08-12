// Central, config-driven project data. Duplicate this file (and update src/data/site.ts) to
// stand up the template for a different Singapore new-launch project — no component code
// should need to change. Every value marked with a [PLACEHOLDER] must be verified against an
// authorised source (developer, official price list/brochure) before publishing.
// See README.md "Pre-launch checklist" before going live.

export type UnitType = {
  type: string; // e.g. "1 Bedroom", "2 Bedroom + Study", "Penthouse"
  bedroomCategory: "1BR" | "2BR" | "3BR" | "4BR" | "5BR" | "Penthouse" | "Other";
  hasStudy: boolean;
  approxAreaSqft: string; // e.g. "441 – 463"
  unitsInType: string | null;
  availability: "Available" | "Limited Units" | "Sold Out" | "Verify Availability";
  indicativePriceFrom: string | null; // e.g. "$1.08M" or null if unverified
  indicativePsf: string | null;
  suitableFor: string;
  floorplanImage: { src: string; alt: string; width: number; height: number } | null;
};

export const project = {
  general: {
    projectName: "Lentor Gardens Residences",
    projectSlug: "lentor-gardens-residences",
    propertyType: "Private Condominium",
    district: "D26 – Mandai / Upper Thomson",
    districtShort: "D26",
    region: "Mandai / Upper Thomson (Singapore)",
    streetAddress: "66–80 Lentor Gardens",
    postalCode: "788797–788843 (varies by block)",
    tenure: "99 Years (w.e.f. 7 July 2025)",
    developer: "Kingsford Lentor Project Pte Ltd",
    developerShortName: "Kingsford Lentor",
    architect: "[ARCHITECT — VERIFY]",
    mainContractor: "[MAIN CONTRACTOR — VERIFY]",
    numberOfUnits: "502 in total — 499 residential units (including 3 strata terraces) plus 3 shops",
    numberOfCarparkLots: "402",
    unitTypesSummary: "2 to 4 Bedrooms, Strata Terraces",
    numberOfBlocks: "4 (3 blocks of 16 storeys, 1 block of 8 storeys), plus 3 strata terrace units",
    numberOfStoreys: "Up to 16 storeys",
    landSize: "20,639.4 sqm, Gross Plot Ratio 2.1",
    expectedTOP: "31 December 2030 (Vacant Possession)",
    planningArea: "Ang Mo Kio",
    projectStatus: "Launched — Limited Units Available",
    previewDate: "[PREVIEW DATE — VERIFY]",
    bookingDate: "[BOOKING DATE — VERIFY]",
    showflatAddress: "[SHOWFLAT ADDRESS — VERIFY]",
    lastUpdated: "7 August 2026",
  },

  pricing: {
    indicativeStartingPrice: "To be updated",
    indicativePsfRange: "From $2,050 psf",
    maintenanceFeeEstimate: "To be updated",
    priceLastUpdated: "7 August 2026",
    priceListDocument: "/documents/price-list-placeholder.pdf",
    disclaimer:
      "Prices, unit availability and promotional arrangements are indicative and subject to change. Please request the latest developer-issued price list for confirmation.",
  },

  unitTypes: [
    {
      type: "2 Bedroom",
      bedroomCategory: "2BR",
      hasStudy: true,
      approxAreaSqft: "646 – 732 (60 – 68 sqm)",
      unitsInType: null,
      availability: "Verify Availability",
      indicativePriceFrom: null,
      indicativePsf: null,
      suitableFor: "Young couples and small families who want a well-located, compact home. Select layouts include a study.",
      floorplanImage: {
        src: "/images/floorplans/2br.jpg",
        alt: "Lentor Gardens Residences 2 Bedroom indicative floorplan",
        width: 842,
        height: 595,
      },
    },
    {
      type: "3 Bedroom",
      bedroomCategory: "3BR",
      hasStudy: true,
      approxAreaSqft: "872 – 1,012 (81 – 94 sqm)",
      unitsInType: null,
      availability: "Verify Availability",
      indicativePriceFrom: null,
      indicativePsf: null,
      suitableFor: "Growing families requiring additional bedrooms. Select layouts include a study.",
      floorplanImage: {
        src: "/images/floorplans/3br.jpg",
        alt: "Lentor Gardens Residences 3 Bedroom indicative floorplan",
        width: 842,
        height: 595,
      },
    },
    {
      type: "4 Bedroom",
      bedroomCategory: "4BR",
      hasStudy: false,
      approxAreaSqft: "1,184 – 1,356 (110 – 126 sqm)",
      unitsInType: null,
      availability: "Verify Availability",
      indicativePriceFrom: null,
      indicativePsf: null,
      suitableFor: "Multi-generational households or larger families.",
      floorplanImage: {
        src: "/images/floorplans/4br.jpg",
        alt: "Lentor Gardens Residences 4 Bedroom indicative floorplan",
        width: 842,
        height: 595,
      },
    },
    {
      type: "Strata Terrace",
      bedroomCategory: "Other",
      hasStudy: false,
      approxAreaSqft: "1,496 (139 sqm)",
      unitsInType: "3",
      availability: "Verify Availability",
      indicativePriceFrom: null,
      indicativePsf: null,
      suitableFor: "Buyers seeking a landed-style home with private outdoor space, within a limited collection of only 3 units.",
      floorplanImage: {
        src: "/images/floorplans/strata-terrace.jpg",
        alt: "Lentor Gardens Residences Strata Terrace indicative floorplan",
        width: 595,
        height: 842,
      },
    },
  ] as UnitType[],

  location: {
    overview:
      "Lentor Gardens Residences is located at 66–78 Lentor Gardens in District 26 (Mandai / Upper Thomson), within the Lentor estate — a cluster of new launches (including Lentoria, Lentor Mansion, Lentor Hills, Hillock Green and Lentor Central) surrounding Lentor MRT (TE5) on the Thomson-East Coast Line, connected via Hillock Park.",
    nearestMrtStations: [
      { name: "Lentor MRT", line: "TE5", walkingMinutes: "2 mins" },
    ],
    drivingTimes: [],
    amenities: [
      { category: "MRT", name: "Lentor MRT (TE5)", distance: "2 mins walk", description: "Thomson-East Coast Line station, per the developer's brochure." },
      { category: "School", name: "Anderson Primary School", distance: "8 mins", description: "Primary school near the development." },
      { category: "School", name: "Anderson Serangoon Junior College", distance: "Direct Access", description: "Junior college near the development." },
      { category: "School", name: "Nanyang Polytechnic", distance: "Nearby", description: "Polytechnic near the development." },
      { category: "School", name: "Presbyterian High School", distance: "Nearby", description: "Secondary school near the development." },
      { category: "School", name: "Ang Mo Kio Primary School", distance: "Nearby", description: "Primary school near the development." },
      { category: "School", name: "Anderson Secondary School", distance: "Nearby", description: "Secondary school near the development." },
      { category: "School", name: "CHIJ St Nicholas Girls' School", distance: "Nearby", description: "School near the development." },
      { category: "School", name: "Mayflower Secondary School", distance: "Nearby", description: "Secondary school near the development." },
      { category: "School", name: "Mayflower Primary School", distance: "Nearby", description: "Primary school near the development." },
      { category: "School", name: "Lentor Modern Childcare", distance: "3 mins", description: "Childcare centre near Lentor Modern Mall." },
      { category: "Convenience", name: "Lentor Modern Mall", distance: "2 mins walk", description: "Supermarkets, dining and retail options beside Lentor MRT station." },
      { category: "Convenience", name: "AMK Hub", distance: "9 mins (drive)", description: "Shopping mall in Ang Mo Kio." },
      { category: "Convenience", name: "Thomson Plaza & Upper Thomson Eateries", distance: "9 mins (drive) / 3 MRT stops", description: "Shopping and dining along Upper Thomson Road." },
      { category: "Convenience", name: "Junction 8", distance: "14 mins (drive)", description: "Shopping mall in Bishan." },
      { category: "Park", name: "Hillock Park", distance: "Direct access", description: "Park connector linking the development directly to Lentor MRT." },
      { category: "Park", name: "Thomson Nature Park", distance: "Nearby", description: "Nature park in the surrounding Thomson-Lentor area." },
      { category: "Park", name: "Lower Seletar Reservoir Park", distance: "Nearby", description: "Reservoir and park connector in the vicinity." },
      { category: "Park", name: "Bishan-Ang Mo Kio Park", distance: "Nearby", description: "Park connected via the park connector network." },
    ],
    healthcareFacilities: ["[HOSPITAL / CLINIC — VERIFY]"],
    businessDistricts: ["[BUSINESS DISTRICT TRAVEL TIME — VERIFY]"],
    expressways: ["SLE", "CTE"],
    roadConnectivity: [
      { route: "Seletar Expressway (SLE)", destination: "~2 min drive from the development" },
      { route: "Central Expressway (CTE)", destination: "~7 min drive from the development" },
      { route: "North-South Corridor (under construction)", destination: "~7 min drive from the development; will enhance connectivity to the city" },
    ],
    futureInfrastructure: [
      "Thomson-East Coast Line (TEL) to be extended to serve Changi Airport Terminal 5 (under construction)",
      "Cross Island Line (CRL) — future interchange stations planned at Ang Mo Kio and Bright Hill (under construction)",
      "Johor Bahru–Singapore Rapid Transit System (RTS) Link, with a direct connection to the Thomson-East Coast Line (under construction)",
      "North-South Corridor (NSC) — expressway with dedicated cycling and pedestrian routes (under construction)",
    ],
    mapImage: {
      src: "/images/location/map.jpg",
      alt: "Map showing Lentor Gardens Residences' location relative to nearby MRT stations, schools and amenities",
      width: 1200,
      height: 701,
    },
    interactiveMapUrl: "[GOOGLE MAPS URL]",
  },

  media: {
    projectLogo: { src: "/images/branding/project-logo.png", alt: "Lentor Gardens Residences logo", width: 700, height: 495 },
    heroImage: {
      src: "/images/hero/hero-desktop.jpg",
      mobileSrc: "/images/hero/hero-mobile.jpg",
      alt: "Artist's impression of Lentor Gardens Residences exterior and pool deck — for illustration purposes only",
      width: 2400,
      height: 1200,
    },
    galleryImages: [
      { src: "/images/gallery/twilight-exterior.jpg", alt: "Lentor Gardens Residences — twilight exterior view artist's impression", width: 1600, height: 1023, category: "Exterior" },
      { src: "/images/gallery/aerial-view.jpg", alt: "Lentor Gardens Residences — aerial view artist's impression", width: 1600, height: 800, category: "Exterior" },
      { src: "/images/gallery/clubhouse-facade.jpg", alt: "Lentor Gardens Residences — clubhouse facade artist's impression", width: 1600, height: 1041, category: "Facilities" },
      { src: "/images/gallery/facilities-view.jpg", alt: "Lentor Gardens Residences — facilities view artist's impression", width: 1600, height: 800, category: "Facilities" },
      { src: "/images/gallery/landscape-deck.jpg", alt: "Lentor Gardens Residences — landscaped deck artist's impression", width: 1600, height: 951, category: "Facilities" },
    ],
    sitePlan: { src: "/images/site-plan/site-plan.jpg", alt: "Lentor Gardens Residences site plan", width: 1400, height: 980 },
    brochureCover: { src: "/images/brochure/brochure-cover.jpg", alt: "Lentor Gardens Residences project brochure cover", width: 1200, height: 900 },
    brochurePdf: null as string | null, // set to a verified, authorised PDF path/URL when available
    developerLogo: { src: "/images/branding/developer-logo.png", alt: "Kingsford Lentor Project Pte Ltd logo", width: 700, height: 131 },
  },

  content: {
    heroHeadline: "Lentor Gardens Residences",
    heroSupportingCopy:
      "A 499-unit 99-year leasehold condo along Lentor Gardens, within walking distance of Lentor MRT and Lentor Modern Mall. 2 to 4-bedroom apartments and 3 strata terraces, indicatively priced from $2,050 psf. Book a private showflat appointment with Amelia Lek.",
    aboutOverview:
      "*Lentor Gardens Residences* is the newest addition to the Lentor estate, located along Lentor Gardens and within walking distance to *Lentor MRT* and *Lentor Modern Mall*. Developed by *Kingsford Lentor Project Pte Ltd*, part of the Kingsford Group, this 99-year leasehold condominium offers 499 residential units across a mix of 2 to 4-bedroom apartments and 3 strata terraces.\n\nLaunched on 4 July 2026, Lentor Gardens Residences offers connectivity via the Thomson-East Coast Line, proximity to Lentor Modern Mall, and a unit mix that includes larger, family-sized layouts. Units are indicatively priced from *$2,050 psf*.",
    locationAnalysis:
      "Lentor Gardens Residences is a 2-minute walk from Lentor MRT Station on the Thomson-East Coast Line, with Lentor Modern Mall located right at the station for supermarkets, dining and retail. The development connects to the Central Expressway (CTE) and Seletar Expressway (SLE), and is directly linked to Hillock Park.",
    pricingAnalysis:
      "Lentor Gardens Residences offers 499 residential units, comprising 2 to 4-bedroom layouts plus 3 strata terrace units, alongside 3 retail shops. Indicative pricing starts from $2,050 psf, subject to change and developer confirmation.",
    unitSelectionAnalysis:
      "Lentor Gardens Residences offers 2 to 4-bedroom apartments — spanning approximately 646 to 1,356 sqft, with select layouts including a study — alongside 3 strata terrace houses of 1,496 sqft each, a landed-housing option within the development. Buyers should request the full floorplan set and stacking plan to compare unit orientation, facing and facility-view premiums before selecting a specific stack.",
    buyerConsiderations:
      "Key factors to weigh: this is a 99-year leasehold development (not freehold), with tenure commencing 7 July 2025; pricing is indicative only and subject to change and developer confirmation; and exact floor areas should be reconfirmed against the latest developer factsheet. Vacant possession is expected by 31 December 2030, with legal completion expected by 31 December 2033. Buyers should also consider financing eligibility (loan quantum, ABSD/BSD where applicable) against this timeline.",
    marketComparison:
      "[MARKET COMPARISON — factual, sourced comparison to nearby comparable launches where information is available; omit if unverifiable.]",
    developerProfile:
      "Lentor Gardens Residences is developed by Kingsford Lentor Project Pte Ltd (Housing Developer's Licence No. C1550), part of the Kingsford Group. Established in 2011, the Kingsford Group has delivered notable Singapore projects including Kingsford Hillview Peak (512 units), Kingsford Waterbay (1,165 units) and Normanton Park (1,862 units), with The Hill @ One-North, Chuan Park and One Marina Gardens currently underway. The Group's accolades include the Singapore Prestige Brand Award – Global Brands (2019) and multiple PropertyGuru Asia Property Awards (Singapore) between 2021 and 2025.",
    projectDisclaimer:
      "This information is provided for general reference only and may be subject to change. Prices and unit availability must be reconfirmed directly with the developer or its authorised marketing agents. Images and renderings may be artists' impressions and may not represent the final development. Floor areas and dimensions are approximate and subject to final survey. This information does not form part of, and shall not be regarded as, an offer or contract. Buyers should refer to the Option to Purchase, Sale and Purchase Agreement and other official sale documents. Errors and omissions excepted.",
    imageDisclaimer:
      "Images and artists' impressions are for illustration purposes only and may not represent the final completed development.",
  },

  faq: [
    {
      question: "Where is Lentor Gardens Residences located?",
      answer: "Lentor Gardens Residences is located along Lentor Gardens in District 26, within walking distance of Lentor MRT Station and Lentor Modern Mall.",
    },
    {
      question: "How many units does Lentor Gardens Residences have?",
      answer: "Lentor Gardens Residences comprises 502 units in total: 499 residential units (2 to 4-bedroom apartments and 3 strata terraces) plus 3 retail shops.",
    },
    {
      question: "What is the tenure of Lentor Gardens Residences?",
      answer: "Lentor Gardens Residences is a 99-year leasehold development, with tenure commencing 7 July 2025.",
    },
    {
      question: "Who is the developer of Lentor Gardens Residences?",
      answer: "Lentor Gardens Residences is developed by Kingsford Lentor Project Pte Ltd, part of the Kingsford Group.",
    },
    {
      question: "When is Lentor Gardens Residences expected to be completed?",
      answer: "Vacant possession is expected by 31 December 2030, with legal completion expected by 31 December 2033.",
    },
    {
      question: "What is the price of Lentor Gardens Residences?",
      answer: "Indicative pricing at Lentor Gardens Residences starts from $2,050 psf, subject to change and developer confirmation.",
    },
    {
      question: "Which MRT line serves Lentor Gardens Residences?",
      answer: "Lentor MRT Station, near Lentor Gardens Residences, is on the Thomson-East Coast Line.",
    },
    {
      question: "How can I arrange an appointment?",
      answer: "Call or WhatsApp Amelia at +65 8186 6812, or submit the enquiry form in the Contact section and tap \"Submit Enquiry\".",
    },
  ],

  contact: {
    whatsappMessage:
      "Hi Amelia, I'm interested in Lentor Gardens Residences and would like to find out more.",
    contactFormRecipient: "amelialekera@gmail.com",
  },
} as const;

export type Project = typeof project;
