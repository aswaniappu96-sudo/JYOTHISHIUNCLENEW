"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { PageIntro } from "@/components/layout/PageIntro";
import { registerCustomer } from "@/lib/api/submit";
import { useAuth } from "@/components/auth/AuthProvider";
import { HEAR_ABOUT_OPTIONS } from "@/types/forms";

export default function RegisterPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [role, setRole] = useState<"user" | "astrologer">("user");
  const astrologer = role === "astrologer";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      await registerCustomer({
        name: String(data.get("name") || ""),
        location: String(data.get("location") || ""),
        address: String(data.get("location") || ""),
        mobile: String(data.get("mobile") || ""),
        phone: String(data.get("mobile") || ""),
        email: String(data.get("email") || ""),
        password: String(data.get("password") || ""),
        source: String(data.get("source") || ""),
        message: String(data.get("message") || ""),
        account_type: role,
        experience: String(data.get("experience") || ""),
        languages: String(data.get("languages") || ""),
        specialties: String(data.get("specialties") || ""),
      });
      await refresh();
      router.push("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to register.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageIntro eyebrow="Account" title="Register" copy="Choose User or Astrologer. Details are saved in WordPress Registrations (Excel)." />
      <form onSubmit={onSubmit} className="mx-auto grid max-w-md gap-4 px-5 py-16">
        <label className="text-sm">
          Register as
          <select
            name="account_type"
            value={role}
            onChange={(event) => setRole(event.target.value === "astrologer" ? "astrologer" : "user")}
            className="mt-2 w-full rounded-2xl border border-saffron/30 bg-paper px-4 py-3"
          >
            <option value="user">User</option>
            <option value="astrologer">Astrologer</option>
          </select>
        </label>
        <label className="text-sm">
          Name
          <input required name="name" className="mt-2 w-full rounded-2xl border border-saffron/30 bg-paper px-4 py-3" />
        </label>
        <label className="text-sm">
          Address / Location
          <input required name="location" className="mt-2 w-full rounded-2xl border border-saffron/30 bg-paper px-4 py-3" />
        </label>
        <label className="text-sm">
          Phone Number
          <input required name="mobile" className="mt-2 w-full rounded-2xl border border-saffron/30 bg-paper px-4 py-3" />
        </label>
        <label className="text-sm">
          Email
          <input required type="email" name="email" className="mt-2 w-full rounded-2xl border border-saffron/30 bg-paper px-4 py-3" />
        </label>
        <label className="text-sm">
          Password
          <input required minLength={8} type="password" name="password" className="mt-2 w-full rounded-2xl border border-saffron/30 bg-paper px-4 py-3" />
        </label>
        {astrologer ? (
          <>
            <label className="text-sm">
              Years of experience
              <input required name="experience" placeholder="e.g. 8" className="mt-2 w-full rounded-2xl border border-saffron/30 bg-paper px-4 py-3" />
            </label>
            <label className="text-sm">
              Languages
              <input required name="languages" placeholder="English, Hindi" className="mt-2 w-full rounded-2xl border border-saffron/30 bg-paper px-4 py-3" />
            </label>
            <label className="text-sm">
              Specialties
              <input required name="specialties" placeholder="Kundli, Prashna, Matchmaking" className="mt-2 w-full rounded-2xl border border-saffron/30 bg-paper px-4 py-3" />
            </label>
          </>
        ) : null}
        <label className="text-sm">
          How did you hear about JyothishiUncle?
          <select name="source" className="mt-2 w-full rounded-2xl border border-saffron/30 bg-paper px-4 py-3">
            {HEAR_ABOUT_OPTIONS.map((source) => (
              <option key={source}>{source}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          {astrologer ? "About your practice" : "Query / Message"}
          <textarea name="message" rows={3} className="mt-2 w-full rounded-2xl border border-saffron/30 bg-paper px-4 py-3" />
        </label>
        {error ? <p className="text-sm text-lotus">{error}</p> : null}
        <button disabled={busy} className="rounded-full bg-midnight px-5 py-3 text-sm text-cream disabled:opacity-60">
          {busy ? "Creating…" : astrologer ? "Submit astrologer application" : "Create account"}
        </button>
        <p className="text-sm text-on-surface-variant">
          Already registered? <Link href="/login" className="text-saffron underline">Login</Link>
        </p>
      </form>
    </>
  );
}
