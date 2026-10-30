"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageIntro } from "@/components/layout/PageIntro";
import { useAuth } from "@/components/auth/AuthProvider";
import { getMyBookings } from "@/lib/api/submit";
import { formatBookingDate } from "@/lib/whatsapp";

type BookingRow = Record<string, string>;

export default function MyBookingsPage() {
  const { user, loading } = useAuth();
  const [rows, setRows] = useState<{
    pooja: BookingRow[];
    products: BookingRow[];
    travel: BookingRow[];
    consultations: BookingRow[];
  } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    getMyBookings()
      .then((data) =>
        setRows({
          pooja: data.pooja || [],
          products: data.products || [],
          travel: data.travel || [],
          consultations: data.consultations || [],
        }),
      )
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
            <BookingGroup title="Yatra bookings" items={rows?.travel || []} fields={["travel_title", "preferred_dates", "status"]} />
            <ConsultationList items={rows?.consultations || []} />
            <Link href="/account" className="text-sm text-primary underline">
              Back to dashboard
            </Link>
          </div>
        )}
      </section>
    </>
  );
}

const CONSULT_STATUS: Record<string, string> = {
  new: "Scheduled",
  contacted: "Scheduled",
  confirmed: "Confirmed",
  completed: "Finished",
  cancelled: "Cancelled",
};

function ConsultationList({ items }: { items: BookingRow[] }) {
  return (
    <div className="glass-card rounded-3xl p-6">
      <h2 className="font-serif text-[28px] font-medium leading-[0.95] tracking-[-0.03em] text-on-surface">Consultations</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-on-surface-variant">None yet.</p>
      ) : (
        <ul className="mt-4 space-y-3 text-sm text-on-surface-variant">
          {items.map((item) => {
            const closed = item.status === "completed" || item.status === "cancelled";
            const when = [formatBookingDate(item.booking_date || ""), (item.start_time || "").slice(0, 5)]
              .filter(Boolean)
              .join(", ");
            return (
              <li key={item.id} className="rounded-xl bg-surface-lowest/60 p-3">
                {item.service_title ? <p>{item.service_title}</p> : null}
                {when ? <p>{when}</p> : null}
                <p>{CONSULT_STATUS[item.status] || item.status || "Scheduled"}</p>
                {closed ? (
                  <p className="mt-2">Video room closed</p>
                ) : (
                  <>
                    <Link
                      href={`/consult/${item.id}`}
                      className="mt-3 inline-flex items-center justify-center rounded-full bg-primary-container px-4 py-2 text-sm font-bold text-on-primary"
                    >
                      Join video call
                    </Link>
                    <p className="mt-2 text-xs">Opens 10 minutes before the booked time.</p>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
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
      <h2 className="font-serif text-[28px] font-medium leading-[0.95] tracking-[-0.03em] text-on-surface">{title}</h2>
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
