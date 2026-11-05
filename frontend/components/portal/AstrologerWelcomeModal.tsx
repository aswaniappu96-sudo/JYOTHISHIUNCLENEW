"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { ConchIcon } from "@/components/icons/ConchIcon";
import { usePortal } from "@/components/portal/PortalProvider";
import { usePrefs } from "@/components/prefs/PrefsProvider";

export function AstrologerWelcomeModal() {
  const { claimFreeConsultation } = usePortal();
  const { user, loading } = useAuth();
  const { t } = usePrefs();
  const [open, setOpen] = useState(false);
  const claimed = useRef(false);
  const ready = useRef(false);

  function stillOpen(nextUser = user) {
    if (claimed.current) return false;
    if (nextUser && nextUser.free_consultation_available === false) return false;
    return true;
  }

  useEffect(() => {
    const onClaimed = () => {
      claimed.current = true;
      setOpen(false);
    };
    const onIdle = () => {
      if (stillOpen()) setOpen(true);
    };
    window.addEventListener("ju-free-claimed", onClaimed);
    window.addEventListener("ju-portal-idle", onIdle);
    return () => {
      window.removeEventListener("ju-free-claimed", onClaimed);
      window.removeEventListener("ju-portal-idle", onIdle);
    };
  }, [user]);

  useEffect(() => {
    if (loading || ready.current) return;
    ready.current = true;
    if (user && user.free_consultation_available === false) {
      claimed.current = true;
      setOpen(false);
      return;
    }
    setOpen(true);
  }, [loading, user]);

  useEffect(() => {
    if (user && user.free_consultation_available === false) {
      claimed.current = true;
      setOpen(false);
    }
  }, [user]);

  if (!open || !stillOpen()) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/35 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-primary/30 bg-linear-to-b from-surface-high via-surface-container to-surface-lowest p-6 text-center shadow-[0_0_50px_rgba(229,195,120,0.3)] sm:p-8">
        <div className="pointer-events-none absolute -top-20 -left-20 h-48 w-48 rounded-full bg-primary/20 blur-[60px]" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-48 w-48 rounded-full bg-secondary-container/30 blur-[60px]" />
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface-highest/80 text-on-surface hover:text-primary"
          aria-label="Close"
        >
          ×
        </button>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-primary/40 bg-surface-highest text-primary shadow-[0_0_24px_rgba(229,195,120,0.35)]">
          <ConchIcon className="h-8 w-8" />
        </div>
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1">
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">Free consultation</span>
        </div>
        <h3 className="font-serif text-[32px] font-medium leading-[0.95] tracking-[-0.03em] text-on-surface sm:text-[40px]">
          Claim your first 10 minutes free
        </h3>
        <p className="gold-notice mx-auto mt-4 max-w-md rounded-xl border border-[#E9C07A] bg-[#FFF4D8] px-3.5 py-2.5 text-[13px] font-semibold leading-relaxed text-[#6B4A12]">
          {t("video.free")}
        </p>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            claimFreeConsultation();
          }}
          className="mt-6 w-full rounded-full bg-[#E9C07A] px-6 py-3 text-sm font-bold text-[#1E160E] shadow-[0_0_24px_rgba(233,192,122,0.4)] hover:bg-[#E0B46D]"
        >
          Claim free consultation
        </button>
        <button type="button" onClick={() => setOpen(false)} className="mt-2 text-xs text-on-surface-variant hover:text-on-surface">
          Not now
        </button>
      </div>
    </div>
  );
}
