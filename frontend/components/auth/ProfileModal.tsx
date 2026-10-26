"use client";

import { FormEvent, useState } from "react";
import { SERVICE_INTEREST_OPTIONS } from "@/types/forms";

export function ProfileModal({
  onSaved,
}: {
  onSaved: (payload: Record<string, string>) => Promise<void>;
}) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(event.currentTarget);
    const service = String(data.get("service") || "");
    try {
      await onSaved({
        name: String(data.get("name") || ""),
        mobile: String(data.get("mobile") || ""),
        location: String(data.get("location") || ""),
        source: service,
        message: service,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-midnight/50 p-4 md:items-center">
      <form onSubmit={onSubmit} className="w-full max-w-lg rounded-3xl bg-cream p-6 shadow-2xl md:p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-saffron">Welcome</p>
        <h2 className="mt-2 font-serif text-3xl text-midnight">A few details, then we can help you better</h2>
        <p className="mt-2 text-sm text-ink/70">Name, number, address, and the service you want.</p>
        <div className="mt-6 grid gap-3">
          <label className="text-sm">
            Name
            <input required name="name" autoComplete="name" className="mt-2 w-full rounded-2xl border border-saffron/30 bg-paper px-4 py-3" />
          </label>
          <label className="text-sm">
            Phone number
            <input required name="mobile" autoComplete="tel" className="mt-2 w-full rounded-2xl border border-saffron/30 bg-paper px-4 py-3" />
          </label>
          <label className="text-sm">
            Address
            <input required name="location" autoComplete="street-address" className="mt-2 w-full rounded-2xl border border-saffron/30 bg-paper px-4 py-3" />
          </label>
          <label className="text-sm">
            Which service do you want?
            <select name="service" className="mt-2 w-full rounded-2xl border border-saffron/30 bg-paper px-4 py-3" defaultValue="Pooja booking">
              {SERVICE_INTEREST_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {error ? <p className="mt-3 text-sm text-lotus">{error}</p> : null}
        <button type="submit" disabled={busy} className="mt-5 rounded-full bg-midnight px-5 py-3 text-sm text-cream disabled:opacity-60">
          {busy ? "Saving…" : "Save and continue"}
        </button>
      </form>
    </div>
  );
}
