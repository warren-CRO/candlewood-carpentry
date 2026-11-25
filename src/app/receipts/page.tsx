"use client";

import { useState, useCallback, useEffect } from "react";

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

function newItem(): LineItem {
  return {
    id: crypto.randomUUID(),
    description: "",
    amount: "",
    category: "Materials",
    job: "",
  };
}

function todayStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
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
  } catch {
    /* storage full or unavailable */
  }
}

export default function ReceiptsPage() {
  const [store, setStore] = useState("");
  const [date, setDate] = useState(todayStr);
  const [items, setItems] = useState<LineItem[]>([newItem()]);
  const [history, setHistory] = useState<SavedReceipt[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const total = items.reduce((s, i) => s + parseAmount(i.amount), 0);

  const byCategory = items.reduce<Record<string, number>>((acc, i) => {
    const a = parseAmount(i.amount);
    if (a > 0) acc[i.category] = (acc[i.category] || 0) + a;
    return acc;
  }, {});

  const byJob = items.reduce<Record<string, number>>((acc, i) => {
    const a = parseAmount(i.amount);
    const j = i.job.trim() || "Unassigned";
    if (a > 0) acc[j] = (acc[j] || 0) + a;
    return acc;
  }, {});

  const updateItem = useCallback((id: string, field: keyof LineItem, value: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)),
    );
    setSaved(false);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((it) => it.id !== id);
      return next.length === 0 ? [newItem()] : next;
    });
    setSaved(false);
  }, []);

  const addItem = useCallback(() => {
    setItems((prev) => [...prev, newItem()]);
    setSaved(false);
  }, []);

  const handleSave = useCallback(() => {
    if (!store.trim()) return;
    const receipt: SavedReceipt = {
      id: crypto.randomUUID(),
      store: store.trim(),
      date,
      items: items.filter((i) => parseAmount(i.amount) > 0),
      total,
      savedAt: new Date().toISOString(),
    };
    const updated = [receipt, ...loadHistory()];
    saveHistory(updated);
    setHistory(updated);
    setSaved(true);
  }, [store, date, items, total]);

  const handleExportCSV = useCallback(() => {
    const rows = items
      .filter((i) => parseAmount(i.amount) > 0)
      .map((i) => [
        date,
        store.trim(),
        i.description.trim(),
        i.category,
        i.job.trim() || "Unassigned",
        parseAmount(i.amount).toFixed(2),
      ]);
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

  const handleClear = useCallback(() => {
    setStore("");
    setDate(todayStr());
    setItems([newItem()]);
    setSaved(false);
  }, []);

  const deleteHistoryItem = useCallback((id: string) => {
    const updated = loadHistory().filter((r) => r.id !== id);
    saveHistory(updated);
    setHistory(updated);
  }, []);

  const hasData = items.some((i) => parseAmount(i.amount) > 0);

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px 120px" }}>
      <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", marginBottom: 8 }}>
        Receipt Splitter
      </h1>
      <p style={{ color: "var(--slate)", marginBottom: 24, fontSize: "1rem" }}>
        Split a receipt across jobs and categories.
      </p>

      {/* Running total */}
      <div
        style={{
          background: "var(--navy)",
          color: "var(--white)",
          borderRadius: "var(--radius)",
          padding: "20px 24px",
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "0.85rem", opacity: 0.7, marginBottom: 4 }}>
          RUNNING TOTAL
        </div>
        <div
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontSize: "2.4rem",
            fontWeight: 700,
          }}
        >
          {fmt(total)}
        </div>
      </div>

      {/* Store + Date */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <div>
          <label style={labelStyle}>Store</label>
          <input
            type="text"
            placeholder="Home Depot"
            value={store}
            onChange={(e) => { setStore(e.target.value); setSaved(false); }}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => { setDate(e.target.value); setSaved(false); }}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Line items */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ ...labelStyle, marginBottom: 12, display: "block" }}>
          Items ({items.length})
        </label>
        {items.map((item, idx) => (
          <div
            key={item.id}
            style={{
              background: "var(--mist)",
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              position: "relative",
            }}
          >
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              aria-label="Remove item"
              style={{
                position: "absolute",
                top: 8,
                right: 8,
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
              }}
            >
              &times;
            </button>

            <div style={{ fontSize: "0.8rem", color: "var(--slate)", marginBottom: 8 }}>
              Item {idx + 1}
            </div>

            <input
              type="text"
              placeholder="Description (e.g. 2x4 lumber)"
              value={item.description}
              onChange={(e) => updateItem(item.id, "description", e.target.value)}
              style={{ ...inputStyle, marginBottom: 10 }}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <div>
                <label style={smallLabelStyle}>Amount</label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={item.amount}
                  onChange={(e) => updateItem(item.id, "amount", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={smallLabelStyle}>Category</label>
                <select
                  value={item.category}
                  onChange={(e) => updateItem(item.id, "category", e.target.value)}
                  style={inputStyle}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={smallLabelStyle}>Job / Client</label>
              <input
                type="text"
                placeholder="e.g. Smith Kitchen Reno"
                value={item.job}
                onChange={(e) => updateItem(item.id, "job", e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: 12,
            border: "2px dashed var(--line)",
            background: "transparent",
            color: "var(--navy)",
            fontWeight: 600,
            fontSize: "1rem",
            cursor: "pointer",
            fontFamily: "inherit",
            minHeight: 52,
          }}
        >
          + Add Item
        </button>
      </div>

      {/* Summary */}
      {hasData && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: "1.3rem", marginBottom: 12 }}>Summary</h2>

          {Object.keys(byCategory).length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: "0.85rem", color: "var(--slate)", marginBottom: 6, fontWeight: 600 }}>
                By Category
              </div>
              {Object.entries(byCategory)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, amt]) => (
                  <div
                    key={cat}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: "1px solid var(--line)",
                      fontSize: "0.95rem",
                    }}
                  >
                    <span>{cat}</span>
                    <span style={{ fontWeight: 600 }}>{fmt(amt)}</span>
                  </div>
                ))}
            </div>
          )}

          {Object.keys(byJob).length > 0 && (
            <div>
              <div style={{ fontSize: "0.85rem", color: "var(--slate)", marginBottom: 6, fontWeight: 600 }}>
                By Job
              </div>
              {Object.entries(byJob)
                .sort((a, b) => b[1] - a[1])
                .map(([job, amt]) => (
                  <div
                    key={job}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: "1px solid var(--line)",
                      fontSize: "0.95rem",
                    }}
                  >
                    <span>{job}</span>
                    <span style={{ fontWeight: 600 }}>{fmt(amt)}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: "grid", gap: 12, marginBottom: 32 }}>
        <button
          type="button"
          onClick={handleSave}
          disabled={!store.trim() || !hasData}
          style={{
            ...btnStyle,
            background: saved ? "#276749" : "var(--navy)",
            borderColor: saved ? "#276749" : "var(--navy)",
            opacity: !store.trim() || !hasData ? 0.4 : 1,
          }}
        >
          {saved ? "Saved!" : "Save Receipt"}
        </button>
        <button
          type="button"
          onClick={handleExportCSV}
          disabled={!hasData}
          style={{
            ...btnStyle,
            background: "var(--white)",
            color: "var(--navy)",
            borderColor: "var(--navy)",
            opacity: !hasData ? 0.4 : 1,
          }}
        >
          Export CSV
        </button>
        <button
          type="button"
          onClick={handleClear}
          style={{
            ...btnStyle,
            background: "transparent",
            color: "var(--slate)",
            borderColor: "var(--line)",
          }}
        >
          Clear
        </button>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setHistoryOpen(!historyOpen)}
            style={{
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
            }}
          >
            <span>Past Receipts ({history.length})</span>
            <span style={{ fontSize: "1.2rem" }}>{historyOpen ? "−" : "+"}</span>
          </button>

          {historyOpen && (
            <div style={{ marginTop: 12 }}>
              {history.map((r) => (
                <div
                  key={r.id}
                  style={{
                    background: "var(--white)",
                    border: "1px solid var(--line)",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 10,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--ink)" }}>{r.store}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--slate)" }}>
                      {r.date} &middot; {r.items.length} item{r.items.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontWeight: 700, color: "var(--ink)" }}>{fmt(r.total)}</span>
                    <button
                      type="button"
                      onClick={() => deleteHistoryItem(r.id)}
                      aria-label="Delete receipt"
                      style={{
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
                      }}
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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

const smallLabelStyle: React.CSSProperties = {
  display: "block",
  fontWeight: 500,
  color: "var(--slate)",
  fontSize: "0.8rem",
  marginBottom: 4,
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
