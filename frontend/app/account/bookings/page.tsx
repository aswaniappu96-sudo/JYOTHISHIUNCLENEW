"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageIntro } from "@/components/layout/PageIntro";
import { useAuth } from "@/components/auth/AuthProvider";
import { getMyBookings } from "@/lib/api/submit";

type BookingRow = Record<string, string>;

export default function MyBookingsPage() {
  const { user, loading } = useAuth();
  const [rows, setRows] = useState<{ pooja: BookingRow[]; products: BookingRow[]; consultations: BookingRow[] } | null>(
    null,
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    getMyBookings()
      .then((data) => setRows({ pooja: data.pooja || [], products: data.products || [], consultations: data.consultations || [] }))
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load bookings."));
  }, [user]);

  return (
    <>
      <PageIntro eyebrow="Account" title="My bookings" />
      <section className="mx-auto max-w-3xl px-5 py-16">
        {loading ? (
          <p className="text-sm text-on-surface-variant">Loading…</p>
        ) : !user ? (
          <p className="glass-card rounded-3xl p-6 text-sm text-on-surface-variant">
            Please login from the account icon to see your bookings.
          </p>
        ) : error ? (
          <p className="text-sm text-lotus">{error}</p>
        ) : (
          <div className="grid gap-8">
            <BookingGroup title="Pooja bookings" items={rows?.pooja || []} fields={["pooja_title", "preferred_date", "status"]} />
            <BookingGroup title="Product enquiries" items={rows?.products || []} fields={["product_title", "quantity", "status"]} />
            <BookingGroup title="Consultations" items={rows?.consultations || []} fields={["service_title", "booking_date", "status"]} />
            <Link href="/account" className="text-sm text-primary underline">
              Back to dashboard
            </Link>
          </div>
        )}
      </section>
    </>
  );
}

function BookingGroup({
  title,
  items,
  fields,
}: {
  title: string;
  items: BookingRow[];
  fields: string[];
}) {
  return (
    <div className="glass-card rounded-3xl p-6">
      <h2 className="font-serif text-2xl text-primary">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-on-surface-variant">None yet.</p>
      ) : (
        <ul className="mt-4 space-y-3 text-sm text-on-surface-variant">
          {items.map((item) => (
            <li key={item.id} className="rounded-xl bg-surface-lowest/60 p-3">
              {fields.map((field) => (item[field] ? <p key={field}>{item[field]}</p> : null))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
