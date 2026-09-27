"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { PageIntro } from "@/components/layout/PageIntro";
import { loginCustomer } from "@/lib/api/submit";
import { useAuth } from "@/components/auth/AuthProvider";

export default function LoginPage() {
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
      await loginCustomer(String(data.get("email") || ""), String(data.get("password") || ""));
      await refresh();
      router.push("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to log in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageIntro eyebrow="Account" title="Login" copy="Browse freely without an account. Login is for saving bookings and details." />
      <form onSubmit={onSubmit} className="mx-auto grid max-w-md gap-4 px-5 py-16">
        <label className="text-sm">
          Email
          <input required type="email" name="email" className="mt-2 w-full rounded-2xl border border-saffron/30 bg-paper px-4 py-3" />
        </label>
        <label className="text-sm">
          Password
          <input required type="password" name="password" className="mt-2 w-full rounded-2xl border border-saffron/30 bg-paper px-4 py-3" />
        </label>
        {error ? <p className="text-sm text-lotus">{error}</p> : null}
        <button disabled={busy} className="rounded-full bg-midnight px-5 py-3 text-sm text-cream disabled:opacity-60">
          {busy ? "Signing in…" : "Login"}
        </button>
        <p className="text-sm text-on-surface-variant">
          New here? <Link href="/register" className="text-lotus underline">Register</Link>
        </p>
      </form>
    </>
  );
}
