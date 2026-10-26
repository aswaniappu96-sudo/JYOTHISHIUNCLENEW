"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { PageIntro } from "@/components/layout/PageIntro";
import { registerCustomer } from "@/lib/api/submit";
import { useAuth } from "@/components/auth/AuthProvider";
import { queueServicesPopup } from "@/lib/firstVisit";
import { SERVICE_INTEREST_OPTIONS } from "@/types/forms";

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
    const service = String(data.get("service") || "");
    try {
      await registerCustomer({
        name: String(data.get("name") || ""),
        location: String(data.get("location") || ""),
        address: String(data.get("location") || ""),
        mobile: String(data.get("mobile") || ""),
        phone: String(data.get("mobile") || ""),
        email: String(data.get("email") || ""),
        password: String(data.get("password") || ""),
        source: service,
        message: service,
        account_type: "user",
      });
      await refresh();
      queueServicesPopup();
      window.dispatchEvent(new Event("ju-queue-services"));
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to register.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageIntro
        eyebrow="Account"
        title="Register"
        copy="Only a few details. After you register, you can choose a service or close the next screen."
      />
      <form onSubmit={onSubmit} className="mx-auto grid max-w-md gap-4 px-5 py-16">
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
        <label className="text-sm">
          Email
          <input required type="email" name="email" autoComplete="email" className="mt-2 w-full rounded-2xl border border-saffron/30 bg-paper px-4 py-3" />
        </label>
        <label className="text-sm">
          Password
          <input required minLength={8} type="password" name="password" autoComplete="new-password" className="mt-2 w-full rounded-2xl border border-saffron/30 bg-paper px-4 py-3" />
        </label>
        <p className="text-xs leading-relaxed text-on-surface-variant">
          Email and password are only so you can sign in again.
        </p>
        {error ? <p className="text-sm text-lotus">{error}</p> : null}
        <button disabled={busy} className="rounded-full bg-midnight px-5 py-3 text-sm text-cream disabled:opacity-60">
          {busy ? "Creating…" : "Create account"}
        </button>
        <p className="text-sm text-on-surface-variant">
          Already registered?{" "}
          <Link href="/login" className="text-saffron underline">
            Login
          </Link>
        </p>
      </form>
    </>
  );
}
