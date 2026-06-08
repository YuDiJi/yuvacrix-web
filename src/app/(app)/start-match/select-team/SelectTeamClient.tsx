"use client";

import { usePageHeader } from "@/hooks/usePageHeader";
import { useSearchParams } from "next/navigation";

export default function SelectTeamClient() {
  const params = useSearchParams();

  const slot = (params.get("slot") ?? "A") as "A" | "B";

  usePageHeader({
    title: `Select Team ${slot}`,
    showBackButton: true,
    showNotifications: false,
  });

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Select Team {slot}</h2>

      <p className="mt-2 text-sm text-gray-500">Team list will come here.</p>
    </div>
  );
}
