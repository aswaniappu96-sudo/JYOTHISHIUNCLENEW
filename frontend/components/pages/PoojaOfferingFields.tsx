"use client";

import { stripOmanHighlight } from "@/lib/publicCopy";
import { withCurrentTemplePosts } from "@/lib/templeNames";
import type { Vendor } from "@/types/wordpress";

export function PoojaOfferingFields({
  vendors,
  fieldClass,
  defaultVendor = "",
}: {
  vendors: Vendor[];
  fieldClass: string;
  defaultVendor?: string;
}) {
  const temples = withCurrentTemplePosts(vendors);
  return (
    <>
      <label className="block text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">
        Online or offline
        <select required name="offering_mode" defaultValue="online" className={`${fieldClass} mt-1`}>
          <option value="online">Online pooja</option>
          <option value="offline">Offline pooja</option>
        </select>
      </label>
      {temples.length ? (
        <label className="block text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">
          Temple
          <select required name="vendor" defaultValue={defaultVendor} className={`${fieldClass} mt-1`}>
            <option value="">Select temple</option>
            {temples.map((vendor) => (
              <option key={vendor.id || vendor.slug} value={vendor.slug}>
                {stripOmanHighlight(vendor.title)}
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
