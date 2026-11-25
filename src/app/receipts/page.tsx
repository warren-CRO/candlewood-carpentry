"use client";

import { useState, useCallback, useEffect, useRef } from "react";

const CATEGORIES = [
  "Materials",
  "Labor",
  "Tools/Equipment",
  "Fuel",
  "Permits",
  "Meals",
  "Office/Supplies",
  "Other",
] as const;

type Category = (typeof CATEGORIES)[number];

interface LineItem {
  id: string;
  description: string;
  amount: string;
  category: Category;
  job: string;
}

interface SavedReceipt {
  id: string;
  store: string;
  date: string;
  items: LineItem[];
  total: number;
  savedAt: string;
}

type Step = "capture" | "review" | "done";

function newId(): string {
  return crypto.randomUUID();
}

function parseAmount(v: string): number {
  const n = parseFloat(v);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
}

function fmt(n: number): string {
  return "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function loadHistory(): SavedReceipt[] {
  try {
    const raw = localStorage.getItem("cc_receipts");
    if (!raw) return [];
    return JSON.parse(raw) as SavedReceipt[];
  } catch {
    return [];
  }
}

function saveHistory(receipts: SavedReceipt[]): void {
  try {
    localStorage.setItem("cc_receipts", JSON.stringify(receipts));
  } catch {}
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ReceiptsPage() {
  const [step, setStep] = useState<Step>("capture");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");

  const [store, setStore] = useState("");
  const [date, setDate] = useState(todayStr);
  const [items, setItems] = useState<LineItem[]>([]);
  const [tax, setTax] = useState("");
  const [receiptTotal, setReceiptTotal] = useState("");

  const [history, setHistory] = useState<SavedReceipt[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [approved, setApproved] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const itemsTotal = items.reduce((s, i) => s + parseAmount(i.amount), 0);

  const byJob = items.reduce<Record<string, number>>((acc, i) => {
    const a = parseAmount(i.amount);
    const j = i.job.trim() || "Unassigned";
    if (a > 0) acc[j] = (acc[j] || 0) + a;
    return acc;
  }, {});

  const handlePhoto = useCallback(async (file: File) => {
    setError("");
    setScanning(true);

    try {
      const dataUrl = await fileToDataUrl(file);
      setPreview(dataUrl);

      const res = await fetch("/api/receipt/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Could not read receipt. Try a clearer photo.");
        setScanning(false);
        return;
      }

      const r = data.receipt;
      setStore(r.store || "");
      setDate(r.date || todayStr());
      setTax(r.tax != null ? String(r.tax) : "");
      setReceiptTotal(r.total != null ? String(r.total) : "");
      setItems(
        (r.items || []).map((it: { description: string; amount: number; category: string; job: string }) => ({
          id: newId(),
          description: it.description || "",
          amount: String(it.amount || 0),
          category: (it.category as Category) || "Materials",
          job: it.job || "",
        })),
      );
      setStep("review");
    } catch {
      setError("Something went wrong. Check your connection and try again.");
    }

    setScanning(false);
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handlePhoto(file);
    },
    [handlePhoto],
  );

  const updateItem = useCallback((id: string, field: keyof LineItem, value: string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const addItem = useCallback(() => {
    setItems((prev) => [...prev, { id: newId(), description: "", amount: "", category: "Materials", job: "" }]);
  }, []);

  const handleApprove = useCallback(() => {
    if (!store.trim()) return;
    const receipt: SavedReceipt = {
      id: newId(),
      store: store.trim(),
      date,
      items: items.filter((i) => parseAmount(i.amount) > 0),
      total: parseAmount(receiptTotal) || itemsTotal,
      savedAt: new Date().toISOString(),
    };
    const updated = [receipt, ...loadHistory()];
    saveHistory(updated);
    setHistory(updated);
    setApproved(true);
    setStep("done");
  }, [store, date, items, receiptTotal, itemsTotal]);

  const handleExportCSV = useCallback(() => {
    const rows = items
      .filter((i) => parseAmount(i.amount) > 0)
      .map((i) => [date, store.trim(), i.description.trim(), i.category, i.job.trim() || "Unassigned", parseAmount(i.amount).toFixed(2)]);
    const header = ["Date", "Store", "Description", "Category", "Job", "Amount"];
    const csv = [header, ...rows].map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${date}-${store.trim().replace(/\s+/g, "-").toLowerCase() || "unnamed"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [items, date, store]);

  const handleNewReceipt = useCallback(() => {
    setStep("capture");
    setStore("");
    setDate(todayStr());
    setItems([]);
    setTax("");
    setReceiptTotal("");
    setPreview("");
    setError("");
    setApproved(false);
    if (fileRef.current) fileRef.current.value = "";
  }, []);

  const deleteHistoryItem = useCallback((id: string) => {
    const updated = loadHistory().filter((r) => r.id !== id);
    saveHistory(updated);
    setHistory(updated);
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px 120px" }}>
      <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", marginBottom: 4 }}>Receipt Splitter</h1>
      <p style={{ color: "var(--slate)", marginBottom: 24, fontSize: "0.95rem" }}>
        Take a photo of your receipt. Write client names next to items first.
      </p>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* ═══ STEP 1: CAPTURE ═══ */}
      {step === "capture" && (
        <>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={scanning}
            style={{
              width: "100%",
              padding: scanning ? "32px 24px" : "48px 24px",
              borderRadius: "var(--radius)",
              border: "3px dashed var(--navy)",
              background: scanning ? "var(--mist)" : "var(--white)",
              color: "var(--navy)",
              fontSize: scanning ? "1rem" : "1.2rem",
              fontWeight: 700,
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              cursor: scanning ? "wait" : "pointer",
              textAlign: "center",
              letterSpacing: "0.04em",
              minHeight: 140,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            {scanning ? (
              <>
                <span style={{ fontSize: "2rem" }}>&#8987;</span>
                Reading your receipt...
              </>
            ) : (
              <>
                <span style={{ fontSize: "2.4rem" }}>&#128247;</span>
                TAP TO TAKE A PHOTO
              </>
            )}
          </button>

          {preview && (
            <div style={{ marginTop: 16, borderRadius: 12, overflow: "hidden", border: "1px solid var(--line)" }}>
              <img src={preview} alt="Receipt preview" style={{ width: "100%", display: "block" }} />
            </div>
          )}

          {error && (
            <div
              style={{
                marginTop: 16,
                padding: "14px 18px",
                borderRadius: 12,
                background: "#fef2f2",
                color: "#a3262a",
                fontWeight: 500,
                fontSize: "0.95rem",
              }}
            >
              {error}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                style={{
                  display: "block",
                  marginTop: 10,
                  ...btnStyle,
                  background: "#a3262a",
                  borderColor: "#a3262a",
                  fontSize: "0.9rem",
                  padding: "10px 20px",
                  minHeight: 44,
                }}
              >
                Try Again
              </button>
            </div>
          )}
        </>
      )}

      {/* ═══ STEP 2: REVIEW & EDIT ═══ */}
      {step === "review" && (
        <>
          {/* Total banner */}
          <div
            style={{
              background: "var(--navy)",
              color: "var(--white)",
              borderRadius: "var(--radius)",
              padding: "16px 24px",
              marginBottom: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>RECEIPT TOTAL</div>
              <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "1.8rem", fontWeight: 700 }}>
                {fmt(parseAmount(receiptTotal) || itemsTotal)}
              </div>
            </div>
            {parseAmount(tax) > 0 && (
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>TAX</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>{fmt(parseAmount(tax))}</div>
              </div>
            )}
          </div>

          {/* Store + Date */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Store</label>
              <input type="text" value={store} onChange={(e) => setStore(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
            </div>
          </div>

          {/* Items */}
          <label style={{ ...labelStyle, marginBottom: 10, display: "block" }}>
            Items ({items.length}) — edit anything that looks wrong
          </label>

          {items.map((item, idx) => (
            <div
              key={item.id}
              style={{
                background: "var(--mist)",
                borderRadius: 12,
                padding: 14,
                marginBottom: 10,
                position: "relative",
              }}
            >
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                aria-label="Remove item"
                style={deleteBtnStyle}
              >
                &times;
              </button>

              <div style={{ fontSize: "0.75rem", color: "var(--slate)", marginBottom: 6 }}>Item {idx + 1}</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 90px", gap: 8, marginBottom: 8 }}>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  placeholder="Description"
                  style={inputStyle}
                />
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  value={item.amount}
                  onChange={(e) => updateItem(item.id, "amount", e.target.value)}
                  placeholder="$"
                  style={{ ...inputStyle, textAlign: "right" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <select
                  value={item.category}
                  onChange={(e) => updateItem(item.id, "category", e.target.value)}
                  style={inputStyle}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={item.job}
                  onChange={(e) => updateItem(item.id, "job", e.target.value)}
                  placeholder="Client / Job"
                  style={{ ...inputStyle, fontWeight: item.job ? 600 : 400, color: item.job ? "var(--navy)" : "var(--slate)" }}
                />
              </div>
            </div>
          ))}

          <button type="button" onClick={addItem} style={addBtnStyle}>
            + Add Item
          </button>

          {/* By Job summary */}
          {Object.keys(byJob).length > 0 && (
            <div style={{ margin: "20px 0 16px" }}>
              <div style={{ fontSize: "0.85rem", color: "var(--slate)", marginBottom: 6, fontWeight: 600 }}>By Job</div>
              {Object.entries(byJob)
                .sort((a, b) => b[1] - a[1])
                .map(([job, amt]) => (
                  <div key={job} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--line)", fontSize: "0.95rem" }}>
                    <span style={{ fontWeight: job === "Unassigned" ? 400 : 600, color: job === "Unassigned" ? "var(--slate)" : "var(--ink)" }}>{job}</span>
                    <span style={{ fontWeight: 600 }}>{fmt(amt)}</span>
                  </div>
                ))}
            </div>
          )}

          {/* Approve / Export / Retake */}
          <div style={{ display: "grid", gap: 10, marginTop: 24 }}>
            <button
              type="button"
              onClick={handleApprove}
              disabled={items.length === 0}
              style={{ ...btnStyle, background: "#276749", borderColor: "#276749", fontSize: "1.1rem", padding: "18px 28px", opacity: items.length === 0 ? 0.4 : 1 }}
            >
              Approve &amp; Save
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={items.length === 0}
              style={{ ...btnStyle, background: "var(--white)", color: "var(--navy)", borderColor: "var(--navy)", opacity: items.length === 0 ? 0.4 : 1 }}
            >
              Export CSV
            </button>
            <button type="button" onClick={handleNewReceipt} style={{ ...btnStyle, background: "transparent", color: "var(--slate)", borderColor: "var(--line)" }}>
              Retake Photo
            </button>
          </div>
        </>
      )}

      {/* ═══ STEP 3: DONE ═══ */}
      {step === "done" && (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>&#10003;</div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: 8 }}>Receipt Saved</h2>
          <p style={{ color: "var(--slate)", marginBottom: 24 }}>
            {store} &middot; {fmt(parseAmount(receiptTotal) || itemsTotal)} &middot; {items.length} items
          </p>
          <button type="button" onClick={handleNewReceipt} style={{ ...btnStyle, margin: "0 auto" }}>
            Scan Another Receipt
          </button>
        </div>
      )}

      {/* ═══ HISTORY ═══ */}
      {history.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <button type="button" onClick={() => setHistoryOpen(!historyOpen)} style={historyToggleStyle}>
            <span>Past Receipts ({history.length})</span>
            <span style={{ fontSize: "1.2rem" }}>{historyOpen ? "−" : "+"}</span>
          </button>

          {historyOpen &&
            history.map((r) => (
              <div key={r.id} style={historyRowStyle}>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--ink)" }}>{r.store}</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--slate)" }}>
                    {r.date} &middot; {r.items.length} item{r.items.length !== 1 ? "s" : ""}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontWeight: 700, color: "var(--ink)" }}>{fmt(r.total)}</span>
                  <button type="button" onClick={() => deleteHistoryItem(r.id)} aria-label="Delete" style={deleteBtnStyle}>
                    &times;
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontWeight: 600,
  color: "var(--ink)",
  fontSize: "0.95rem",
  marginBottom: 6,
};

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

const btnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "16px 28px",
  borderRadius: 999,
  border: "2px solid var(--navy)",
  background: "var(--navy)",
  color: "var(--white)",
  fontFamily: "inherit",
  fontWeight: 600,
  fontSize: "1rem",
  cursor: "pointer",
  minHeight: 52,
};

const addBtnStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  borderRadius: 12,
  border: "2px dashed var(--line)",
  background: "transparent",
  color: "var(--navy)",
  fontWeight: 600,
  fontSize: "0.95rem",
  cursor: "pointer",
  fontFamily: "inherit",
  minHeight: 48,
  marginTop: 8,
};

const deleteBtnStyle: React.CSSProperties = {
  position: "absolute" as const,
  top: 8,
  right: 8,
  width: 32,
  height: 32,
  borderRadius: "50%",
  border: "none",
  background: "rgba(163,38,42,0.1)",
  color: "#a3262a",
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const historyToggleStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 12,
  border: "1px solid var(--line)",
  background: "var(--mist)",
  color: "var(--ink)",
  fontWeight: 600,
  fontSize: "1rem",
  cursor: "pointer",
  fontFamily: "inherit",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const historyRowStyle: React.CSSProperties = {
  background: "var(--white)",
  border: "1px solid var(--line)",
  borderRadius: 12,
  padding: 16,
  marginTop: 10,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "relative",
};
