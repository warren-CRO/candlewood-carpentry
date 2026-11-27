"use client";

export default function GuidePage() {
  return (
    <div style={{ maxWidth: 650, margin: "0 auto", padding: "24px 16px 120px" }}>
      <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", marginBottom: 4 }}>System Guide</h1>
      <p style={{ color: "var(--slate)", marginBottom: 32, fontSize: "0.95rem" }}>
        Everything your Traction system does and how to use it.
      </p>

      <Section
        icon="&#128222;"
        title="Your AI Phone Number"
        subtitle="(959) 300-2141"
      >
        <p>This is your business line. Set up call forwarding on your cell so unanswered calls go here. When someone calls:</p>
        <ul>
          <li><strong>Customers</strong> hear: &quot;Thanks for calling Candlewood Carpentry. Chad&rsquo;s on a job right now. Leave your name, what you need done, and the best number to reach you.&quot;</li>
          <li><strong>You</strong> hear: &quot;Hey, it&rsquo;s your Traction assistant. What do you need?&quot; — then you can dictate receipts, estimates, or invoices.</li>
        </ul>
        <Callout>
          To set up forwarding: call your carrier or dial *72 followed by 9593002141 (varies by carrier). This only forwards calls you don&rsquo;t answer — your phone still rings first.
        </Callout>
      </Section>

      <Section
        icon="&#128276;"
        title="Lead Capture"
        subtitle="Never lose a lead again"
      >
        <p>When someone leaves a voicemail or texts your Traction number:</p>
        <ol>
          <li><strong>Instant text to the caller:</strong> &quot;Thanks for calling Candlewood Carpentry! Chad got your message and will call you back shortly.&quot;</li>
          <li><strong>Alert to you:</strong> You get a text with their name, what they need, and their number.</li>
          <li><strong>30-min follow-up:</strong> If you haven&rsquo;t called back yet, they get: &quot;Chad got your message and is wrapping up a job. He&rsquo;ll give you a call shortly.&quot;</li>
          <li><strong>2-hour follow-up:</strong> If still no contact: &quot;Chad plans to reach out today. If your project is urgent, call (203) 470-7424.&quot;</li>
          <li><strong>CRM entry:</strong> The lead is added to your sales pipeline automatically.</li>
        </ol>
        <Callout>
          Follow-ups stop automatically once you move the lead past &quot;New Lead&quot; in GoHighLevel.
        </Callout>
      </Section>

      <Section
        icon="&#127908;"
        title="Voice Assistant"
        subtitle="Dictate receipts, estimates, and invoices"
      >
        <p>Open <a href="/tools" style={{ color: "var(--navy)", fontWeight: 600 }}>Tools</a> and tap the big &quot;TAP TO TALK&quot; button. Speak naturally:</p>
        <ul>
          <li>&quot;Log $47 of lumber at Home Depot for the Miller job&quot;</li>
          <li>&quot;Create an estimate for John Smith, deck repair, 200 square feet&quot;</li>
          <li>&quot;Invoice the Petersons for the kitchen remodel, $12,500&quot;</li>
        </ul>
        <p>Or text the same thing to <strong>(959) 300-2141</strong> from your phone. Same AI, same result.</p>
      </Section>

      <Section
        icon="&#128247;"
        title="Receipt Scanner"
        subtitle="Text a photo or use the web tool"
      >
        <p><strong>By text:</strong> Take a photo of a receipt and text it to (959) 300-2141. You&rsquo;ll get back the store, total, and key items.</p>
        <p><strong>On the web:</strong> Open <a href="/receipts" style={{ color: "var(--navy)", fontWeight: 600 }}>Receipt Scanner</a>, photograph the receipt, and assign costs to jobs. The scanner reads store name, date, line items, and totals automatically.</p>
      </Section>

      <Section
        icon="&#128196;"
        title="Estimates"
        subtitle="Quick pricing for prospects"
      >
        <p>Open <a href="/tools" style={{ color: "var(--navy)", fontWeight: 600 }}>Tools</a> → <strong>New Estimate</strong>. Fill in:</p>
        <ul>
          <li>Client name and address</li>
          <li>Project type (deck build, kitchen remodel, etc.)</li>
          <li>Square footage and materials tier</li>
          <li>Scope of work description</li>
        </ul>
        <p>The system calculates pricing based on your rates ($65/hr labor, material costs per sq ft by tier). It generates a branded estimate you can print or save as PDF.</p>
        <p>Or use <strong>custom line items</strong> — toggle the checkbox to enter your own items and prices instead of auto-pricing.</p>
      </Section>

      <Section
        icon="&#128221;"
        title="Proposals"
        subtitle="Full proposals with payment schedule and terms"
      >
        <p>Open <a href="/tools" style={{ color: "var(--navy)", fontWeight: 600 }}>Tools</a> → <strong>New Proposal</strong>. Same inputs as an estimate, but generates a complete proposal with:</p>
        <ul>
          <li>Itemized cost breakdown (materials, labor, subs, overhead, contingency)</li>
          <li>Payment schedule: 50% deposit, 25% at midpoint, 25% at completion</li>
          <li>Estimated timeline</li>
          <li>10 professional terms &amp; conditions</li>
          <li>Signature lines for you and the client</li>
        </ul>
        <Callout>
          <strong>Estimate vs. Proposal:</strong> Send an estimate first (quick ballpark, valid 14 days). If the client wants to proceed, send a proposal (formal contract with payment terms, valid 30 days).
        </Callout>
      </Section>

      <Section
        icon="&#128176;"
        title="Invoices"
        subtitle="Bill for completed work"
      >
        <p>Open <a href="/tools" style={{ color: "var(--navy)", fontWeight: 600 }}>Tools</a> → <strong>New Invoice</strong>. Add line items for the work completed, set a due date, and generate. The invoice includes your company info, the client&rsquo;s details, and a professional layout ready to print or email.</p>
      </Section>

      <Section
        icon="&#128188;"
        title="Jobs &amp; Profitability"
        subtitle="Track expenses and margins on every job"
      >
        <p>Open <a href="/jobs" style={{ color: "var(--navy)", fontWeight: 600 }}>Jobs</a> to see all your active jobs from the pipeline. Tap any job to:</p>
        <ul>
          <li><strong>Log expenses</strong> — materials, subcontractor costs, permits, anything you spend</li>
          <li><strong>See profitability</strong> — revenue vs. expenses, profit, and margin percentage</li>
        </ul>
        <p>The <a href="/dashboard" style={{ color: "var(--navy)", fontWeight: 600 }}>Dashboard</a> shows the big picture: total pipeline value, revenue, expenses, net profit, and average margin across all your jobs.</p>
        <Callout>
          Log expenses as you go — every receipt you scan or cost you incur should be logged to the job. The more you track, the more accurate your margins.
        </Callout>
      </Section>

      <Section
        icon="&#128200;"
        title="Sales Pipeline (GoHighLevel)"
        subtitle="Track every lead from call to payment"
      >
        <p>Every inbound lead automatically enters your pipeline:</p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", marginTop: 8 }}>
            <thead>
              <tr>
                <th style={thStyle}>Stage</th>
                <th style={thStyle}>What it means</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["New Lead", "Just came in — hasn't been contacted yet"],
                ["Contacted", "You called or texted them back"],
                ["Site Visit Scheduled", "You're going to look at the job"],
                ["Estimate Sent", "They got a ballpark number"],
                ["Proposal Sent", "Formal proposal with terms"],
                ["Won / Under Contract", "They signed — job is on"],
                ["In Progress", "You're doing the work"],
                ["Job Complete", "Work is done"],
                ["Invoice Sent", "Bill is out"],
                ["Paid", "Money in the bank"],
                ["Lost", "Didn't work out"],
              ].map(([stage, desc]) => (
                <tr key={stage}>
                  <td style={tdStyle}><strong>{stage}</strong></td>
                  <td style={tdStyle}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout>
          Move leads through the stages as you work with them. The follow-up texts stop once a lead moves past &quot;New Lead&quot;.
        </Callout>
      </Section>

      <Section
        icon="&#128272;"
        title="Your Accounts"
        subtitle="What's set up"
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <tbody>
            {[
              ["Business phone", "(959) 300-2141 — Twilio AI line"],
              ["Email", "chad@candlewoodcarpentryllc.com — Google Workspace"],
              ["CRM", "GoHighLevel — lead tracking + automations"],
              ["Website", "candlewoodcarpentryllc.com"],
              ["Tools", "candlewoodcarpentryllc.com/tools"],
            ].map(([label, value]) => (
              <tr key={label}>
                <td style={{ ...tdStyle, fontWeight: 600, whiteSpace: "nowrap" }}>{label}</td>
                <td style={tdStyle}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <div style={{ marginTop: 40, padding: 20, borderRadius: 12, background: "var(--navy, #1b2a4a)", color: "#fff", textAlign: "center" }}>
        <div style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 8 }}>Need help?</div>
        <p style={{ fontSize: "0.9rem", opacity: 0.85, margin: 0 }}>
          Text &quot;HELP&quot; to (959) 300-2141 or call Warren at The CRO Collective.
        </p>
      </div>
    </div>
  );
}

function Section({ icon, title, subtitle, children }: { icon: string; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 32, paddingBottom: 32, borderBottom: "1.5px solid var(--line, #e5e7eb)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: "1.8rem" }}>{icon}</span>
        <div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0, color: "var(--navy, #1b2a4a)" }}>{title}</h2>
          <p style={{ fontSize: "0.8rem", color: "var(--slate, #64748b)", margin: 0 }}>{subtitle}</p>
        </div>
      </div>
      <div style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "var(--ink, #1a1a1a)" }}>
        {children}
      </div>
      <style>{`
        section ul, section ol { padding-left: 20px; margin: 8px 0 12px; }
        section li { margin-bottom: 6px; }
        section p { margin: 0 0 10px; }
      `}</style>
    </section>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      marginTop: 12,
      padding: "12px 16px",
      borderRadius: 8,
      borderLeft: "4px solid var(--navy, #1b2a4a)",
      background: "var(--mist, #f5f7fa)",
      fontSize: "0.85rem",
      lineHeight: 1.6,
    }}>
      {children}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 10px",
  borderBottom: "2px solid var(--line, #e5e7eb)",
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "var(--slate, #64748b)",
};

const tdStyle: React.CSSProperties = {
  padding: "8px 10px",
  borderBottom: "1px solid var(--line, #e5e7eb)",
};
