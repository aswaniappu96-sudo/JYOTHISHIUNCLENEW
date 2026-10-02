"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { AuthModal } from "@/components/portal/AuthModal";
import { BookingReturnModal } from "@/components/portal/BookingReturnModal";
import { ConsultationModal } from "@/components/portal/ConsultationModal";
import { EnquiryModal } from "@/components/portal/EnquiryModal";
import { FreeConsultationOfferModal } from "@/components/portal/FreeConsultationOfferModal";
import { PoojaBookModal } from "@/components/portal/PoojaBookModal";
import { ProductBookModal } from "@/components/portal/ProductBookModal";
import { loginPromptSeen, markLoginPromptSeen } from "@/lib/firstVisit";
import {
  clearWhatsAppReturn,
  readWhatsAppReturn,
  shouldShowWhatsAppReturn,
} from "@/lib/whatsapp-return";
import type { CustomerUser } from "@/types/forms";

export type PortalItem = { slug: string; title: string; vendor?: string };

export type ConsultationPrefill = {
  date?: string;
  slots?: { start: string; end: string }[];
  whatsapp?: string;
  astrologerName?: string;
  purpose?: string;
};

type PortalKind = "auth" | "pooja" | "product" | "consultation" | "consultation-offer" | "enquiry" | null;

type PortalContextValue = {
  openAuth: (tab?: "login" | "register") => void;
  openPooja: (item: PortalItem) => void;
  openProduct: (item: PortalItem) => void;
  openConsultation: (prefill?: ConsultationPrefill) => void;
  openEnquiry: (subject?: string) => void;
  close: () => void;
};

const PortalContext = createContext<PortalContextValue>({
  openAuth: () => undefined,
  openPooja: () => undefined,
  openProduct: () => undefined,
  openConsultation: () => undefined,
  openEnquiry: () => undefined,
  close: () => undefined,
});

export function usePortal() {
  return useContext(PortalContext);
}

function freeOfferAvailable(user: CustomerUser | null) {
  return Boolean(user && user.free_consultation_available !== false);
}

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [kind, setKind] = useState<PortalKind>(null);
  const [item, setItem] = useState<PortalItem | null>(null);
  const [consultationPrefill, setConsultationPrefill] = useState<ConsultationPrefill | null>(null);
  const [claimFree, setClaimFree] = useState(false);
  const [authForConsultation, setAuthForConsultation] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [enquirySubject, setEnquirySubject] = useState("");
  const [firstVisitAuth, setFirstVisitAuth] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [returnOpen, setReturnOpen] = useState(false);
  const prompted = useRef(false);

  const closeReturn = useCallback(() => {
    clearWhatsAppReturn();
    setReturnOpen(false);
  }, []);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setWhatsappNumber(String(data?.whatsapp_number || "")))
      .catch(() => setWhatsappNumber(""));
  }, []);

  useEffect(() => {
    const maybeShow = () => {
      if (!shouldShowWhatsAppReturn()) return;
      setReturnOpen(true);
    };
    maybeShow();
    document.addEventListener("visibilitychange", maybeShow);
    window.addEventListener("pageshow", maybeShow);
    window.addEventListener("focus", maybeShow);
    window.addEventListener("ju-whatsapp-opened", maybeShow);
    return () => {
      document.removeEventListener("visibilitychange", maybeShow);
      window.removeEventListener("pageshow", maybeShow);
      window.removeEventListener("focus", maybeShow);
      window.removeEventListener("ju-whatsapp-opened", maybeShow);
    };
  }, []);

  const close = useCallback(() => {
    if (firstVisitAuth) {
      markLoginPromptSeen();
      setFirstVisitAuth(false);
    }
    setKind(null);
    setItem(null);
    setConsultationPrefill(null);
    setClaimFree(false);
    setAuthForConsultation(false);
  }, [firstVisitAuth]);

  const startConsultationForm = useCallback((withFree: boolean) => {
    setFirstVisitAuth(false);
    setAuthForConsultation(false);
    setClaimFree(withFree);
    setKind("consultation");
  }, []);

  useEffect(() => {
    if (loading || prompted.current) return;
    if (readWhatsAppReturn()) {
      prompted.current = true;
      return;
    }
    if (user || loginPromptSeen()) {
      markLoginPromptSeen();
      prompted.current = true;
      return;
    }
    prompted.current = true;
    setAuthTab("login");
    setFirstVisitAuth(true);
    setKind("auth");
  }, [loading, user]);

  const value = useMemo(
    () => ({
      openAuth: (tab: "login" | "register" = "login") => {
        setAuthTab(tab);
        setFirstVisitAuth(false);
        setAuthForConsultation(false);
        setKind("auth");
      },
      openPooja: (next: PortalItem) => {
        setItem(next);
        setAuthForConsultation(false);
        setKind("pooja");
      },
      openProduct: (next: PortalItem) => {
        setItem(next);
        setAuthForConsultation(false);
        setKind("product");
      },
      openConsultation: (prefill?: ConsultationPrefill) => {
        setConsultationPrefill(prefill || null);
        setFirstVisitAuth(false);
        if (!user) {
          setAuthForConsultation(true);
          setAuthTab("login");
          setKind("auth");
          return;
        }
        if (freeOfferAvailable(user)) {
          setAuthForConsultation(false);
          setKind("consultation-offer");
          return;
        }
        startConsultationForm(false);
      },
      openEnquiry: (subject = "") => {
        setEnquirySubject(subject);
        setAuthForConsultation(false);
        setKind("enquiry");
      },
      close,
    }),
    [close, startConsultationForm, user],
  );

  return (
    <PortalContext.Provider value={value}>
      {children}
      {kind === "auth" && !returnOpen ? (
        <AuthModal
          tab={authTab}
          firstVisit={firstVisitAuth}
          consultationOffer={authForConsultation}
          onClose={() => {
            if (authForConsultation) {
              startConsultationForm(false);
              return;
            }
            close();
          }}
          onAuthenticated={(authed) => {
            if (authForConsultation) {
              if (freeOfferAvailable(authed)) {
                setAuthForConsultation(false);
                setKind("consultation-offer");
                return;
              }
              startConsultationForm(false);
              return;
            }
            close();
          }}
        />
      ) : null}
      {kind === "consultation-offer" && !returnOpen ? (
        <FreeConsultationOfferModal
          onAccept={() => startConsultationForm(true)}
          onCancel={() => startConsultationForm(false)}
        />
      ) : null}
      {kind === "pooja" && item ? <PoojaBookModal pooja={item} whatsappNumber={whatsappNumber} onClose={close} /> : null}
      {kind === "product" && item ? (
        <ProductBookModal product={item} whatsappNumber={whatsappNumber} onClose={close} />
      ) : null}
      {kind === "consultation" ? (
        <ConsultationModal
          key={`${consultationPrefill?.purpose || "other"}-${consultationPrefill?.date || ""}`}
          onClose={close}
          claimFree={claimFree}
          prefill={{
            ...consultationPrefill,
            whatsapp: consultationPrefill?.whatsapp || whatsappNumber,
          }}
        />
      ) : null}
      {kind === "enquiry" ? <EnquiryModal subject={enquirySubject} onClose={close} /> : null}
      {returnOpen ? <BookingReturnModal onClose={closeReturn} /> : null}
    </PortalContext.Provider>
  );
}
