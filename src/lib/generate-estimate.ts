import { COMPANY, DEFAULTS, PROJECT_TYPES, calculateCosts, fmt, parseTier, type SubLine } from "./pricing";

export interface EstimateInput {
  client: { name: string; address: string; phone?: string; email?: string };
  project: {
    type: string;
    scope: string;
    sqft: number;
    materialsTier?: string;
    timeline?: string;
    timelineWeeks?: number;
    specialConditions?: string;
  };
  scopeItems?: Array<{ description: string; amount: number }>;
  subs?: Array<{ trade: string; name?: string; hours: number; rate: number }>;
  overrides?: { total?: number };
}

let estimateCounter = 0;

function nextEstimateNumber(): string {
  estimateCounter++;
  const year = new Date().getFullYear();
  const ts = Date.now().toString(36).slice(-4).toUpperCase();
  return `CCE-${year}-${ts}${String(estimateCounter).padStart(2, "0")}`;
}

export function generateEstimate(input: EstimateInput): { html: string; number: string } {
  const pt = PROJECT_TYPES[input.project.type];
  if (!pt) throw new Error(`Unknown project type: ${input.project.type}`);

  const tier = parseTier(input.project.materialsTier);
  const tierLabel = input.project.materialsTier || "Mid-Range";

  const subs: SubLine[] = (input.subs || []).map((s) => ({
    trade: s.trade,
    name: s.name || "",
    hours: s.hours,
    rate: s.rate,
    total: s.hours * s.rate,
  }));

  const sqft = input.project.sqft || 0;
  const costs = calculateCosts(input.project.type, sqft, tier, subs, input.overrides?.total);
  const docNumber = nextEstimateNumber();
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const timelineWeeks = input.project.timelineWeeks || Math.ceil((pt.typicalWeeks.min + pt.typicalWeeks.max) / 2);

  const scopeItems = input.scopeItems || [];
  if (scopeItems.length > 0) {
    costs.total = scopeItems.reduce((s, i) => s + i.amount, 0);
  }

  const itemRows = scopeItems.length > 0
    ? scopeItems.map((item) => `
      <tr>
        <td>${esc(item.description)}</td>
        <td class="num">${fmt(item.amount)}</td>
      </tr>`).join("")
    : `
      <tr>
        <td>Materials (${esc(tierLabel)})</td>
        <td class="num">${fmt(costs.materials)}</td>
      </tr>
      <tr>
        <td>Labor</td>
        <td class="num">${fmt(costs.laborTotal)}</td>
      </tr>
      ${costs.subs.map((s) => `
      <tr>
        <td>Subcontractor — ${esc(s.trade)}${s.name ? ` (${esc(s.name)})` : ""}</td>
        <td class="num">${fmt(s.total)}</td>
      </tr>`).join("")}`;

  const co = COMPANY;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Estimate ${docNumber} — ${esc(input.client.name)}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  :root { --bg:#fff; --fg:#1a1a1a; --muted:#666; --border:#e0e0e0; --accent:#2c5282; --accent-light:#ebf4ff; --warm:#744210; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Inter',system-ui,sans-serif; color:var(--fg); max-width:850px; margin:0 auto; font-size:13px; line-height:1.5; }
  .letterhead { display:flex; justify-content:space-between; align-items:flex-end; padding:40px 48px 24px; border-bottom:3px solid var(--accent); }
  .company-name { font-size:28px; font-weight:700; color:var(--accent); letter-spacing:-0.5px; }
  .company-sub { font-size:11px; color:var(--muted); margin-top:2px; }
  .company-contact { text-align:right; font-size:11px; color:var(--muted); line-height:1.6; }
  .body { padding:28px 48px 40px; }
  .doc-meta { display:flex; justify-content:space-between; margin-bottom:28px; }
  .meta-block h3 { font-size:10px; text-transform:uppercase; letter-spacing:1.5px; color:var(--muted); margin-bottom:4px; }
  .meta-block p { font-size:13px; line-height:1.5; }
  h2 { font-size:16px; font-weight:700; color:var(--accent); margin:28px 0 12px; padding-bottom:6px; border-bottom:1.5px solid var(--border); }
  .scope { background:var(--accent-light); border-radius:6px; padding:16px 20px; margin-bottom:8px; }
  .scope p { font-size:13px; line-height:1.6; }
  table { width:100%; border-collapse:collapse; margin:8px 0 16px; }
  th { text-align:left; font-size:10px; text-transform:uppercase; letter-spacing:1px; color:var(--muted); padding:8px 12px; border-bottom:2px solid var(--border); }
  td { padding:8px 12px; border-bottom:1px solid var(--border); font-size:13px; }
  .num { text-align:right; font-variant-numeric:tabular-nums; }
  .total-row td { font-weight:700; border-top:2px solid var(--accent); border-bottom:none; font-size:15px; }
  .notes { background:#f8f8f8; border-radius:6px; padding:16px 20px; margin-top:20px; }
  .notes p { font-size:12px; color:var(--muted); line-height:1.6; }
  .notes ul { font-size:12px; color:var(--muted); line-height:1.6; padding-left:20px; margin-top:8px; }
  .footer { text-align:center; padding:20px 48px; border-top:1px solid var(--border); font-size:10px; color:var(--muted); }
  @media print { body { max-width:none; } .letterhead,.body { padding-left:36px; padding-right:36px; } }
</style>
</head>
<body>
<div class="letterhead">
  <div>
    <div class="company-name">${co.name}</div>
    <div class="company-sub">${co.owner} · General Contractor · ${co.address}${co.license ? ` · Lic. ${co.license}` : ""}</div>
  </div>
  <div class="company-contact">${co.phone}<br>${co.email}</div>
</div>
<div class="body">
  <div class="doc-meta">
    <div class="meta-block">
      <h3>Prepared For</h3>
      <p><strong>${esc(input.client.name)}</strong><br>
      ${esc(input.client.address)}${input.client.phone ? "<br>" + esc(input.client.phone) : ""}${input.client.email ? "<br>" + esc(input.client.email) : ""}</p>
    </div>
    <div class="meta-block" style="text-align:right;">
      <h3>Estimate</h3>
      <p><strong>${docNumber}</strong><br>Date: ${today}<br>Valid for 14 days</p>
    </div>
  </div>
  <h2>Scope of Work</h2>
  <div class="scope">
    <p><strong>${esc(pt.label)}</strong></p>
    <p style="margin-top:8px;">${esc(input.project.scope)}</p>
    ${input.project.specialConditions ? `<p style="margin-top:8px;color:var(--warm);"><strong>Note:</strong> ${esc(input.project.specialConditions)}</p>` : ""}
  </div>
  <h2>Pricing</h2>
  <table>
    <thead><tr><th>Item</th><th class="num">Amount</th></tr></thead>
    <tbody>
      ${itemRows}
      <tr class="total-row"><td>Total</td><td class="num">${fmt(costs.total)}</td></tr>
    </tbody>
  </table>
  ${timelineWeeks > 0 ? `
  <h2>Timeline</h2>
  <div class="scope">
    <p><strong>Estimated duration: ${timelineWeeks} week${timelineWeeks !== 1 ? "s" : ""}</strong>${input.project.timeline ? ` · ${esc(input.project.timeline)}` : ""}</p>
  </div>` : ""}
  <div class="notes">
    <p><strong>Notes</strong></p>
    <ul>
      <li>This estimate is valid for 14 days from the date above.</li>
      <li>Materials pricing is subject to change based on current market conditions.</li>
      ${pt.permitRequired ? "<li>Permits may be required. Permit fees are not included.</li>" : ""}
      <li>A formal proposal with payment schedule and terms will be provided upon acceptance.</li>
    </ul>
  </div>
</div>
<div class="footer">${co.name} · ${co.owner} · ${co.address} · ${co.phone} · ${co.email}</div>
</body>
</html>`;

  return { html, number: docNumber };
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
