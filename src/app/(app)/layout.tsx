import type { ReactNode } from "react";
import { AuthInitializer } from "@/components/auth/AuthInitializer";
import AppShell from "@/components/app-shell/AppShell";
import { HeaderProvider } from "@/providers/HeaderProvider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <AuthInitializer />

      <ProtectedRoute>
        <HeaderProvider>
          <AppShell>{children}</AppShell>
        </HeaderProvider>
      </ProtectedRoute>
    </>
  );
}
