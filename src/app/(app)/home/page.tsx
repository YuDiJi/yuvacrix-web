// import HeroBanner from "./HeroBanner";
// import QuickActions from "./QuickActions";
// import LiveMatches from "./LiveMatches";
// import MyActivity from "./MyActivity";
// import ActiveTournaments from "./ActiveTournaments";
// import CricketPulse from "./CricketPulse";
// import Image from "next/image";
// import { useGetHomeQuery } from "@/store/api/home";

// export default function HomePage() {
//   const { data, isLoading, isError, refetch } = useGetHomeQuery({
//     liveMatchLimit: 5,
//     city: "Mumbai",
//   });

//   return (
//     <div className="min-h-dvh bg-[#F6F8FC]">
//       {/* Scrollable content — padded so fixed nav doesn't obscure */}
//       <main className="flex flex-col gap-5 pb-28 pt-4">
//         <div className="mx-3 overflow-hidden rounded-2xl shadow-[0_8px_32px_rgba(13,27,62,0.25)]">
//           <Image
//             src="/banner home page.png"
//             alt="YuvaCrix Live Cricket"
//             width={800}
//             height={320}
//             priority
//             className="h-auto w-full object-cover"
//           />
//         </div>
//         {/* <HeroBanner /> */}
//         <QuickActions />
//         <LiveMatches />
//         <MyActivity />
//         <ActiveTournaments />
//         <CricketPulse />
//       </main>
//     </div>
//   );
// }

"use client";

import Image from "next/image";
import { RefreshCw } from "lucide-react";
import { useGetHomeQuery } from "@/store/api/home";
import QuickActions from "./QuickActions";
import LiveMatches from "./LiveMatches";
import MyActivity from "./MyActivity";
import ActiveTournaments from "./ActiveTournaments";
import CricketPulse from "./CricketPulse";

// ── Skeleton ──────────────────────────────────────────────────────────
function SectionSkeleton({ rows = 1 }: { rows?: number }) {
  return (
    <div className="flex gap-3 overflow-hidden px-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-40 w-50 shrink-0 animate-pulse rounded-2xl border border-[#E8ECF2] bg-white"
        />
      ))}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-5 pb-28 pt-4">
      {/* Banner */}
      <div className="mx-3 h-45 animate-pulse rounded-2xl bg-[#E8ECF2]" />
      {/* Quick Actions */}
      <SectionSkeleton rows={5} />
      {/* Live Matches */}
      <SectionSkeleton rows={3} />
      {/* My Activity */}
      <div className="mx-3 h-20 animate-pulse rounded-2xl bg-white border border-[#E8ECF2]" />
      {/* Tournaments */}
      <SectionSkeleton rows={3} />
      {/* Pulse */}
      <SectionSkeleton rows={4} />
    </div>
  );
}

// ── Error state ───────────────────────────────────────────────────────
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-20 text-center">
      <p className="font-display text-[16px] font-bold uppercase text-[#0D1B3E]">
        Unable to load home
      </p>
      <p className="text-[13px] text-[#6B7280]">
        Check your connection and try again.
      </p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 rounded-xl bg-[#2F5BFF] px-5 py-3 text-[13px] font-bold text-white shadow-[0_4px_16px_rgba(47,91,255,0.3)]"
      >
        <RefreshCw size={15} />
        Retry
      </button>
    </div>
  );
}

// ── Banner ────────────────────────────────────────────────────────────
function BannerImage() {
  return (
    <div className="mx-3 overflow-hidden rounded-2xl shadow-[0_8px_32px_rgba(13,27,62,0.25)]">
      <Image
        src="/banner home page.png"
        alt="YuvaCrix Live Cricket"
        width={800}
        height={320}
        priority
        className="h-auto w-full object-cover"
      />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────
export default function HomePage() {
  const { data, isLoading, isError, refetch } = useGetHomeQuery({
    liveMatchLimit: 5,
    city: "Mumbai",
  });

  return (
    <div className="min-h-dvh bg-[#F6F8FC]">
      <main className="flex flex-col gap-5 pb-28 pt-4">
        {isLoading && <Skeleton />}

        {isError && <ErrorState onRetry={refetch} />}

        {!isLoading && !isError && data && (
          <>
            <BannerImage />

            <QuickActions actions={data.quickActions} />

            <LiveMatches matches={data.todayLiveMatches} />

            <MyActivity items={data.myActivity} />

            <ActiveTournaments tournaments={data.activeTournaments} />

            <CricketPulse pulses={data.cricketPulse} />
          </>
        )}
      </main>
    </div>
  );
}
