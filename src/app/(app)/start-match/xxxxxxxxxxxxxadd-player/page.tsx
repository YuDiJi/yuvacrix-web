"use client";

import { useEffect } from "react";
import { useHeader } from "@/providers/HeaderProvider";
import { Phone } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AddPlayerPage() {
  const { setHeader } = useHeader();
  const router = useRouter();

  const searchParams = useSearchParams();
  const team = searchParams.get("team");

  useEffect(() => {
    setHeader({
      title: "ADD PLAYERS TO " + (team ? team.toUpperCase() : ""),
      showBackButton: true,
      showNotifications: false,
    });
  }, [setHeader]);

  return (
    <div className="p-4 bg-slate-50 min-h-full space-y-4">
      {/* Other Methods */}
      <button
        onClick={() => router.push("/start-match/create-player")}
        className="w-full bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
      >
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
          <Phone size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-900 text-sm uppercase">
            ADD VIA PHONE NUMBER
          </h3>
          <p className="text-xs text-slate-500">
            Best for adding 1 or 2 players quickly.
          </p>
        </div>
      </button>

      <div className="px-2">
        <button
          onClick={() => router.push("/start-match/create-player?manual=true")}
          className="text-sm font-medium text-blue-600 underline underline-offset-2"
        >
          Player doesn&apos;t have a mobile number? Add manually
        </button>
      </div>
    </div>
  );
}

{
  /* Team Link */
}
{
  /* <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <Copy size={20} />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-sm uppercase">
              TEAM LINK
            </h3>
            <p className="text-xs text-slate-500">
              Easiest way to add players.
            </p>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 italic text-center mb-4">
          Share this link with captain and let them add their respective players
          directly to the team.
        </p>
        <div className="flex gap-3">
          <button className="flex-1 py-2.5 border border-teal-600 text-teal-600 font-semibold rounded-lg flex items-center justify-center gap-2 text-xs">
            <Send size={16} /> Share
          </button>
          <button className="flex-1 py-2.5 bg-teal-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 text-xs">
            <MessageCircle size={16} /> WhatsApp
          </button>
        </div>
      </div> */
}

{
  /* <button className="w-full bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 text-left active:scale-[0.98] transition-transform">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
          <Contact2 size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-900 text-sm uppercase">
            ADD FROM CONTACTS
          </h3>
          <p className="text-xs text-slate-500">
            Best if players are already in your contacts.
          </p>
        </div>
      </button> */
}

{
  /* <button className="w-full bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 text-left active:scale-[0.98] transition-transform">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
          <QrCode size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-900 text-sm uppercase">
            TEAM QR CODE
          </h3>
          <p className="text-xs text-slate-500">
            Scan and add players directly via QR code.
          </p>
        </div>
      </button> */
}
