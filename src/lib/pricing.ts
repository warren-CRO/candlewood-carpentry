export const COMPANY = {
  name: "Candlewood Carpentry",
  owner: "Chad Colesworthy",
  address: "Sherman, CT 06784",
  phone: "(203) 470-7424",
  email: "chad@candlewoodcarpentry.com",
  license: "",
} as const;

export const DEFAULTS = {
  laborRate: 65,
  markupPercent: 20,
  contingencyPercent: 10,
  paymentTerms: { deposit: 50, midpoint: 25, completion: 25 },
} as const;

export const SUBCONTRACTORS: Record<string, { name: string; rate: number }> = {
  plumbing: { name: "Manda Plumbing", rate: 85 },
  electrical: { name: "", rate: 90 },
  hvac: { name: "Air One", rate: 95 },
  masonry: { name: "", rate: 75 },
  painting: { name: "PV Generation Painting", rate: 55 },
  drywall: { name: "", rate: 60 },
  general: { name: "SMG Construction", rate: 70 },
};

export interface ProjectType {
  label: string;
  materialsPerSqft: { standard: number; mid: number; premium: number };
  hoursPerSqft: number;
  typicalSqft: { min: number; max: number };
  typicalWeeks: { min: number; max: number };
  commonSubs: string[];
  permitRequired: boolean;
}

export const PROJECT_TYPES: Record<string, ProjectType> = {
  "interior-painting": {
    label: "Interior Painting",
    materialsPerSqft: { standard: 3, mid: 5, premium: 8 },
    hoursPerSqft: 0.08,
    typicalSqft: { min: 500, max: 3000 },
    typicalWeeks: { min: 1, max: 3 },
    commonSubs: [],
    permitRequired: false,
  },
  "exterior-painting": {
    label: "Exterior Painting",
    materialsPerSqft: { standard: 4, mid: 6, premium: 9 },
    hoursPerSqft: 0.06,
    typicalSqft: { min: 1000, max: 3000 },
    typicalWeeks: { min: 1, max: 3 },
    commonSubs: [],
    permitRequired: false,
  },
  "exterior-staining": {
    label: "Exterior Staining",
    materialsPerSqft: { standard: 3, mid: 5, premium: 8 },
    hoursPerSqft: 0.05,
    typicalSqft: { min: 200, max: 1500 },
    typicalWeeks: { min: 0.5, max: 2 },
    commonSubs: [],
    permitRequired: false,
  },
  "window-replacement": {
    label: "Window Replacement",
    materialsPerSqft: { standard: 130, mid: 230, premium: 350 },
    hoursPerSqft: 1.0,
    typicalSqft: { min: 15, max: 60 },
    typicalWeeks: { min: 1, max: 2 },
    commonSubs: [],
    permitRequired: true,
  },
  "exterior-renovation": {
    label: "Exterior Renovation",
    materialsPerSqft: { standard: 25, mid: 45, premium: 70 },
    hoursPerSqft: 0.4,
    typicalSqft: { min: 100, max: 500 },
    typicalWeeks: { min: 2, max: 6 },
    commonSubs: ["electrical"],
    permitRequired: true,
  },
  "kitchen-remodel": {
    label: "Kitchen Remodel",
    materialsPerSqft: { standard: 35, mid: 65, premium: 120 },
    hoursPerSqft: 0.45,
    typicalSqft: { min: 80, max: 250 },
    typicalWeeks: { min: 3, max: 8 },
    commonSubs: ["plumbing", "electrical"],
    permitRequired: true,
  },
  "bathroom-remodel": {
    label: "Bathroom Remodel",
    materialsPerSqft: { standard: 40, mid: 75, premium: 140 },
    hoursPerSqft: 0.55,
    typicalSqft: { min: 35, max: 120 },
    typicalWeeks: { min: 2, max: 5 },
    commonSubs: ["plumbing", "electrical"],
    permitRequired: true,
  },
  "deck-build": {
    label: "Deck Build (New)",
    materialsPerSqft: { standard: 10, mid: 15, premium: 28 },
    hoursPerSqft: 0.18,
    typicalSqft: { min: 100, max: 1500 },
    typicalWeeks: { min: 1, max: 4 },
    commonSubs: [],
    permitRequired: true,
  },
  "deck-repair": {
    label: "Deck Repair / Staining",
    materialsPerSqft: { standard: 6, mid: 12, premium: 22 },
    hoursPerSqft: 0.12,
    typicalSqft: { min: 50, max: 600 },
    typicalWeeks: { min: 0.5, max: 2 },
    commonSubs: [],
    permitRequired: false,
  },
  "room-addition": {
    label: "Room Addition",
    materialsPerSqft: { standard: 55, mid: 90, premium: 150 },
    hoursPerSqft: 0.6,
    typicalSqft: { min: 100, max: 400 },
    typicalWeeks: { min: 4, max: 12 },
    commonSubs: ["plumbing", "electrical", "hvac"],
    permitRequired: true,
  },
  "custom-cabinetry": {
    label: "Custom Cabinetry",
    materialsPerSqft: { standard: 45, mid: 80, premium: 150 },
    hoursPerSqft: 0.7,
    typicalSqft: { min: 20, max: 100 },
    typicalWeeks: { min: 2, max: 6 },
    commonSubs: [],
    permitRequired: false,
  },
  "trim-work": {
    label: "Trim / Molding / Finish Work",
    materialsPerSqft: { standard: 8, mid: 15, premium: 28 },
    hoursPerSqft: 0.25,
    typicalSqft: { min: 200, max: 2000 },
    typicalWeeks: { min: 1, max: 3 },
    commonSubs: [],
    permitRequired: false,
  },
  framing: {
    label: "Framing",
    materialsPerSqft: { standard: 12, mid: 18, premium: 25 },
    hoursPerSqft: 0.2,
    typicalSqft: { min: 100, max: 2000 },
    typicalWeeks: { min: 1, max: 4 },
    commonSubs: [],
    permitRequired: true,
  },
  siding: {
    label: "Siding",
    materialsPerSqft: { standard: 6, mid: 12, premium: 22 },
    hoursPerSqft: 0.15,
    typicalSqft: { min: 500, max: 3000 },
    typicalWeeks: { min: 1, max: 3 },
    commonSubs: [],
    permitRequired: false,
  },
  roofing: {
    label: "Roofing",
    materialsPerSqft: { standard: 5, mid: 9, premium: 16 },
    hoursPerSqft: 0.12,
    typicalSqft: { min: 1000, max: 3000 },
    typicalWeeks: { min: 1, max: 2 },
    commonSubs: [],
    permitRequired: true,
  },
  "general-carpentry": {
    label: "General Carpentry",
    materialsPerSqft: { standard: 10, mid: 20, premium: 35 },
    hoursPerSqft: 0.3,
    typicalSqft: { min: 10, max: 500 },
    typicalWeeks: { min: 0.5, max: 4 },
    commonSubs: [],
    permitRequired: false,
  },
};

export interface SubLine {
  trade: string;
  name: string;
  hours: number;
  rate: number;
  total: number;
}

export interface CostBreakdown {
  materials: number;
  laborHours: number;
  laborRate: number;
  laborTotal: number;
  subs: SubLine[];
  subsTotal: number;
  subtotal: number;
  markup: number;
  markupPercent: number;
  contingency: number;
  contingencyPercent: number;
  total: number;
}

export function calculateCosts(
  projectType: string,
  sqft: number,
  tier: "standard" | "mid" | "premium",
  subs: SubLine[],
  totalOverride?: number,
): CostBreakdown {
  const pt = PROJECT_TYPES[projectType];
  if (!pt) throw new Error(`Unknown project type: ${projectType}`);

  let materials = pt.materialsPerSqft[tier] * sqft;
  let laborHours = Math.ceil(pt.hoursPerSqft * sqft);
  const laborRate = DEFAULTS.laborRate;
  let laborTotal = laborHours * laborRate;
  let subsTotal = subs.reduce((sum, s) => sum + s.total, 0);
  let subtotal = materials + laborTotal + subsTotal;
  const markupPercent = DEFAULTS.markupPercent;
  let markup = subtotal * (markupPercent / 100);
  const contingencyPercent = DEFAULTS.contingencyPercent;
  let contingency = subtotal * (contingencyPercent / 100);
  let total = subtotal + markup + contingency;

  if (totalOverride && totalOverride > 0) {
    const ratio = totalOverride / total;
    materials = Math.round(materials * ratio);
    laborTotal = Math.round(laborTotal * ratio);
    subsTotal = Math.round(subsTotal * ratio);
    subtotal = materials + laborTotal + subsTotal;
    markup = Math.round(markup * ratio);
    contingency = Math.round(contingency * ratio);
    total = totalOverride;
    laborHours = Math.ceil(laborTotal / laborRate);
  }

  return {
    materials,
    laborHours,
    laborRate,
    laborTotal,
    subs,
    subsTotal,
    subtotal,
    markup,
    markupPercent,
    contingency,
    contingencyPercent,
    total,
  };
}

export function fmt(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function parseTier(input?: string): "standard" | "mid" | "premium" {
  if (!input) return "mid";
  const lower = input.toLowerCase();
  if (lower === "standard" || lower === "low") return "standard";
  if (lower === "premium" || lower === "high") return "premium";
  return "mid";
}
