"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { submitPoojaBooking } from "@/lib/api/submit";
import type { Pooja } from "@/types/wordpress";

export function PoojaBookingModal({
  pooja,
  onClose,
}: {
  pooja: Pick<Pooja, "slug" | "title">;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const [mode, setMode] = useState<"choose" | "form">(user ? "form" : "choose");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      await submitPoojaBooking({
        pooja: pooja.slug,
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        mobile: String(data.get("mobile") || ""),
        location: String(data.get("location") || ""),
        preferred_date: String(data.get("preferred_date") || ""),
        message: String(data.get("message") || ""),
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send booking.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-midnight/50 p-4 md:items-center">
      <div className="w-full max-w-lg rounded-3xl bg-cream p-6 shadow-2xl md:p-8">
        <button type="button" onClick={onClose} className="float-right text-sm text-ink/50">
          Close
        </button>
        <p className="text-xs uppercase tracking-[0.22em] text-saffron">Book pooja</p>
        <h2 className="mt-2 font-serif text-3xl text-midnight">{pooja.title}</h2>

        {done ? (
          <p className="mt-6 text-sm leading-relaxed text-ink/75">
            Booking received. We will confirm the ritual details with you shortly.
          </p>
        ) : mode === "choose" ? (
          <div className="mt-6 grid gap-3">
            <p className="text-sm text-ink/70">You can continue as a guest, or log in to save your details.</p>
            <Link href="/login" className="rounded-full bg-midnight px-5 py-3 text-center text-sm text-cream">
              Login / Register
            </Link>
            <button
              type="button"
              className="rounded-full border border-saffron/40 px-5 py-3 text-sm"
              onClick={() => setMode("form")}
            >
              Continue without login
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 grid gap-3">
            <input type="hidden" name="pooja" value={pooja.slug} />
            <label className="text-sm">
              Name
              <input required name="name" defaultValue={user?.name} className="mt-2 w-full rounded-2xl border border-saffron/30 bg-paper px-4 py-3" />
            </label>
            <label className="text-sm">
              Email
              <input required type="email" name="email" defaultValue={user?.email} className="mt-2 w-full rounded-2xl border border-saffron/30 bg-paper px-4 py-3" />
            </label>
            <label className="text-sm">
              Mobile
              <input required name="mobile" defaultValue={user?.mobile} className="mt-2 w-full rounded-2xl border border-saffron/30 bg-paper px-4 py-3" />
            </label>
            <label className="text-sm">
              Location
              <input name="location" defaultValue={user?.location} className="mt-2 w-full rounded-2xl border border-saffron/30 bg-paper px-4 py-3" />
            </label>
            <label className="text-sm">
              Preferred date
              <input required type="date" name="preferred_date" className="mt-2 w-full rounded-2xl border border-saffron/30 bg-paper px-4 py-3" />
            </label>
            <label className="text-sm">
              Message
              <textarea name="message" rows={3} className="mt-2 w-full rounded-2xl border border-saffron/30 bg-paper px-4 py-3" />
            </label>
            {error ? <p className="text-sm text-lotus">{error}</p> : null}
            <button disabled={busy} className="rounded-full bg-midnight px-5 py-3 text-sm text-cream disabled:opacity-60">
              {busy ? "Sending…" : "Submit booking"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
