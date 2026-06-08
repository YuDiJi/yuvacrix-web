import type { ReactNode } from "react";

export default function StartMatchLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="flex h-full flex-col">{children}</div>;
}
