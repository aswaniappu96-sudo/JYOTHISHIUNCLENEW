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
      <PageIntro eyebrow="Account" title="Register" copy="Your details are saved in WordPress. You can also register from the account icon." />
      <form onSubmit={onSubmit} className="mx-auto grid max-w-md gap-4 px-5 py-16">
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
        <label className="text-sm">
          How did you hear about JyothishiUncle?
          <select name="source" className="mt-2 w-full rounded-2xl border border-saffron/30 bg-paper px-4 py-3">
            {HEAR_ABOUT_OPTIONS.map((source) => (
              <option key={source}>{source}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Query / Message
          <textarea name="message" rows={3} className="mt-2 w-full rounded-2xl border border-saffron/30 bg-paper px-4 py-3" />
        </label>
        {error ? <p className="text-sm text-lotus">{error}</p> : null}
        <button disabled={busy} className="rounded-full bg-midnight px-5 py-3 text-sm text-cream disabled:opacity-60">
          {busy ? "Creating…" : "Create account"}
        </button>
        <p className="text-sm text-on-surface-variant">
          Already registered? <Link href="/login" className="text-saffron underline">Login</Link>
        </p>
      </form>
    </>
  );
}
