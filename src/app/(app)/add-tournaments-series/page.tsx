// src/app/(app)/add-tournaments-series/page.tsx

"use client";

import { useEffect } from "react";
import { useHeader } from "@/providers/HeaderProvider";
import { CreateTypeChoice } from "./_components/Createtypechoice";

export default function AddTournamentsSeriesPage() {
  const { setHeader } = useHeader();

  useEffect(() => {
    setHeader({
      title: "Add Tournament / Series",
      showBackButton: true,
    });
  }, [setHeader]);

  return (
    <div className="flex min-h-full flex-col bg-(--color-bg-base)">
      <CreateTypeChoice />
    </div>
  );
}
