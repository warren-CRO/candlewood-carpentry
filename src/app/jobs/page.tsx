"use client";

import { useState, useEffect, useCallback } from "react";

interface Job {
  id: string;
  name: string;
  status: string;
  stageName: string;
  monetaryValue: number;
  contactName: string;
  contactPhone: string;
  createdAt: string;
  updatedAt: string;
}

interface JobDetail {
  job: Job;
  expenses: Array<{ description: string; amount: number; date: string }>;
  totalExpenses: number;
  revenue: number;
  profit: number;
  margin: number;
}

const STAGE_COLORS: Record<string, string> = {
  "New Lead": "#3b82f6",
  "Contacted": "#6366f1",
  "Site Visit Scheduled": "#8b5cf6",
  "Estimate Sent": "#f59e0b",
  "Proposal Sent": "#f97316",
  "Won / Under Contract": "#10b981",
  "In Progress": "#10b981",
  "Job Complete": "#059669",
  "Invoice Sent": "#0891b2",
  "Paid": "#047857",
  "Lost": "#ef4444",
};

function fmt(n: number): string {
  return "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function shortDate(iso: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<JobDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "open" | "won" | "lost">("all");

  const [expDesc, setExpDesc] = useState("");
  const [expAmount, setExpAmount] = useState("");
  const [expSaving, setExpSaving] = useState(false);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs?status=${filter}`);
      const data = await res.json();
      if (data.success) setJobs(data.jobs);
      else setError(data.error || "Failed to load jobs");
    } catch {
      setError("Failed to load jobs");
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => { loadJobs(); }, [loadJobs]);

  const loadDetail = useCallback(async (id: string) => {
    setSelected(id);
    setDetailLoading(true);
    setDetail(null);
    try {
      const res = await fetch(`/api/jobs/${id}`);
      const data = await res.json();
      if (data.success) setDetail(data);
    } catch { /* ignore */ }
    setDetailLoading(false);
  }, []);

  const logExpense = useCallback(async () => {
    if (!selected || !expDesc.trim() || !expAmount.trim()) return;
    setExpSaving(true);
    try {
      await fetch(`/api/jobs/${selected}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "expense", description: expDesc.trim(), amount: parseFloat(expAmount) }),
      });
      setExpDesc("");
      setExpAmount("");
      await loadDetail(selected);
    } catch { /* ignore */ }
    setExpSaving(false);
  }, [selected, expDesc, expAmount, loadDetail]);

  if (selected && detail) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px 120px" }}>
        <button type="button" onClick={() => setSelected(null)} style={backBtnStyle}>&larr; All Jobs</button>

        <h2 style={{ fontSize: "1.3rem", marginBottom: 4 }}>{detail.job.name}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <span style={{ ...badgeStyle, background: STAGE_COLORS[detail.job.stageName] || "#6b7280" }}>{detail.job.stageName}</span>
          <span style={{ fontSize: "0.85rem", color: "var(--slate)" }}>since {shortDate(detail.job.createdAt)}</span>
        </div>

        {/* Profitability cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          <StatCard label="Revenue" value={fmt(detail.revenue)} color="#10b981" />
          <StatCard label="Expenses" value={fmt(detail.totalExpenses)} color="#ef4444" />
          <StatCard label="Profit" value={fmt(detail.profit)} color={detail.profit >= 0 ? "#10b981" : "#ef4444"} />
          <StatCard label="Margin" value={detail.margin > 0 ? `${detail.margin.toFixed(0)}%` : "—"} color={detail.margin >= 30 ? "#10b981" : detail.margin >= 15 ? "#f59e0b" : "#ef4444"} />
        </div>

        {/* Contact info */}
        {detail.job.contactName && (
          <div style={{ marginBottom: 20, padding: 16, borderRadius: 12, background: "var(--mist, #f5f7fa)" }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{detail.job.contactName}</div>
            {detail.job.contactPhone && <div style={{ fontSize: "0.9rem", color: "var(--slate)" }}>{detail.job.contactPhone}</div>}
          </div>
        )}

        {/* Log expense */}
        <SectionLabel>Log Expense</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 100px", gap: 8, marginBottom: 8 }}>
          <input type="text" placeholder="Materials, sub, permit..." value={expDesc} onChange={(e) => setExpDesc(e.target.value)} style={inputStyle} />
          <input type="number" inputMode="decimal" step="0.01" placeholder="$" value={expAmount} onChange={(e) => setExpAmount(e.target.value)} style={{ ...inputStyle, textAlign: "right" }} />
        </div>
        <button
          type="button"
          onClick={logExpense}
          disabled={!expDesc.trim() || !expAmount.trim() || expSaving}
          style={{ ...primaryBtnStyle, opacity: !expDesc.trim() || !expAmount.trim() || expSaving ? 0.4 : 1 }}
        >
          {expSaving ? "Saving..." : "Log Expense"}
        </button>

        {/* Expense history */}
        {detail.expenses.length > 0 && (
          <>
            <SectionLabel style={{ marginTop: 24 }}>Expenses</SectionLabel>
            {detail.expenses.map((exp, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--line, #e5e7eb)" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{exp.description}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--slate)" }}>{shortDate(exp.date)}</div>
                </div>
                <div style={{ fontWeight: 700, color: "#ef4444" }}>{fmt(exp.amount)}</div>
              </div>
            ))}
          </>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px 120px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", margin: 0 }}>Jobs</h1>
        <a href="/dashboard" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--navy)", textDecoration: "none" }}>Dashboard &rarr;</a>
      </div>
      <p style={{ color: "var(--slate)", marginBottom: 16, fontSize: "0.95rem" }}>
        Your active jobs from the pipeline. Tap a job to track expenses and profitability.
      </p>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto" }}>
        {(["all", "open", "won", "lost"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              border: filter === f ? "2px solid var(--navy)" : "1.5px solid var(--line)",
              background: filter === f ? "var(--navy)" : "var(--white)",
              color: filter === f ? "var(--white)" : "var(--ink)",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              fontFamily: "inherit",
              textTransform: "capitalize",
              whiteSpace: "nowrap",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {loading && <div style={{ padding: 40, textAlign: "center", color: "var(--slate)" }}>Loading jobs...</div>}
      {error && <div style={{ padding: 20, background: "#fef2f2", borderRadius: 12, color: "#a3262a", fontWeight: 500 }}>{error}</div>}

      {!loading && jobs.length === 0 && (
        <div style={{ padding: 40, textAlign: "center", color: "var(--slate)" }}>
          No {filter === "all" ? "" : filter} jobs found.
        </div>
      )}

      {!loading && jobs.map((job) => (
        <button
          key={job.id}
          type="button"
          onClick={() => loadDetail(job.id)}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
            marginBottom: 8,
            borderRadius: 12,
            border: "1.5px solid var(--line)",
            background: selected === job.id ? "var(--mist, #f5f7fa)" : "var(--white)",
            cursor: "pointer",
            fontFamily: "inherit",
            textAlign: "left",
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--navy)", marginBottom: 4 }}>{job.name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ ...badgeStyle, background: STAGE_COLORS[job.stageName] || "#6b7280", fontSize: "0.7rem", padding: "2px 8px" }}>{job.stageName}</span>
              <span style={{ fontSize: "0.8rem", color: "var(--slate)" }}>{shortDate(job.createdAt)}</span>
            </div>
          </div>
          {job.monetaryValue > 0 && (
            <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--navy)" }}>{fmt(job.monetaryValue)}</div>
          )}
        </button>
      ))}

      {detailLoading && <div style={{ padding: 20, textAlign: "center", color: "var(--slate)" }}>Loading job details...</div>}

      {/* Nav links */}
      <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
        <a href="/tools" style={navLinkStyle}>&#128736; Tools</a>
        <a href="/dashboard" style={navLinkStyle}>&#128200; Dashboard</a>
        <a href="/guide" style={navLinkStyle}>&#128214; Guide</a>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ padding: 16, borderRadius: 12, border: "1.5px solid var(--line, #e5e7eb)", textAlign: "center" }}>
      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: "1.3rem", fontWeight: 800, color }}>{value}</div>
    </div>
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

const primaryBtnStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "14px 28px",
  borderRadius: 999,
  border: "2px solid var(--navy)",
  background: "var(--navy)",
  color: "var(--white)",
  fontFamily: "inherit",
  fontWeight: 700,
  fontSize: "1rem",
  cursor: "pointer",
  minHeight: 48,
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

const badgeStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "3px 10px",
  borderRadius: 999,
  color: "#fff",
  fontWeight: 600,
  fontSize: "0.75rem",
};

const navLinkStyle: React.CSSProperties = {
  flex: 1,
  display: "block",
  padding: "12px 8px",
  borderRadius: 12,
  border: "1.5px solid var(--line)",
  textAlign: "center",
  textDecoration: "none",
  color: "var(--navy)",
  fontWeight: 600,
  fontSize: "0.85rem",
};
