"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { BrandText } from "@/components/brand/BrandText";
import { Field, ModalShell, fieldClass, ghostBtn, goldBtn } from "@/components/portal/ModalShell";
import { loginCustomer, registerCustomer } from "@/lib/api/submit";
import { SERVICE_INTEREST_OPTIONS, type CustomerUser } from "@/types/forms";

export function AuthModal({
  tab,
  accountType = "user",
  onClose,
  onAuthenticated,
  firstVisit = false,
  consultationOffer = false,
}: {
  tab: "login" | "register";
  accountType?: "user" | "astrologer";
  onClose: () => void;
  onAuthenticated?: (user: CustomerUser) => void;
  firstVisit?: boolean;
  consultationOffer?: boolean;
}) {
  const { refresh } = useAuth();
  const [mode, setMode] = useState<"login" | "register">(tab);
  const [role, setRole] = useState<"user" | "astrologer">(accountType);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const astrologer = role === "astrologer";

  async function onLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      const result = await loginCustomer(String(data.get("email") || ""), String(data.get("password") || ""));
      await refresh();
      if (onAuthenticated) onAuthenticated(result.user);
      else onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to log in.");
    } finally {
      setBusy(false);
    }
  }

  async function onRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      const result = await registerCustomer({
        name: String(data.get("name") || ""),
        address: String(data.get("location") || ""),
        location: String(data.get("location") || ""),
        phone: String(data.get("mobile") || ""),
        mobile: String(data.get("mobile") || ""),
        email: String(data.get("email") || ""),
        password: String(data.get("password") || ""),
        source: String(data.get("service") || data.get("source") || ""),
        message: String(data.get("service") || data.get("message") || ""),
        website: String(data.get("website") || ""),
        account_type: role,
        experience: String(data.get("experience") || ""),
        languages: String(data.get("languages") || ""),
        specialties: String(data.get("specialties") || ""),
      });
      await refresh();
      if (onAuthenticated) onAuthenticated(result.user);
      else onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to register.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ModalShell
      eyebrow={firstVisit ? "Welcome" : mode === "login" ? "Returning seeker" : astrologer ? "Astrologer registration" : "New seeker"}
      title={firstVisit && mode === "login" ? "Login to use" : mode === "login" ? "Login" : astrologer ? "Join as an Astrologer" : "Create account"}
      onClose={onClose}
      lead={
        <>
          {consultationOffer ? (
            <p className="mb-4 text-sm leading-relaxed text-on-surface-variant">
              Login to use this booking. Click Cancel to continue with the consultation form without login.
            </p>
          ) : firstVisit ? (
            <p className="mb-4 text-sm leading-relaxed text-on-surface-variant">
              Login to use <BrandText>MaharshiOm</BrandText>, or continue without login. Next you can pick a service, or close that screen.
            </p>
          ) : null}
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-surface-lowest/70 p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`rounded-lg py-2 text-sm ${mode === "login" ? "bg-primary-container text-on-primary" : "text-on-surface-variant"}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`rounded-lg py-2 text-sm ${mode === "register" ? "bg-primary-container text-on-primary" : "text-on-surface-variant"}`}
            >
              Register
            </button>
          </div>
        </>
      }
    >
      {mode === "login" ? (
        <form onSubmit={onLogin} className="grid gap-3">
          <Field label="Email">
            <input required type="email" name="email" className={fieldClass} />
          </Field>
          <Field label="Password">
            <input required type="password" name="password" className={fieldClass} />
          </Field>
          {error ? <p className="text-sm text-lotus">{error}</p> : null}
          <button disabled={busy} className={goldBtn}>
            {busy ? "Signing in…" : firstVisit ? "Login to use" : "Login"}
          </button>
          {consultationOffer ? (
            <button type="button" onClick={onClose} className={ghostBtn}>
              Cancel
            </button>
          ) : firstVisit ? (
            <button type="button" onClick={onClose} className={ghostBtn}>
              Continue without login
            </button>
          ) : null}
        </form>
      ) : (
        <form onSubmit={onRegister} className="grid gap-3">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
          {firstVisit ? null : (
            <Field label="Register as">
              <select
                name="account_type"
                value={role}
                onChange={(event) => setRole(event.target.value === "astrologer" ? "astrologer" : "user")}
                className={fieldClass}
              >
                <option value="user">User</option>
                <option value="astrologer">Astrologer</option>
              </select>
            </Field>
          )}
          <Field label="Name">
            <input required name="name" autoComplete="name" className={fieldClass} />
          </Field>
          <Field label="Phone number">
            <input required name="mobile" autoComplete="tel" className={fieldClass} />
          </Field>
          <Field label="Address">
            <input required name="location" autoComplete="street-address" className={fieldClass} />
          </Field>
          {astrologer ? (
            <>
              <Field label="Years of experience">
                <input required name="experience" placeholder="e.g. 8" className={fieldClass} />
              </Field>
              <Field label="Languages">
                <input required name="languages" placeholder="English, Hindi" className={fieldClass} />
              </Field>
              <Field label="Specialties">
                <input required name="specialties" placeholder="Kundli, Prashna, Matchmaking" className={fieldClass} />
              </Field>
            </>
          ) : (
            <Field label="Which service do you want?">
              <select name="service" className={fieldClass} defaultValue="Pooja booking">
                {SERVICE_INTEREST_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          )}
          <Field label="Email">
            <input required type="email" name="email" autoComplete="email" className={fieldClass} />
          </Field>
          <Field label="Password (min. 8 characters)">
            <input required minLength={8} type="password" name="password" autoComplete="new-password" className={fieldClass} />
          </Field>
          <p className="text-xs leading-relaxed text-on-surface-variant">
            Email and password are only so you can sign in again.
          </p>
          {error ? <p className="text-sm text-lotus">{error}</p> : null}
          <button disabled={busy} className={goldBtn}>
            {busy ? "Saving…" : astrologer ? "Submit astrologer application" : "Create account"}
          </button>
          {consultationOffer ? (
            <button type="button" onClick={onClose} className={ghostBtn}>
              Cancel
            </button>
          ) : firstVisit ? (
            <button type="button" onClick={onClose} className={ghostBtn}>
              Continue without login
            </button>
          ) : null}
        </form>
      )}
    </ModalShell>
  );
}
