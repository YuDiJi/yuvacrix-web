"use client";

import { ExternalLink, MoreVertical, Radio, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MatchLiveStream } from "@/types/liveStream";

type LiveStreamPlayerProps = {
  stream: MatchLiveStream;
  title: string;
  canManageStream: boolean;
  isUpdatingStatus: boolean;
  onDisable: () => void;
  onChangeUrl: () => void;
};

export function LiveStreamPlayer({
  stream,
  title,
  canManageStream,
  isUpdatingStatus,
  onDisable,
  onChangeUrl,
}: LiveStreamPlayerProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [menuOpen]);

  const playerUrl = `${stream.embedUrl}?playsinline=1&rel=0`;

  return (
    <section className="border-b border-(--color-bg-border) bg-black">
      <div className="relative">
        {/* Player */}
        <div className="aspect-video w-full bg-black">
          <iframe
            src={playerUrl}
            title={title}
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>

        {/* Live badge */}
        <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-red-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-md">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          Live
        </div>

        {/* Admin menu */}
        {canManageStream && (
          <div ref={menuRef} className="absolute right-3 top-3">
            <button
              type="button"
              aria-label="Manage live stream"
              onClick={() => setMenuOpen((current) => !current)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-sm transition hover:bg-black/80"
            >
              <MoreVertical className="h-5 w-5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-11 z-20 w-52 overflow-hidden rounded-xl border border-white/10 bg-(--color-bg-card) py-1 shadow-xl">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onChangeUrl();
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-(--color-text-primary) transition hover:bg-(--color-bg-tint)"
                >
                  <Settings className="h-4 w-4 text-(--color-text-secondary)" />
                  Change YouTube URL
                </button>

                <a
                  href={stream.watchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-(--color-text-primary) transition hover:bg-(--color-bg-tint)"
                >
                  <ExternalLink className="h-4 w-4 text-(--color-text-secondary)" />
                  Open on YouTube
                </a>

                <button
                  type="button"
                  disabled={isUpdatingStatus}
                  onClick={() => {
                    setMenuOpen(false);
                    onDisable();
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Radio className="h-4 w-4" />

                  {isUpdatingStatus ? "Disabling..." : "Disable Live Stream"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
