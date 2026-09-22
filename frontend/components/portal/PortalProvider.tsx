"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AuthModal } from "@/components/portal/AuthModal";
import { ConsultationModal } from "@/components/portal/ConsultationModal";
import { EnquiryModal } from "@/components/portal/EnquiryModal";
import { PoojaBookModal } from "@/components/portal/PoojaBookModal";
import { ProductBookModal } from "@/components/portal/ProductBookModal";

export type PortalItem = { slug: string; title: string };

type PortalContextValue = {
  openAuth: (tab?: "login" | "register") => void;
  openPooja: (item: PortalItem) => void;
  openProduct: (item: PortalItem) => void;
  openConsultation: () => void;
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

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [kind, setKind] = useState<"auth" | "pooja" | "product" | "consultation" | "enquiry" | null>(null);
  const [item, setItem] = useState<PortalItem | null>(null);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [enquirySubject, setEnquirySubject] = useState("");

  const close = useCallback(() => {
    setKind(null);
    setItem(null);
  }, []);

  const value = useMemo(
    () => ({
      openAuth: (tab: "login" | "register" = "login") => {
        setAuthTab(tab);
        setKind("auth");
      },
      openPooja: (next: PortalItem) => {
        setItem(next);
        setKind("pooja");
      },
      openProduct: (next: PortalItem) => {
        setItem(next);
        setKind("product");
      },
      openConsultation: () => setKind("consultation"),
      openEnquiry: (subject = "") => {
        setEnquirySubject(subject);
        setKind("enquiry");
      },
      close,
    }),
    [close],
  );

  return (
    <PortalContext.Provider value={value}>
      {children}
      {kind === "auth" ? <AuthModal tab={authTab} onClose={close} /> : null}
      {kind === "pooja" && item ? <PoojaBookModal pooja={item} onClose={close} /> : null}
      {kind === "product" && item ? <ProductBookModal product={item} onClose={close} /> : null}
      {kind === "consultation" ? <ConsultationModal onClose={close} /> : null}
      {kind === "enquiry" ? <EnquiryModal subject={enquirySubject} onClose={close} /> : null}
    </PortalContext.Provider>
  );
}
