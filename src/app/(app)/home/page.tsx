import HeroBanner from "./HeroBanner";
import QuickActions from "./QuickActions";
import LiveMatches from "./LiveMatches";
import MyActivity from "./MyActivity";
import ActiveTournaments from "./ActiveTournaments";
import CricketPulse from "./CricketPulse";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="min-h-dvh bg-[#F6F8FC]">
      {/* Scrollable content — padded so fixed nav doesn't obscure */}
      <main className="flex flex-col gap-5 pb-28 pt-4">
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
        {/* <HeroBanner /> */}
        <QuickActions />
        <LiveMatches />
        <MyActivity />
        <ActiveTournaments />
        <CricketPulse />
      </main>
    </div>
  );
}
