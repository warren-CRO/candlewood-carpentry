export const PHONE = "(203) 470-7424";
export const PHONE_HREF = "tel:+12034707424";
export const SMS_HREF = "sms:+12034707424";
export const EMAIL = "cworthy4@charter.net";
export const OWNER = "Chad Colesworthy";
export const COMPANY = "Candlewood Carpentry LLC";

export const SERVICE_AREAS = [
  "Danbury",
  "New Fairfield",
  "Brookfield",
  "New Milford",
  "Sherman",
];

export const SERVICE_DETAILS: Record<
  string,
  { icon: string; short: string; bullets: string[] }
> = {
  renovations: {
    icon: "/images/assets/icon-renovations.png",
    short: "Room updates, repairs, and finish work, from a fresh layout to the fix you have put off for years.",
    bullets: ["Whole-room updates", "Layout changes", "Repairs and punch lists", "Finish work"],
  },
  "kitchen-bath": {
    icon: "/images/assets/icon-kitchen-bath.png",
    short: "Updated layouts, cabinetry, and finish work for the rooms that matter most.",
    bullets: ["Cabinetry and surfaces", "Trim and finish carpentry", "Layout updates", "Renovation support"],
  },
  "interior-painting": {
    icon: "/images/assets/icon-interior-painting.png",
    short: "Walls, ceilings, trim, and doors with the prep that makes the finish last.",
    bullets: ["Walls and ceilings", "Trim and doors", "Detailed surface prep", "Clean, finished edges"],
  },
  "exterior-painting": {
    icon: "/images/assets/icon-exterior-painting.png",
    short: "Siding, shutters, and trim, refreshed and protected for New England weather.",
    bullets: ["Siding and shutters", "Trim and exterior surfaces", "Scraping and prep", "Weather-aware scheduling"],
  },
  decks: {
    icon: "/images/assets/icon-decks.png",
    short: "Deck builds, repairs, railings, and stairs built to handle Connecticut winters.",
    bullets: ["New deck builds", "Repairs and upgrades", "Railings and stairs", "Exterior carpentry"],
  },
  carpentry: {
    icon: "/images/assets/icon-carpentry.png",
    short: "Trim, finish work, and the practical custom improvements that make a house feel like yours.",
    bullets: ["Trim and molding", "Punch-list items", "Shelving and built-ins", "Custom improvements"],
  },
};

export const SERVICES = [
  {
    id: "renovations",
    title: "Renovations",
    tagline: "Whole-room updates and smaller improvements",
    description:
      "Home renovations big and small, including room updates, repairs, and finish work. From a fresh layout to fixing what's been bugging you for years.",
    image: "/images/renovation-work.jpg",
  },
  {
    id: "kitchen-bath",
    title: "Kitchen & Bath Remodels",
    tagline: "Updated layouts, cabinetry, and finish work",
    description:
      "Updated layouts, cabinetry and finish work, trim, surfaces, and renovation support. The rooms that matter most, done right.",
    image: "/images/project-kitchen.jpg",
  },
  {
    id: "interior-painting",
    title: "Interior Painting",
    tagline: "Walls, ceilings, trim, doors, and detailed prep",
    description:
      "Walls, ceilings, trim, doors, and detailed prep for a clean finished look. Proper prep is 80% of the job — we don't skip it.",
    image: "/images/interior-detail.jpg",
  },
  {
    id: "exterior-painting",
    title: "Exterior Painting",
    tagline: "Siding, shutters, trim, and exterior surfaces",
    description:
      "Siding, shutters, trim, and exterior surfaces to refresh and protect your home. We work around the weather, not against it.",
    image: "/images/lakeside-home.jpg",
  },
  {
    id: "decks",
    title: "Decks & Outdoor Work",
    tagline: "Deck builds, repairs, upgrades, and railings",
    description:
      "Deck builds, repairs, upgrades, railings, stairs, and exterior carpentry. Built to handle Connecticut winters.",
    image: "/images/project-deck.jpg",
  },
  {
    id: "carpentry",
    title: "General Carpentry",
    tagline: "Trim, finish work, repairs, and custom improvements",
    description:
      "Trim, finish work, repairs, punch-list items, and practical custom improvements. The detail work that makes a house feel like yours.",
    image: "/images/interior-trim.jpg",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "Chad rebuilt our deck from scratch — new framing, composite boards, cable railing. He showed up when he said he would, kept the yard clean, and the finished product looks incredible. Three neighbors have asked for his number.",
    name: "Mike & Sarah T.",
    location: "New Fairfield, CT",
    project: "Full deck rebuild",
  },
  {
    quote:
      "We interviewed four contractors for our kitchen remodel. Chad was the only one who walked the whole house, asked real questions, and gave us a detailed scope before talking price. The kitchen looks like it belongs in a magazine.",
    name: "Jennifer L.",
    location: "Brookfield, CT",
    project: "Kitchen renovation",
  },
  {
    quote:
      "After a bad experience with another contractor who disappeared mid-project, Chad came in and finished our bathroom the right way. He was honest about what needed to be redone and what could be saved. Wish we had found him first.",
    name: "Tom R.",
    location: "Bethel, CT",
    project: "Bathroom renovation",
  },
  {
    quote:
      "Chad painted the entire exterior of our colonial — siding, shutters, trim, everything. The prep work alone took two days. Most painters would have skipped half of it. Two years later it still looks fresh.",
    name: "Karen & Dave P.",
    location: "Danbury, CT",
    project: "Exterior painting",
  },
  {
    quote:
      "We had a punch list of small carpentry jobs that no one would take on — crown molding, closet shelving, a door that never closed right. Chad knocked them all out in two days. Fair price, clean work, zero hassle.",
    name: "Lisa M.",
    location: "New Milford, CT",
    project: "General carpentry",
  },
];
