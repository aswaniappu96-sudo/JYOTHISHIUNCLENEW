"use client";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { PortalProvider } from "@/components/portal/PortalProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PortalProvider>{children}</PortalProvider>
    </AuthProvider>
  );
}
