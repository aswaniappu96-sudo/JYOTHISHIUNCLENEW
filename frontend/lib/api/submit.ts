import { HEAR_ABOUT_OPTIONS, type CustomerUser } from "@/types/forms";

async function readJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, { ...init, credentials: "include" });
  const data = (await response.json().catch(() => ({}))) as T & { message?: string };
  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }
  return data;
}

export async function submitCustomerEnquiry(payload: Record<string, unknown>) {
  return readJson("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
}

export async function submitPoojaBooking(payload: Record<string, unknown>) {
  return readJson("/api/pooja-bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
}

export async function submitProductEnquiry(payload: Record<string, unknown>) {
  return readJson("/api/product-enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
}

export async function submitConsultationBooking(payload: Record<string, unknown>) {
  return readJson("/api/consultation-bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
}

export async function loginCustomer(email: string, password: string) {
  return readJson<{ ok: boolean; user: CustomerUser }>("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export async function registerCustomer(payload: Record<string, unknown>) {
  return readJson<{ ok: boolean; user: CustomerUser }>("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function logoutCustomer() {
  return readJson("/api/auth/logout", { method: "POST" });
}

export async function getCurrentUser() {
  const response = await fetch("/api/me", { credentials: "include" });
  if (!response.ok) return null;
  const data = (await response.json()) as { user?: CustomerUser };
  return data.user || null;
}

export async function saveProfile(payload: Record<string, unknown>) {
  return readJson<{ ok: boolean; user: CustomerUser }>("/api/me", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function getMyBookings() {
  return readJson<{
    ok: boolean;
    pooja: Array<Record<string, string>>;
    products: Array<Record<string, string>>;
    consultations: Array<Record<string, string>>;
  }>("/api/me/bookings");
}

export { HEAR_ABOUT_OPTIONS };
