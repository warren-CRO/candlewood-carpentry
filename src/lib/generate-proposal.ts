import { COMPANY, DEFAULTS, PROJECT_TYPES, calculateCosts, fmt, parseTier, type SubLine } from "./pricing";

export interface ProposalInput {
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
  subs?: Array<{ trade: string; name?: string; hours: number; rate: number }>;
  overrides?: { total?: number };
}

let proposalCounter = 0;

function nextProposalNumber(): string {
  proposalCounter++;
  const now = new Date();
  const year = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  return `CC-${year}-${mm}${dd}${hh}`;
}

export function generateProposal(input: ProposalInput): { html: string; number: string } {
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

  const costs = calculateCosts(input.project.type, input.project.sqft, tier, subs, input.overrides?.total);
  const docNumber = nextProposalNumber();
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const timelineWeeks = input.project.timelineWeeks || Math.ceil((pt.typicalWeeks.min + pt.typicalWeeks.max) / 2);

  const paymentTerms = {
    deposit: DEFAULTS.paymentTerms.deposit,
    depositAmount: Math.round(costs.total * (DEFAULTS.paymentTerms.deposit / 100)),
    midpoint: DEFAULTS.paymentTerms.midpoint,
    midpointAmount: Math.round(costs.total * (DEFAULTS.paymentTerms.midpoint / 100)),
    completion: DEFAULTS.paymentTerms.completion,
    completionAmount: Math.round(costs.total * (DEFAULTS.paymentTerms.completion / 100)),
  };

  const subsRows = costs.subs
    .map((s) => `
      <tr>
        <td>Subcontractor — ${esc(s.trade)}${s.name ? ` (${esc(s.name)})` : ""}</td>
        <td class="num">${s.hours} hrs × ${fmt(s.rate)}/hr</td>
        <td class="num">${fmt(s.total)}</td>
      </tr>`)
    .join("");

  const co = COMPANY;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Proposal ${docNumber} — ${esc(input.client.name)}</title>
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
  .subtotal-row td { color:var(--muted); font-size:12px; }
  .payment-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin:12px 0; }
  .payment-card { background:#f8f8f8; border-radius:6px; padding:14px; text-align:center; }
  .payment-card .label { font-size:10px; text-transform:uppercase; letter-spacing:1px; color:var(--muted); }
  .payment-card .amount { font-size:20px; font-weight:700; color:var(--accent); margin:4px 0; }
  .payment-card .pct { font-size:11px; color:var(--muted); }
  .timeline-bar { background:var(--accent-light); border-left:4px solid var(--accent); padding:12px 16px; border-radius:0 6px 6px 0; margin:12px 0; }
  .terms { font-size:11px; color:var(--muted); line-height:1.6; }
  .terms ol { padding-left:20px; }
  .terms li { margin-bottom:4px; }
  .signature { display:grid; grid-template-columns:1fr 1fr; gap:40px; margin-top:40px; padding-top:20px; }
  .sig-block { border-top:1.5px solid var(--fg); padding-top:8px; }
  .sig-label { font-size:11px; color:var(--muted); }
  .sig-name { font-size:13px; font-weight:600; margin-top:2px; }
  .sig-date { font-size:11px; color:var(--muted); margin-top:24px; }
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
      <h3>Proposal</h3>
      <p><strong>${docNumber}</strong><br>Date: ${today}<br>Valid for 30 days</p>
    </div>
  </div>
  <h2>Scope of Work</h2>
  <div class="scope">
    <p><strong>${esc(pt.label)}</strong> — ${input.project.sqft > 0 ? input.project.sqft + " sq ft · " : ""}${esc(tierLabel)} materials</p>
    <p style="margin-top:8px;">${esc(input.project.scope)}</p>
    ${input.project.specialConditions ? `<p style="margin-top:8px;color:var(--warm);"><strong>Special conditions:</strong> ${esc(input.project.specialConditions)}</p>` : ""}
    ${pt.permitRequired ? `<p style="margin-top:4px;font-size:11px;color:var(--muted);">* Permits required. Permit fees are additional and not included in this proposal.</p>` : ""}
  </div>
  <h2>Cost Breakdown</h2>
  <table>
    <thead><tr><th>Item</th><th class="num">Detail</th><th class="num">Amount</th></tr></thead>
    <tbody>
      <tr>
        <td>Materials (${esc(tierLabel)})</td>
        <td class="num">${input.project.sqft > 0 ? input.project.sqft + " sq ft" : ""}</td>
        <td class="num">${fmt(costs.materials)}</td>
      </tr>
      <tr>
        <td>Labor</td>
        <td class="num">${costs.laborHours} hrs × ${fmt(costs.laborRate)}/hr</td>
        <td class="num">${fmt(costs.laborTotal)}</td>
      </tr>
      ${subsRows}
      <tr class="subtotal-row"><td colspan="2">Subtotal</td><td class="num">${fmt(costs.subtotal)}</td></tr>
      <tr class="subtotal-row"><td colspan="2">Overhead &amp; Profit (${costs.markupPercent}%)</td><td class="num">${fmt(costs.markup)}</td></tr>
      <tr class="subtotal-row"><td colspan="2">Contingency (${costs.contingencyPercent}%)</td><td class="num">${fmt(costs.contingency)}</td></tr>
      <tr class="total-row"><td colspan="2">Total</td><td class="num">${fmt(costs.total)}</td></tr>
    </tbody>
  </table>
  <h2>Payment Schedule</h2>
  <div class="payment-grid">
    <div class="payment-card">
      <div class="label">Deposit</div>
      <div class="amount">${fmt(paymentTerms.depositAmount)}</div>
      <div class="pct">${paymentTerms.deposit}% — Due at signing</div>
    </div>
    <div class="payment-card">
      <div class="label">Midpoint</div>
      <div class="amount">${fmt(paymentTerms.midpointAmount)}</div>
      <div class="pct">${paymentTerms.midpoint}% — At project midpoint</div>
    </div>
    <div class="payment-card">
      <div class="label">Completion</div>
      <div class="amount">${fmt(paymentTerms.completionAmount)}</div>
      <div class="pct">${paymentTerms.completion}% — Upon completion</div>
    </div>
  </div>
  <h2>Timeline</h2>
  <div class="timeline-bar">
    <strong>Estimated duration: ${timelineWeeks} week${timelineWeeks !== 1 ? "s" : ""}</strong>
    <span style="color:var(--muted);"> · ${esc(input.project.timeline || "Standard timeline")}</span>
  </div>
  <h2>Terms &amp; Conditions</h2>
  <div class="terms">
    <ol>
      <li>This proposal is valid for 30 days from the date above.</li>
      <li>Work will begin within 5 business days of signed acceptance and deposit receipt.</li>
      <li>Any changes to the scope of work after acceptance may result in additional charges, which will be communicated and approved in writing before proceeding.</li>
      <li>Owner is responsible for obtaining all necessary permits unless otherwise agreed. Permit fees are not included in this proposal.</li>
      <li>Candlewood Carpentry carries workers' compensation and general liability insurance. Certificates available upon request.</li>
      <li>Materials pricing is subject to change if project start is delayed beyond 30 days due to current market conditions.</li>
      <li>Worksite must be accessible during normal business hours (7:00 AM – 4:00 PM, Monday–Friday).</li>
      <li>Owner agrees to make decisions on materials, colors, and fixtures in a timely manner to avoid project delays.</li>
      <li>Final payment is due upon satisfactory completion of work as described in the scope above.</li>
      <li>Any dispute shall be resolved through mediation in Fairfield County, CT before pursuing other remedies.</li>
    </ol>
  </div>
  <div class="signature">
    <div>
      <div class="sig-block">
        <div class="sig-label">Contractor</div>
        <div class="sig-name">${co.owner}, ${co.name}</div>
      </div>
      <div class="sig-date">Date: _______________</div>
    </div>
    <div>
      <div class="sig-block">
        <div class="sig-label">Client</div>
        <div class="sig-name">${esc(input.client.name)}</div>
      </div>
      <div class="sig-date">Date: _______________</div>
    </div>
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
