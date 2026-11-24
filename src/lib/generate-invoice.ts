import { COMPANY, fmt } from "./pricing";

export interface InvoiceInput {
  client: { name: string; address: string; phone?: string; email?: string };
  project: {
    type: string;
    description: string;
  };
  lineItems: Array<{ description: string; amount: number }>;
  payments?: Array<{ date: string; description: string; amount: number }>;
  dueDate?: string;
  notes?: string;
}

let invoiceCounter = 0;

function nextInvoiceNumber(): string {
  invoiceCounter++;
  const year = new Date().getFullYear();
  const ts = Date.now().toString(36).slice(-4).toUpperCase();
  return `CCI-${year}-${ts}${String(invoiceCounter).padStart(2, "0")}`;
}

export function generateInvoice(input: InvoiceInput): { html: string; number: string } {
  const docNumber = nextInvoiceNumber();
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const dueDate = input.dueDate || new Date(Date.now() + 30 * 86400000).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const subtotal = input.lineItems.reduce((s, i) => s + i.amount, 0);
  const paid = (input.payments || []).reduce((s, p) => s + p.amount, 0);
  const balanceDue = subtotal - paid;

  const lineItemRows = input.lineItems
    .map((item) => `
      <tr>
        <td>${esc(item.description)}</td>
        <td class="num">${fmt(item.amount)}</td>
      </tr>`)
    .join("");

  const paymentRows = (input.payments || [])
    .map((p) => `
      <tr class="payment-row">
        <td>${esc(p.date)} — ${esc(p.description)}</td>
        <td class="num">-${fmt(p.amount)}</td>
      </tr>`)
    .join("");

  const co = COMPANY;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Invoice ${docNumber} — ${esc(input.client.name)}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  :root { --bg:#fff; --fg:#1a1a1a; --muted:#666; --border:#e0e0e0; --accent:#2c5282; --accent-light:#ebf4ff; --green:#276749; --green-light:#f0fff4; }
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
  table { width:100%; border-collapse:collapse; margin:8px 0 16px; }
  th { text-align:left; font-size:10px; text-transform:uppercase; letter-spacing:1px; color:var(--muted); padding:8px 12px; border-bottom:2px solid var(--border); }
  td { padding:8px 12px; border-bottom:1px solid var(--border); font-size:13px; }
  .num { text-align:right; font-variant-numeric:tabular-nums; }
  .subtotal-row td { color:var(--muted); font-size:12px; }
  .payment-row td { color:var(--green); font-size:12px; }
  .total-row td { font-weight:700; border-top:2px solid var(--accent); border-bottom:none; font-size:15px; }
  .balance-box { background:${balanceDue <= 0 ? "var(--green-light)" : "var(--accent-light)"}; border-radius:8px; padding:20px; text-align:center; margin:24px 0; }
  .balance-label { font-size:11px; text-transform:uppercase; letter-spacing:1.5px; color:var(--muted); }
  .balance-amount { font-size:28px; font-weight:700; color:${balanceDue <= 0 ? "var(--green)" : "var(--accent)"}; margin:4px 0; }
  .balance-due { font-size:12px; color:var(--muted); }
  .notes { background:#f8f8f8; border-radius:6px; padding:16px 20px; margin-top:20px; }
  .notes p { font-size:12px; color:var(--muted); line-height:1.6; }
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
      <h3>Bill To</h3>
      <p><strong>${esc(input.client.name)}</strong><br>
      ${esc(input.client.address)}${input.client.phone ? "<br>" + esc(input.client.phone) : ""}${input.client.email ? "<br>" + esc(input.client.email) : ""}</p>
    </div>
    <div class="meta-block" style="text-align:right;">
      <h3>Invoice</h3>
      <p><strong>${docNumber}</strong><br>Date: ${today}<br>Due: ${esc(dueDate)}</p>
    </div>
  </div>
  <h2>Project</h2>
  <p style="margin-bottom:16px;">${esc(input.project.description)}</p>
  <h2>Charges</h2>
  <table>
    <thead><tr><th>Description</th><th class="num">Amount</th></tr></thead>
    <tbody>
      ${lineItemRows}
      <tr class="subtotal-row"><td>Subtotal</td><td class="num">${fmt(subtotal)}</td></tr>
      ${paymentRows}
      <tr class="total-row"><td>${balanceDue <= 0 ? "Paid in Full" : "Balance Due"}</td><td class="num">${fmt(balanceDue)}</td></tr>
    </tbody>
  </table>
  <div class="balance-box">
    <div class="balance-label">${balanceDue <= 0 ? "Paid in Full" : "Balance Due"}</div>
    <div class="balance-amount">${fmt(Math.abs(balanceDue))}</div>
    ${balanceDue > 0 ? `<div class="balance-due">Due by ${esc(dueDate)}</div>` : `<div class="balance-due">Thank you for your payment</div>`}
  </div>
  ${input.notes ? `
  <div class="notes">
    <p><strong>Notes</strong></p>
    <p style="margin-top:8px;">${esc(input.notes)}</p>
  </div>` : ""}
  <div class="notes">
    <p><strong>Payment Methods</strong></p>
    <p style="margin-top:8px;">Check payable to Candlewood Carpentry LLC · Zelle to ${co.phone} · Venmo @chad-colesworthy</p>
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
