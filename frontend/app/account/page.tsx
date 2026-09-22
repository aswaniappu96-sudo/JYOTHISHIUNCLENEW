"use client";

import Link from "next/link";
import { PageIntro } from "@/components/layout/PageIntro";
import { useAuth } from "@/components/auth/AuthProvider";

export default function AccountPage() {
  const { user, loading, logout } = useAuth();

  return (
    <>
      <PageIntro eyebrow="Account" title="My account" />
      <section className="mx-auto max-w-md px-5 py-16">
        {loading ? (
          <p className="text-sm text-cream/60">Loading…</p>
        ) : user ? (
          <div className="glass-card rounded-3xl p-6 text-sm leading-relaxed">
            <p className="font-serif text-2xl text-white">{user.name || user.email}</p>
            <p className="mt-2">{user.email}</p>
            {user.mobile ? <p className="mt-1">{user.mobile}</p> : null}
            {user.location ? <p className="mt-1">{user.location}</p> : null}
            <button type="button" onClick={() => logout()} className="mt-6 text-saffron underline">
              Logout
            </button>
            <p className="mt-4">
              <Link href="/account/bookings" className="text-primary underline">
                My Bookings
              </Link>
            </p>
          </div>
        ) : (
          <p className="glass-card rounded-3xl p-6 text-sm leading-relaxed text-cream/75">
            Please <Link href="/login" className="text-saffron underline">login</Link> to see saved details. You can still book as a guest.
          </p>
        )}
      </section>
    </>
  );
}
