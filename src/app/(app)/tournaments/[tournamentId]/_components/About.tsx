import {
  Phone,
  MessageCircle,
  MapPin,
  ChevronRight,
  Edit3,
  Calendar,
  Circle,
  Map,
  HelpCircle,
  AlertCircle,
  SlidersHorizontal,
} from "lucide-react";
import { useGetAboutQuery } from "@/store/api/tournamentApi";
import { useParams, useRouter } from "next/navigation";
import { S3Image } from "@/components/common/S3Image";

const About = () => {
  const router = useRouter();
  const params = useParams();
  const tournamentId = params.tournamentId as string;

  const {
    data: about,
    isLoading: isDashboardLoading,
    isError,
  } = useGetAboutQuery(tournamentId);

  function getInitials(name?: string) {
    if (!name) return "YC";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  function formatDate(date?: string | null) {
    if (!date) return "TBA";

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  }

  if (isDashboardLoading) {
    return (
      <div className="flex min-h-dvh flex-col bg-(--color-bg-base)">
        <div className="p-4 space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-xl bg-(--color-bg-card)"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !about) {
    return (
      <div className="flex pt-20 items-center justify-center bg-(--color-bg-base) p-4">
        <div className="rounded-xl bg-(--color-bg-card) p-5 text-center shadow-(--shadow-card)">
          <AlertCircle className="mx-auto mb-3 text-(--color-live)" />
          <h2 className="font-(family-name:--font-display) text-xl font-black text-(--color-navy)">
            Tournament not found
          </h2>
          <button
            type="button"
            onClick={() => router.back()}
            className="mt-4 rounded-xl bg-(--color-brand) px-5 py-3 text-sm font-bold text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* 1. Tournament Setup Guide */}
      <div className="rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) overflow-hidden shadow-sm">
        <div className="flex items-center justify-between bg-(--color-bg-tint) px-4 py-3 border-b border-(--color-bg-border)">
          <h3 className="font-(family-name:--font-display) text-base font-black uppercase text-(--color-navy) tracking-wide">
            Tournament Setup Guide
          </h3>
          <HelpCircle size={18} className="text-(--color-brand)" />
        </div>
        <div className="p-4 flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 border border-(--color-bg-border) rounded-xl py-3 text-(--color-navy) font-semibold text-sm hover:bg-(--color-bg-tint) transition-all active:scale-[0.98]">
            <Phone size={18} className="text-(--color-brand)" />
            Call Helpline
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 border border-(--color-bg-border) rounded-xl py-3 text-(--color-navy) font-semibold text-sm hover:bg-(--color-bg-tint) transition-all active:scale-[0.98]">
            <MessageCircle size={18} className="text-[#25D366]" />
            WhatsApp
          </button>
        </div>
      </div>

      {/* 2. Organiser Details */}
      <div className="rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) overflow-hidden shadow-sm">
        <div className="bg-(--color-bg-tint) px-4 py-3 border-b border-(--color-bg-border)">
          <h3 className="font-(family-name:--font-display) text-base font-black uppercase text-(--color-navy) tracking-wide">
            Organiser Details
          </h3>
        </div>
        <div className="p-4 flex items-center justify-between active:bg-slate-50 transition-colors cursor-pointer">
          <div className="flex items-center gap-4">
            {/* Avatar with Pro Badge */}
            <div className="relative">
              {about?.organiser?.avatarUrl ? (
                <S3Image
                  imageKey={about?.organiser?.avatarUrl}
                  alt={about?.organiser?.name}
                  width={56}
                  height={56}
                  className="rounded-full object-cover border border-(--color-bg-border)"
                  fallback={
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-(--color-bg-border) bg-(--color-navy)">
                      <span className="font-(family-name:--font-display) text-lg font-black text-white">
                        {getInitials(about?.organiser?.name)}
                      </span>
                    </div>
                  }
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-(--color-bg-border) bg-(--color-navy)">
                  <span className="font-(family-name:--font-display) text-lg font-black text-white">
                    {getInitials(about?.organiser?.name)}
                  </span>
                </div>
              )}

              {/* {about?.organiser.isPro && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-(--color-brand) px-1.5 py-0.5 rounded text-[9px] font-black text-white uppercase tracking-widest border border-white">
                  PRO
                </div>
              )} */}
            </div>

            {/* Details */}
            <div className="ml-1">
              <h4 className="font-semibold text-(--color-navy) text-lg">
                {about?.organiser?.name}
              </h4>
              <div className="flex items-center gap-1 text-xs text-(--color-text-secondary) mt-0.5">
                <MapPin size={12} />
                <span>{about?.organiser?.city}</span>
              </div>
              <p className="text-xs font-semibold text-(--color-brand) mt-1.5">
                {about?.organiser?.tournamentsOrganised} Tournaments Organised
              </p>
            </div>
          </div>
          <ChevronRight size={20} className="text-(--color-text-muted)" />
        </div>
      </div>

      {/* 3. Tournament Details */}
      <div className="rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) overflow-hidden shadow-sm">
        <div className="flex items-center justify-between bg-(--color-bg-tint) px-4 py-3 border-b border-(--color-bg-border)">
          <h3 className="font-(family-name:--font-display) text-base font-black uppercase text-(--color-navy) tracking-wide">
            Tournament Details
          </h3>
          {/* <button className="text-(--color-brand) hover:opacity-80 active:scale-95 transition-all">
            <Edit3 size={18} strokeWidth={2.5} />
          </button> */}
          {about.actions.canEdit && (
            <button
              type="button"
              onClick={() => router.push(`/tournaments/${tournamentId}/edit`)}
              className="text-(--color-brand) transition-all hover:opacity-80 active:scale-95"
              aria-label="Edit tournament"
            >
              <Edit3 size={18} strokeWidth={2.5} />
            </button>
          )}
        </div>

        <div className="p-5 flex flex-col gap-6">
          {about.actions.canEdit && (
            <button
              type="button"
              onClick={() => router.push(`/tournaments/${tournamentId}/rules`)}
              className="flex items-center justify-between rounded-xl border border-(--color-brand)/20 bg-(--color-bg-tint) px-4 py-3 text-left"
            >
              <div>
                <p className="text-sm font-bold text-(--color-navy)">
                  Match rules
                </p>
                <p className="mt-0.5 text-xs text-(--color-text-muted)">
                  Set rules inherited by tournament matches
                </p>
              </div>
              <SlidersHorizontal size={18} className="text-(--color-brand)" />
            </button>
          )}
          {/* Row 1 */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-(--color-text-muted) uppercase tracking-wider mb-1">
                Tournament Name
              </p>
              <p className="text-[15px] font-semibold text-(--color-navy) leading-snug pr-4">
                {about?.tournament.name}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[10px] font-bold text-(--color-text-muted) uppercase tracking-wider mb-1">
                Category
              </p>
              <span className="inline-block px-3 py-1 bg-(--color-bg-tint) border border-(--color-brand)/20 text-(--color-brand) text-[11px] font-black rounded-full uppercase tracking-widest">
                {about?.tournament.category}
              </span>
            </div>
          </div>

          {/* Row 2 */}
          <div>
            <p className="text-[10px] font-bold text-(--color-text-muted) uppercase tracking-wider mb-1">
              Date Range
            </p>
            <div className="flex items-center gap-2 text-[15px] font-medium text-(--color-navy)">
              <Calendar size={18} className="text-(--color-brand)" />
              <span>
                {formatDate(about?.tournament.startDate)}-
                {formatDate(about?.tournament.endDate)}
              </span>
            </div>
          </div>

          {/* Row 3 - Grounds */}
          <div>
            <p className="text-[10px] font-bold text-(--color-text-muted) uppercase tracking-wider mb-1">
              Primary Grounds
            </p>
            <div className="flex items-center justify-between border border-(--color-bg-border) rounded-xl p-3 bg-white">
              <div className="flex items-center gap-2 text-[15px] font-medium text-(--color-navy)">
                <MapPin size={18} className="text-(--color-brand)" />
                <span>{about?.tournament.location?.groundName}</span>
              </div>
              <Map size={18} className="text-(--color-brand)" />
            </div>
          </div>

          {/* Row 4 */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-(--color-text-muted) uppercase tracking-wider mb-1">
                Ball Type
              </p>
              <div className="flex items-center gap-2 text-[15px] font-medium text-(--color-navy)">
                <Circle
                  size={16}
                  className="text-(--color-brand)"
                  strokeWidth={2.5}
                />
                <span>{about?.tournament.ballType}</span>
              </div>
            </div>

            {/* <div className="text-right">
                <p className="text-[10px] font-bold text-(--color-text-muted) uppercase tracking-wider mb-1 text-left">
                  Tournament ID
                </p>
                <div className="flex items-center gap-1.5 text-[15px] text-(--color-navy)">
                  <span className="font-black font-(family-name:--font-display) tracking-wide text-lg">
                    {about?.details.tournamentId}
                  </span>
                  <button className="text-(--color-text-muted) hover:text-(--color-brand) active:scale-95 transition-all">
                    <Copy size={16} />
                  </button>
                </div>
              </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
