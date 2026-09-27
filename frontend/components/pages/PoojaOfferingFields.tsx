"use client";

import type { Vendor } from "@/types/wordpress";

export function PoojaOfferingFields({
  vendors,
  fieldClass,
}: {
  vendors: Vendor[];
  fieldClass: string;
}) {
  return (
    <>
      <label className="block text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">
        Online or offline
        <select required name="offering_mode" defaultValue="online" className={`${fieldClass} mt-1`}>
          <option value="online">Online pooja</option>
          <option value="offline">Offline pooja</option>
        </select>
      </label>
      {vendors.length ? (
        <label className="block text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">
          Pooja temple
          <select required name="vendor" className={`${fieldClass} mt-1`}>
            <option value="">Choose a pooja temple</option>
            {vendors.map((vendor) => (
              <option key={vendor.id || vendor.slug} value={vendor.slug}>
                {vendor.title}
                {vendor.location ? ` — ${vendor.location}` : ""}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <p className="text-xs leading-relaxed text-on-surface-variant">
          Poojas are arranged through a temple. We will confirm the temple with you after this request.
        </p>
      )}
    </>
  );
}
