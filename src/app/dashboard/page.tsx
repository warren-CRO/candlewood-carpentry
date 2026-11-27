"use client";

import { useState, useEffect } from "react";

interface Job {
  id: string;
  name: string;
  status: string;
  stageName: string;
  monetaryValue: number;
  contactName: string;
  createdAt: string;
}

interface JobFinancials {
  id: string;
  name: string;
  stageName: string;
  revenue: number;
  expenses: number;
  profit: number;
  margin: number;
}

function fmt(n: number): string {
  return "$" + n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [financials, setFinancials] = useState<JobFinancials[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/jobs?status=all");
        const data = await res.json();
        if (!data.success) return;

        setJobs(data.jobs);

        const details = await Promise.all(
          data.jobs.slice(0, 20).map(async (job: Job) => {
            try {
              const r = await fetch(`/api/jobs/${job.id}`);
              const d = await r.json();
              if (!d.success) return null;
              return {
                id: job.id,
                name: job.name,
                stageName: job.stageName,
                revenue: d.revenue || 0,
                expenses: d.totalExpenses || 0,
                profit: d.profit || 0,
                margin: d.margin || 0,
              };
            } catch {
              return null;
            }
          }),
        );

        setFinancials(details.filter(Boolean) as JobFinancials[]);
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, []);

  const totalRevenue = financials.reduce((s, j) => s + j.revenue, 0);
  const totalExpenses = financials.reduce((s, j) => s + j.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const avgMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  const activeJobs = jobs.filter((j) => j.status === "open");
  const wonJobs = jobs.filter((j) => j.status === "won");
  const pipelineValue = activeJobs.reduce((s, j) => s + j.monetaryValue, 0);

  const stageCounts: Record<string, number> = {};
  for (const job of jobs) {
    stageCounts[job.stageName] = (stageCounts[job.stageName] || 0) + 1;
  }

  const jobsWithExpenses = financials.filter((j) => j.expenses > 0 || j.revenue > 0);

  if (loading) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px 120px" }}>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", marginBottom: 4 }}>Dashboard</h1>
        <div style={{ padding: 60, textAlign: "center", color: "var(--slate)" }}>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px 120px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", margin: 0 }}>Dashboard</h1>
        <a href="/jobs" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--navy)", textDecoration: "none" }}>&larr; Jobs</a>
      </div>
      <p style={{ color: "var(--slate)", marginBottom: 24, fontSize: "0.95rem" }}>
        Business health at a glance.
      </p>

      {/* Top-line metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        <BigCard label="Pipeline Value" value={fmt(pipelineValue)} sub={`${activeJobs.length} active jobs`} color="var(--navy, #1b2a4a)" />
        <BigCard label="Won" value={wonJobs.length.toString()} sub="closed deals" color="#10b981" />
        <BigCard label="Total Revenue" value={fmt(totalRevenue)} sub="from tracked jobs" color="#10b981" />
        <BigCard label="Total Expenses" value={fmt(totalExpenses)} sub="materials + subs" color="#ef4444" />
        <BigCard label="Net Profit" value={fmt(totalProfit)} sub="revenue - expenses" color={totalProfit >= 0 ? "#10b981" : "#ef4444"} />
        <BigCard label="Avg Margin" value={avgMargin > 0 ? `${avgMargin.toFixed(0)}%` : "—"} sub={avgMargin >= 30 ? "healthy" : avgMargin >= 15 ? "watch" : "low"} color={avgMargin >= 30 ? "#10b981" : avgMargin >= 15 ? "#f59e0b" : "#ef4444"} />
      </div>

      {/* Pipeline breakdown */}
      <SectionLabel>Pipeline Stages</SectionLabel>
      <div style={{ marginBottom: 24 }}>
        {Object.entries(stageCounts).map(([stage, count]) => (
          <div key={stage} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderBottom: "1px solid var(--line, #e5e7eb)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: STAGE_COLORS[stage] || "#6b7280" }} />
              <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{stage}</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--navy)" }}>{count}</span>
          </div>
        ))}
      </div>

      {/* Job profitability table */}
      {jobsWithExpenses.length > 0 && (
        <>
          <SectionLabel>Job Profitability</SectionLabel>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Job</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Revenue</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Expenses</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Margin</th>
                </tr>
              </thead>
              <tbody>
                {jobsWithExpenses
                  .sort((a, b) => b.revenue - a.revenue)
                  .map((j) => (
                    <tr key={j.id}>
                      <td style={tdStyle}>
                        <a href={`/jobs`} style={{ color: "var(--navy)", fontWeight: 600, textDecoration: "none" }}>
                          {j.name.length > 25 ? j.name.slice(0, 25) + "…" : j.name}
                        </a>
                      </td>
                      <td style={{ ...tdStyle, textAlign: "right", color: "#10b981", fontWeight: 600 }}>{fmt(j.revenue)}</td>
                      <td style={{ ...tdStyle, textAlign: "right", color: "#ef4444" }}>{fmt(j.expenses)}</td>
                      <td style={{ ...tdStyle, textAlign: "right", fontWeight: 700, color: j.margin >= 30 ? "#10b981" : j.margin >= 15 ? "#f59e0b" : "#ef4444" }}>
                        {j.margin > 0 ? `${j.margin.toFixed(0)}%` : "—"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {jobsWithExpenses.length === 0 && (
        <div style={{ padding: 24, textAlign: "center", borderRadius: 12, background: "var(--mist, #f5f7fa)", color: "var(--slate)", fontSize: "0.9rem" }}>
          No expense data yet. Open a job to log expenses and see profitability here.
        </div>
      )}

      {/* Target metrics */}
      <div style={{ marginTop: 32, padding: 20, borderRadius: 12, border: "1.5px solid var(--line, #e5e7eb)" }}>
        <SectionLabel>Targets</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: "0.9rem" }}>
          <div>
            <div style={{ color: "var(--slate)", fontSize: "0.8rem" }}>Labor Rate</div>
            <div style={{ fontWeight: 700 }}>$65/hr</div>
          </div>
          <div>
            <div style={{ color: "var(--slate)", fontSize: "0.8rem" }}>Markup</div>
            <div style={{ fontWeight: 700 }}>20%</div>
          </div>
          <div>
            <div style={{ color: "var(--slate)", fontSize: "0.8rem" }}>Contingency</div>
            <div style={{ fontWeight: 700 }}>10%</div>
          </div>
          <div>
            <div style={{ color: "var(--slate)", fontSize: "0.8rem" }}>Payment Split</div>
            <div style={{ fontWeight: 700 }}>50/25/25</div>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
        <a href="/jobs" style={navLinkStyle}>&#128188; Jobs</a>
        <a href="/tools" style={navLinkStyle}>&#128736; Tools</a>
        <a href="/guide" style={navLinkStyle}>&#128214; Guide</a>
      </div>
    </div>
  );
}

function BigCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div style={{ padding: 16, borderRadius: 12, border: "1.5px solid var(--line, #e5e7eb)", textAlign: "center" }}>
      <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: "1.5rem", fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: "0.75rem", color: "var(--slate)", marginTop: 2 }}>{sub}</div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
      {children}
    </div>
  );
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

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 10px",
  borderBottom: "2px solid var(--line, #e5e7eb)",
  fontSize: "0.7rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "var(--slate, #64748b)",
};

const tdStyle: React.CSSProperties = {
  padding: "10px",
  borderBottom: "1px solid var(--line, #e5e7eb)",
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
