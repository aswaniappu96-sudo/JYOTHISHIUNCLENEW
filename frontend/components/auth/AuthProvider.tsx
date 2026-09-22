"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser, logoutCustomer, saveProfile } from "@/lib/api/submit";
import type { CustomerUser } from "@/types/forms";
import { ProfileModal } from "@/components/auth/ProfileModal";

type AuthContextValue = {
  user: CustomerUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  refresh: async () => undefined,
  logout: async () => undefined,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const next = await getCurrentUser();
    setUser(next);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      refresh,
      logout: async () => {
        await logoutCustomer();
        setUser(null);
      },
    }),
    [user, loading],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      {user && !user.profile_complete ? (
        <ProfileModal
          onSaved={async (payload) => {
            const result = await saveProfile(payload);
            setUser(result.user);
          }}
        />
      ) : null}
    </AuthContext.Provider>
  );
}
