"use client";

import { Suspense } from "react";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { RouteLoader } from "@/components/layout/RouteLoader";
import { PortalProvider } from "@/components/portal/PortalProvider";
import { PrefsProvider } from "@/components/prefs/PrefsProvider";
import type { I18nOverrides } from "@/lib/i18n";

export function Providers({
  children,
  initialStrings,
}: {
  children: React.ReactNode;
  initialStrings?: I18nOverrides;
}) {
  return (
    <PrefsProvider initialStrings={initialStrings}>
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
