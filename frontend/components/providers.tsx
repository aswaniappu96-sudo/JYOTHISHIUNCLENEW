"use client";

import { Suspense } from "react";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { RouteLoader } from "@/components/layout/RouteLoader";
import { PortalProvider } from "@/components/portal/PortalProvider";
import { PrefsProvider } from "@/components/prefs/PrefsProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrefsProvider>
      <AuthProvider>
        <PortalProvider>
          <Suspense fallback={null}>
            <RouteLoader />
          </Suspense>
          {children}
        </PortalProvider>
      </AuthProvider>
    </PrefsProvider>
  );
}
