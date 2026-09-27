"use client";

import { useEffect, useState } from "react";
import { ConchIcon } from "@/components/icons/ConchIcon";
import { usePortal } from "@/components/portal/PortalProvider";
import { loginPromptSeen } from "@/lib/firstVisit";

const KEY = "ju_astrologer_welcome";

export function AstrologerWelcomeModal() {
  const { openConsultation } = usePortal();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY)) return;
    } catch {
      return;
    }

    const reveal = () => {
      try {
        if (sessionStorage.getItem(KEY)) {
          setOpen(false);
          return true;
        }
      } catch {
        return true;
      }
      if (loginPromptSeen()) {
        setOpen(true);
        return true;
      }
      return false;
    };
    if (reveal()) return;
    const timer = window.setInterval(() => {
      if (reveal()) window.clearInterval(timer);
    }, 400);
    return () => window.clearInterval(timer);
  }, []);

  function dismiss() {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/35 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-primary/30 bg-linear-to-b from-surface-high via-surface-container to-surface-lowest p-6 text-center shadow-[0_0_50px_rgba(229,195,120,0.3)] sm:p-8">
        <div className="pointer-events-none absolute -top-20 -left-20 h-48 w-48 rounded-full bg-primary/20 blur-[60px]" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-48 w-48 rounded-full bg-secondary-container/30 blur-[60px]" />
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface-highest/80 text-on-surface hover:text-primary"
          aria-label="Close"
        >
          ×
        </button>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-primary/40 bg-surface-highest text-primary shadow-[0_0_24px_rgba(229,195,120,0.35)]">
          <ConchIcon className="h-8 w-8" />
        </div>
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Sacred Welcome Gift</span>
        </div>
        <h3 className="font-serif text-3xl text-primary sm:text-4xl">First Call & Chat Free!</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-on-surface-variant">
          Welcome to JyothishiUncle Sanctuary — connect with our consecrated gurus for your first 5-minute divine
          consultation at zero dakshina.
        </p>
        <div className="my-6 grid grid-cols-2 gap-3 text-left">
          <div className="rounded-xl border border-outline-variant/30 bg-surface-lowest/80 p-3">
            <p className="text-xs font-semibold text-on-surface">Free Audio Call</p>
            <p className="text-[11px] text-on-surface-variant">Instant 1-on-1 connect</p>
          </div>
          <div className="rounded-xl border border-outline-variant/30 bg-surface-lowest/80 p-3">
            <p className="text-xs font-semibold text-on-surface">Free Live Chat</p>
            <p className="text-[11px] text-on-surface-variant">Private sanctified room</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            dismiss();
            openConsultation();
          }}
          className="w-full rounded-full bg-primary-container px-6 py-3 text-sm font-bold text-on-primary shadow-[0_0_24px_rgba(229,195,120,0.4)]"
        >
          Claim Free Session Now
        </button>
        <button type="button" onClick={dismiss} className="mt-2 text-xs text-on-surface-variant hover:text-on-surface">
          Maybe Later
        </button>
      </div>
    </div>
  );
}
