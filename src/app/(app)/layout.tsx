import type { ReactNode } from "react";
import { AuthInitializer } from "@/components/AuthInitializer";
import AppShell from "@/components/app-shell/AppShell";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <AuthInitializer />
      <AppShell>{children}</AppShell>
    </>
  );
}
