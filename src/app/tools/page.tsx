"use client";

import { useState, useCallback } from "react";

const PROJECT_TYPES: Record<string, string> = {
  "interior-painting": "Interior Painting",
  "exterior-painting": "Exterior Painting",
  "exterior-staining": "Exterior Staining",
  "window-replacement": "Window Replacement",
  "exterior-renovation": "Exterior Renovation",
  "kitchen-remodel": "Kitchen Remodel",
  "bathroom-remodel": "Bathroom Remodel",
  "deck-build": "Deck Build (New)",
  "deck-repair": "Deck Repair / Staining",
  "room-addition": "Room Addition",
  "custom-cabinetry": "Custom Cabinetry",
  "trim-work": "Trim / Molding / Finish Work",
  framing: "Framing",
  siding: "Siding",
  roofing: "Roofing",
  "general-carpentry": "General Carpentry",
};

type Tool = "menu" | "estimate" | "invoice";

interface LineItem {
  id: string;
  description: string;
  amount: string;
}

function newLine(): LineItem {
  return { id: crypto.randomUUID(), description: "", amount: "" };
}

function parseNum(v: string): number {
  const n = parseFloat(v);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
}

function fmt(n: number): string {
  return "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function ToolsPage() {
  const [tool, setTool] = useState<Tool>("menu");

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px 120px" }}>
      <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", marginBottom: 4 }}>Tools</h1>
      <p style={{ color: "var(--slate)", marginBottom: 24, fontSize: "0.95rem" }}>
        Generate estimates and invoices for your jobs.
      </p>

      {tool === "menu" && <ToolMenu onSelect={setTool} />}
      {tool === "estimate" && <EstimateForm onBack={() => setTool("menu")} />}
      {tool === "invoice" && <InvoiceForm onBack={() => setTool("menu")} />}
    </div>
  );
}

function ToolMenu({ onSelect }: { onSelect: (t: Tool) => void }) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <button type="button" onClick={() => onSelect("estimate")} style={cardBtnStyle}>
        <div style={{ fontSize: "2rem", marginBottom: 8 }}>&#128196;</div>
        <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--navy)" }}>New Estimate</div>
        <div style={{ fontSize: "0.85rem", color: "var(--slate)", marginTop: 4 }}>
          Create a professional estimate with pricing for a client.
        </div>
      </button>
      <button type="button" onClick={() => onSelect("invoice")} style={cardBtnStyle}>
        <div style={{ fontSize: "2rem", marginBottom: 8 }}>&#128176;</div>
        <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--navy)" }}>New Invoice</div>
        <div style={{ fontSize: "0.85rem", color: "var(--slate)", marginTop: 4 }}>
          Generate an invoice to send to a client for completed work.
        </div>
      </button>
      <a href="/receipts" style={{ ...cardBtnStyle, textDecoration: "none", display: "block" }}>
        <div style={{ fontSize: "2rem", marginBottom: 8 }}>&#128247;</div>
        <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--navy)" }}>Receipt Scanner</div>
        <div style={{ fontSize: "0.85rem", color: "var(--slate)", marginTop: 4 }}>
          Photograph a receipt and split costs across jobs.
        </div>
      </a>
    </div>
  );
}

function EstimateForm({ onBack }: { onBack: () => void }) {
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [projectType, setProjectType] = useState("general-carpentry");
  const [scope, setScope] = useState("");
  const [sqft, setSqft] = useState("");
  const [tier, setTier] = useState("Mid-Range");
  const [timelineWeeks, setTimelineWeeks] = useState("");
  const [specialConditions, setSpecialConditions] = useState("");
  const [items, setItems] = useState<LineItem[]>([newLine()]);
  const [useManualItems, setUseManualItems] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const total = items.reduce((s, i) => s + parseNum(i.amount), 0);

  const updateItem = useCallback((id: string, field: keyof LineItem, value: string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!clientName.trim() || !scope.trim()) return;
    if (!useManualItems && !sqft.trim()) return;

    setGenerating(true);
    setError("");

    const body: Record<string, unknown> = {
      client: {
        name: clientName.trim(),
        address: clientAddress.trim(),
        ...(clientPhone.trim() && { phone: clientPhone.trim() }),
        ...(clientEmail.trim() && { email: clientEmail.trim() }),
      },
      project: {
        type: projectType,
        scope: scope.trim(),
        sqft: parseNum(sqft),
        materialsTier: tier,
        ...(timelineWeeks.trim() && { timelineWeeks: parseInt(timelineWeeks) }),
        ...(specialConditions.trim() && { specialConditions: specialConditions.trim() }),
      },
    };

    if (useManualItems) {
      body.scopeItems = items
        .filter((i) => i.description.trim() && parseNum(i.amount) > 0)
        .map((i) => ({ description: i.description.trim(), amount: parseNum(i.amount) }));
    }

    try {
      const res = await fetch("/api/generate/estimate?format=html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as Record<string, string>).error || "Failed to generate estimate");
        setGenerating(false);
        return;
      }

      const html = await res.text();
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch {
      setError("Something went wrong. Try again.");
    }

    setGenerating(false);
  }, [clientName, clientAddress, clientPhone, clientEmail, projectType, scope, sqft, tier, timelineWeeks, specialConditions, items, useManualItems]);

  const canGenerate = clientName.trim() && scope.trim() && (useManualItems ? items.some((i) => parseNum(i.amount) > 0) : sqft.trim());

  return (
    <>
      <button type="button" onClick={onBack} style={backBtnStyle}>&larr; Back</button>
      <h2 style={{ fontSize: "1.4rem", marginBottom: 16 }}>New Estimate</h2>

      <SectionLabel>Client Info</SectionLabel>
      <input type="text" placeholder="Client name *" value={clientName} onChange={(e) => setClientName(e.target.value)} style={{ ...inputStyle, marginBottom: 10 }} />
      <input type="text" placeholder="Address *" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} style={{ ...inputStyle, marginBottom: 10 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        <input type="tel" placeholder="Phone" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} style={inputStyle} />
        <input type="email" placeholder="Email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} style={inputStyle} />
      </div>

      <SectionLabel>Project</SectionLabel>
      <select value={projectType} onChange={(e) => setProjectType(e.target.value)} style={{ ...inputStyle, marginBottom: 10 }}>
        {Object.entries(PROJECT_TYPES).map(([k, v]) => (
          <option key={k} value={k}>{v}</option>
        ))}
      </select>
      <textarea
        placeholder="Scope of work — describe what you'll do *"
        value={scope}
        onChange={(e) => setScope(e.target.value)}
        rows={3}
        style={{ ...inputStyle, marginBottom: 10, resize: "vertical" }}
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div>
          <label style={smallLabelStyle}>Square footage</label>
          <input type="number" inputMode="numeric" placeholder="e.g. 200" value={sqft} onChange={(e) => setSqft(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={smallLabelStyle}>Materials tier</label>
          <select value={tier} onChange={(e) => setTier(e.target.value)} style={inputStyle}>
            <option value="Standard">Standard</option>
            <option value="Mid-Range">Mid-Range</option>
            <option value="Premium">Premium</option>
          </select>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div>
          <label style={smallLabelStyle}>Timeline (weeks)</label>
          <input type="number" inputMode="numeric" placeholder="e.g. 4" value={timelineWeeks} onChange={(e) => setTimelineWeeks(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={smallLabelStyle}>Special conditions</label>
          <input type="text" placeholder="Optional" value={specialConditions} onChange={(e) => setSpecialConditions(e.target.value)} style={inputStyle} />
        </div>
      </div>

      {/* Manual line items toggle */}
      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input type="checkbox" checked={useManualItems} onChange={(e) => setUseManualItems(e.target.checked)} style={{ width: 20, height: 20 }} />
          <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>Use custom line items instead of auto-pricing</span>
        </label>
      </div>

      {useManualItems && (
        <>
          <SectionLabel>Line Items</SectionLabel>
          {items.map((item, idx) => (
            <div key={item.id} style={{ display: "grid", gridTemplateColumns: "1fr 100px 36px", gap: 8, marginBottom: 8, alignItems: "center" }}>
              <input type="text" placeholder={`Item ${idx + 1}`} value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)} style={inputStyle} />
              <input type="number" inputMode="decimal" step="0.01" placeholder="$" value={item.amount} onChange={(e) => updateItem(item.id, "amount", e.target.value)} style={{ ...inputStyle, textAlign: "right" }} />
              <button type="button" onClick={() => setItems((p) => p.length > 1 ? p.filter((i) => i.id !== item.id) : p)} style={miniDeleteStyle}>&times;</button>
            </div>
          ))}
          <button type="button" onClick={() => setItems((p) => [...p, newLine()])} style={addBtnStyle}>+ Add Item</button>
          {total > 0 && (
            <div style={{ textAlign: "right", fontWeight: 700, fontSize: "1.1rem", marginTop: 8 }}>
              Total: {fmt(total)}
            </div>
          )}
        </>
      )}

      {error && <div style={errorStyle}>{error}</div>}

      <button
        type="button"
        onClick={handleGenerate}
        disabled={!canGenerate || generating}
        style={{ ...primaryBtnStyle, marginTop: 24, opacity: !canGenerate || generating ? 0.4 : 1 }}
      >
        {generating ? "Generating..." : "Generate Estimate"}
      </button>
    </>
  );
}

function InvoiceForm({ onBack }: { onBack: () => void }) {
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [projectType, setProjectType] = useState("general-carpentry");
  const [projectDesc, setProjectDesc] = useState("");
  const [items, setItems] = useState<LineItem[]>([newLine()]);
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const total = items.reduce((s, i) => s + parseNum(i.amount), 0);

  const updateItem = useCallback((id: string, field: keyof LineItem, value: string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!clientName.trim() || !projectDesc.trim()) return;
    const validItems = items.filter((i) => i.description.trim() && parseNum(i.amount) > 0);
    if (validItems.length === 0) return;

    setGenerating(true);
    setError("");

    const body = {
      client: {
        name: clientName.trim(),
        address: clientAddress.trim(),
        ...(clientPhone.trim() && { phone: clientPhone.trim() }),
        ...(clientEmail.trim() && { email: clientEmail.trim() }),
      },
      project: { type: projectType, description: projectDesc.trim() },
      lineItems: validItems.map((i) => ({ description: i.description.trim(), amount: parseNum(i.amount) })),
      ...(dueDate && { dueDate }),
      ...(notes.trim() && { notes: notes.trim() }),
    };

    try {
      const res = await fetch("/api/generate/invoice?format=html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as Record<string, string>).error || "Failed to generate invoice");
        setGenerating(false);
        return;
      }

      const html = await res.text();
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch {
      setError("Something went wrong. Try again.");
    }

    setGenerating(false);
  }, [clientName, clientAddress, clientPhone, clientEmail, projectType, projectDesc, items, dueDate, notes]);

  const canGenerate = clientName.trim() && projectDesc.trim() && items.some((i) => i.description.trim() && parseNum(i.amount) > 0);

  return (
    <>
      <button type="button" onClick={onBack} style={backBtnStyle}>&larr; Back</button>
      <h2 style={{ fontSize: "1.4rem", marginBottom: 16 }}>New Invoice</h2>

      <SectionLabel>Client Info</SectionLabel>
      <input type="text" placeholder="Client name *" value={clientName} onChange={(e) => setClientName(e.target.value)} style={{ ...inputStyle, marginBottom: 10 }} />
      <input type="text" placeholder="Address" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} style={{ ...inputStyle, marginBottom: 10 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        <input type="tel" placeholder="Phone" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} style={inputStyle} />
        <input type="email" placeholder="Email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} style={inputStyle} />
      </div>

      <SectionLabel>Project</SectionLabel>
      <select value={projectType} onChange={(e) => setProjectType(e.target.value)} style={{ ...inputStyle, marginBottom: 10 }}>
        {Object.entries(PROJECT_TYPES).map(([k, v]) => (
          <option key={k} value={k}>{v}</option>
        ))}
      </select>
      <textarea
        placeholder="Project description *"
        value={projectDesc}
        onChange={(e) => setProjectDesc(e.target.value)}
        rows={2}
        style={{ ...inputStyle, marginBottom: 16, resize: "vertical" }}
      />

      <SectionLabel>Line Items</SectionLabel>
      {items.map((item, idx) => (
        <div key={item.id} style={{ display: "grid", gridTemplateColumns: "1fr 100px 36px", gap: 8, marginBottom: 8, alignItems: "center" }}>
          <input type="text" placeholder={`Item ${idx + 1}`} value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)} style={inputStyle} />
          <input type="number" inputMode="decimal" step="0.01" placeholder="$" value={item.amount} onChange={(e) => updateItem(item.id, "amount", e.target.value)} style={{ ...inputStyle, textAlign: "right" }} />
          <button type="button" onClick={() => setItems((p) => p.length > 1 ? p.filter((i) => i.id !== item.id) : p)} style={miniDeleteStyle}>&times;</button>
        </div>
      ))}
      <button type="button" onClick={() => setItems((p) => [...p, newLine()])} style={addBtnStyle}>+ Add Item</button>
      {total > 0 && (
        <div style={{ textAlign: "right", fontWeight: 700, fontSize: "1.1rem", marginTop: 8 }}>
          Total: {fmt(total)}
        </div>
      )}

      <SectionLabel style={{ marginTop: 20 }}>Details</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div>
          <label style={smallLabelStyle}>Due date</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={inputStyle} />
        </div>
      </div>
      <textarea
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        style={{ ...inputStyle, resize: "vertical" }}
      />

      {error && <div style={errorStyle}>{error}</div>}

      <button
        type="button"
        onClick={handleGenerate}
        disabled={!canGenerate || generating}
        style={{ ...primaryBtnStyle, marginTop: 24, opacity: !canGenerate || generating ? 0.4 : 1 }}
      >
        {generating ? "Generating..." : "Generate Invoice"}
      </button>
    </>
  );
}

function SectionLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, ...style }}>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  font: "inherit",
  fontSize: "1rem",
  color: "var(--ink)",
  background: "var(--white)",
  border: "1.5px solid var(--line)",
  borderRadius: 12,
  padding: "12px 14px",
  minHeight: 48,
  boxSizing: "border-box",
};

const smallLabelStyle: React.CSSProperties = {
  display: "block",
  fontWeight: 500,
  color: "var(--slate)",
  fontSize: "0.8rem",
  marginBottom: 4,
};

const cardBtnStyle: React.CSSProperties = {
  padding: "28px 24px",
  borderRadius: "var(--radius)",
  border: "1.5px solid var(--line)",
  background: "var(--white)",
  cursor: "pointer",
  textAlign: "center",
  fontFamily: "inherit",
};

const primaryBtnStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "18px 28px",
  borderRadius: 999,
  border: "2px solid var(--navy)",
  background: "var(--navy)",
  color: "var(--white)",
  fontFamily: "inherit",
  fontWeight: 700,
  fontSize: "1.1rem",
  cursor: "pointer",
  minHeight: 56,
};

const backBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "var(--navy)",
  fontWeight: 600,
  fontSize: "1rem",
  cursor: "pointer",
  padding: "8px 0",
  marginBottom: 12,
  fontFamily: "inherit",
};

const addBtnStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  borderRadius: 12,
  border: "2px dashed var(--line)",
  background: "transparent",
  color: "var(--navy)",
  fontWeight: 600,
  fontSize: "0.9rem",
  cursor: "pointer",
  fontFamily: "inherit",
  minHeight: 44,
};

const miniDeleteStyle: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  border: "none",
  background: "rgba(163,38,42,0.1)",
  color: "#a3262a",
  fontSize: 18,
  fontWeight: 700,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const errorStyle: React.CSSProperties = {
  marginTop: 12,
  padding: "12px 16px",
  borderRadius: 12,
  background: "#fef2f2",
  color: "#a3262a",
  fontWeight: 500,
  fontSize: "0.9rem",
};
