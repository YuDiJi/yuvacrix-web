import type { ReactNode } from "react";
import { AuthInitializer } from "@/components/AuthInitializer";
import AppShell from "@/components/app-shell/AppShell";
import { HeaderProvider } from "@/providers/HeaderProvider";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <AuthInitializer />
      <HeaderProvider>
        <AppShell>{children}</AppShell>
      </HeaderProvider>
    </>
  );
}
