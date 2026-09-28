"use client";

import { Suspense } from "react";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { RouteLoader } from "@/components/layout/RouteLoader";
import { PortalProvider } from "@/components/portal/PortalProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PortalProvider>
        <Suspense fallback={null}>
          <RouteLoader />
        </Suspense>
        {children}
      </PortalProvider>
    </AuthProvider>
  );
}
