"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SERVICE_AREAS, SERVICES } from "@/lib/constants";

export function EstimateForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const data = new FormData(e.currentTarget);
    if (data.get("company_website")) return;
    const phone = String(data.get("phone") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    if (!phone && !email) {
      setError("Please include a phone number or an email so Chad can reach you.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          phone,
          email,
          town: String(data.get("town") ?? ""),
          service: String(data.get("service") ?? ""),
          details: String(data.get("details") ?? ""),
        }),
      });
      const result: { success?: boolean; error?: string } = await res
        .json()
        .catch(() => ({}));
      if (res.ok && result.success) {
        router.push("/thanks");
        return;
      }
      setError(result.error || "Something went wrong. Please try again or give us a call.");
    } catch {
      setError("We couldn't reach the server. Check your connection and try again, or give us a call.");
    }
    setSubmitting(false);
  }

  return (
    <form className="form-card" onSubmit={onSubmit}>
      <h2>Request an estimate</h2>
      <div className="field">
        <label htmlFor="name">Name *</label>
        <input id="name" name="name" type="text" required autoComplete="name" />
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" />
        </div>
      </div>
      <p className="hint" style={{ marginTop: -8, marginBottom: 18 }}>
        Phone or email is required.
      </p>
      <div className="field">
        <label htmlFor="town">Town</label>
        <select id="town" name="town" defaultValue="">
          <option value="" disabled>
            Select your town
          </option>
          {SERVICE_AREAS.map((t) => (
            <option key={t}>{t}</option>
          ))}
          <option>Another town</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="service">Type of work</label>
        <select id="service" name="service" defaultValue="">
          <option value="" disabled>
            Select a service
          </option>
          {SERVICES.map((s) => (
            <option key={s.id}>{s.title}</option>
          ))}
          <option>Something else</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="details">Project description *</label>
        <textarea id="details" name="details" required />
      </div>
      <div className="field">
        <label htmlFor="photos">Photos (optional)</label>
        <input id="photos" name="photos" type="file" accept="image/*" multiple />
      </div>
      <div className="hp" aria-hidden="true">
        <label htmlFor="company_website">Leave this field empty</label>
        <input
          id="company_website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" className="btn" disabled={submitting}>
        {submitting ? "Sending..." : "Send Request"}
      </button>
    </form>
  );
}
