"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Field, ModalShell, fieldClass, goldBtn } from "@/components/portal/ModalShell";
import { loginCustomer, registerCustomer } from "@/lib/api/submit";
import { HEAR_ABOUT_OPTIONS } from "@/types/forms";

export function AuthModal({
  tab,
  onClose,
}: {
  tab: "login" | "register";
  onClose: () => void;
}) {
  const { refresh } = useAuth();
  const [mode, setMode] = useState<"login" | "register">(tab);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      await loginCustomer(String(data.get("email") || ""), String(data.get("password") || ""));
      await refresh();
      onClose();
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
      await registerCustomer({
        name: String(data.get("name") || ""),
        address: String(data.get("location") || ""),
        location: String(data.get("location") || ""),
        phone: String(data.get("mobile") || ""),
        mobile: String(data.get("mobile") || ""),
        email: String(data.get("email") || ""),
        password: String(data.get("password") || ""),
        source: String(data.get("source") || ""),
        message: String(data.get("message") || ""),
        website: String(data.get("website") || ""),
      });
      await refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to register.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ModalShell
      eyebrow={mode === "login" ? "Returning seeker" : "New seeker"}
      title={mode === "login" ? "Login" : "Create account"}
      onClose={onClose}
    >
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-surface-lowest/70 p-1">
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
            {busy ? "Signing in…" : "Login"}
          </button>
        </form>
      ) : (
        <form onSubmit={onRegister} className="grid gap-3">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
          <Field label="Name">
            <input required name="name" className={fieldClass} />
          </Field>
          <Field label="Address / Location">
            <input required name="location" className={fieldClass} />
          </Field>
          <Field label="Phone Number">
            <input required name="mobile" className={fieldClass} />
          </Field>
          <Field label="Email">
            <input required type="email" name="email" className={fieldClass} />
          </Field>
          <Field label="Password (min. 8 characters)">
            <input required minLength={8} type="password" name="password" className={fieldClass} />
          </Field>
          <Field label="How did you hear about JyothishiUncle?">
            <select name="source" className={fieldClass}>
              {HEAR_ABOUT_OPTIONS.map((source) => (
                <option key={source}>{source}</option>
              ))}
            </select>
          </Field>
          <Field label="Query / Message">
            <textarea name="message" rows={3} className={fieldClass} />
          </Field>
          {error ? <p className="text-sm text-lotus">{error}</p> : null}
          <button disabled={busy} className={goldBtn}>
            {busy ? "Saving…" : "Create account"}
          </button>
        </form>
      )}
    </ModalShell>
  );
}
