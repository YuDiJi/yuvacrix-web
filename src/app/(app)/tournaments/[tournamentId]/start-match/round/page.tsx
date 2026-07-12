"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Trophy,
  Swords,
  Star,
  Medal,
  FlaskConical,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Check,
  X,
} from "lucide-react";
import {
  TournamentRoundTemplate,
  TournamentRoundTemplateCategory,
  TournamentRoundTemplateGroup,
  useCreateTournamentRoundMutation,
  useGetTournamentRoundsQuery,
  useGetTournamentRoundTemplatesQuery,
} from "@/store/api/tournamentRoundApi";
import { cn } from "@/lib/cn";
import { Button } from "@/components/common/Button";
import { useAppDispatch } from "@/store/hooks";

// ── Types ─────────────────────────────────────────────────────────────

// ── Category icon map ─────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<
  TournamentRoundTemplateCategory,
  { icon: React.ElementType; iconColor: string; iconBg: string }
> = {
  ROUND_ROBIN: {
    icon: Trophy,
    iconColor: "text-(--color-brand)",
    iconBg: "bg-(--color-brand)/10",
  },
  KNOCKOUT: {
    icon: Swords,
    iconColor: "text-red-500",
    iconBg: "bg-red-50",
  },
  PLAYOFFS: {
    icon: Star,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
  },
  FINALS: {
    icon: Trophy,
    iconColor: "text-yellow-600",
    iconBg: "bg-yellow-50",
  },
  POSITION_MATCHES: {
    icon: Medal,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
  },
  TEST_MATCHES: {
    icon: FlaskConical,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
  },
};

// ── Template row ──────────────────────────────────────────────────────

function TemplateRow({
  template,
  disabled,
  isSelected,
  onToggle,
}: {
  template: TournamentRoundTemplate;
  isSelected: boolean;
  onToggle: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        disabled && "cursor-not-allowed opacity-50",
        "flex w-full items-center gap-3 rounded-xl border-2 px-3.5 py-3 text-left",
        "transition-all duration-150 active:scale-[0.98]",
        isSelected
          ? "border-(--color-brand) bg-(--color-brand)/5"
          : "border-(--color-bg-border) bg-(--color-bg-card) hover:border-(--color-brand)/30",
      )}
    >
      {/* Checkbox circle */}
      <div
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
          isSelected || disabled
            ? "border-(--color-brand) bg-(--color-brand)"
            : "border-(--color-bg-border) bg-white",
        )}
      >
        {(isSelected || disabled) && (
          <Check size={11} strokeWidth={3} className="text-white" />
        )}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={cn(
              "text-[13px] font-bold",
              isSelected ? "text-(--color-brand)" : "text-(--color-navy)",
            )}
          >
            {template.label}
          </span>
          {template.isPopular && (
            <span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-amber-600">
              Popular
            </span>
          )}
          {template.isFinalRound && (
            <span className="rounded-full bg-yellow-50 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-yellow-600">
              Final
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[11px] leading-snug text-(--color-text-muted)">
          {template.description}
        </p>
      </div>
    </button>
  );
}

// ── Accordion section ─────────────────────────────────────────────────

function CategoryAccordion({
  group,
  selectedKeys,
  onToggleTemplate,
  defaultOpen,
  tournamentId,
}: {
  group: TournamentRoundTemplateGroup;
  selectedKeys: Set<string>;
  onToggleTemplate: (key: string) => void;
  defaultOpen: boolean;
  tournamentId: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const cfg = CATEGORY_CONFIG[group.category];
  const Icon = cfg.icon;

  const { data: existingRounds } = useGetTournamentRoundsQuery({
    tournamentId,
  });

  const existingRoundTypes = useMemo(
    () => new Set(existingRounds?.map((r) => r.roundType) ?? []),
    [existingRounds],
  );

  const selectedCountInGroup = group.templates.filter((t) =>
    selectedKeys.has(t.key),
  ).length;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border-2 transition-all duration-200",
        open
          ? "border-(--color-brand) shadow-[0_2px_12px_rgba(27,63,160,0.10)]"
          : "border-(--color-bg-border) bg-(--color-bg-card)",
      )}
    >
      {/* Accordion header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors",
          open ? "bg-(--color-brand)" : "bg-(--color-bg-card)",
        )}
      >
        {/* Icon tile */}
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
            open ? "bg-white/15" : cfg.iconBg,
          )}
        >
          <Icon
            size={17}
            className={open ? "text-white" : cfg.iconColor}
            strokeWidth={2}
          />
        </div>

        {/* Title + description */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "font-display text-[14px] font-black uppercase tracking-wide",
                open ? "text-white" : "text-(--color-navy)",
              )}
            >
              {group.title}
            </span>
            {selectedCountInGroup > 0 && (
              <span
                className={cn(
                  "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-black",
                  open
                    ? "bg-white/25 text-white"
                    : "bg-(--color-brand) text-white",
                )}
              >
                {selectedCountInGroup}
              </span>
            )}
          </div>
          <p
            className={cn(
              "text-[11px] leading-tight",
              open ? "text-white/65" : "text-(--color-text-muted)",
            )}
          >
            {group.templates.length} options
          </p>
        </div>

        {/* Chevron */}
        {open ? (
          <ChevronUp size={16} className="shrink-0 text-white/70" />
        ) : (
          <ChevronDown
            size={16}
            className="shrink-0 text-(--color-text-muted)"
          />
        )}
      </button>

      {/* Collapsible template list */}
      {open && (
        <div className="flex flex-col gap-2 bg-(--color-bg-base) p-3">
          <p className="px-1 text-[11px] text-(--color-text-muted)">
            {group.description}
          </p>
          {group.templates.map((template) => (
            <TemplateRow
              key={template.key}
              template={template}
              disabled={existingRoundTypes.has(template.roundType)}
              isSelected={selectedKeys.has(template.key)}
              onToggle={() => onToggleTemplate(template.key)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────

function AccordionSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card)">
      <div className="flex items-center gap-3 px-4 py-3.5">
        <div className="h-9 w-9 shrink-0 rounded-xl bg-(--color-bg-border)" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3.5 w-1/3 rounded bg-(--color-bg-border)" />
          <div className="h-3 w-1/5 rounded bg-(--color-bg-border)" />
        </div>
        <div className="h-4 w-4 rounded bg-(--color-bg-border)" />
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────

const RoundPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useParams();
  const tournamentId = params.tournamentId as string;

  const { data, isLoading, isError } = useGetTournamentRoundTemplatesQuery();
  const [createTournamentRound, { isLoading: isCreatingRound }] =
    useCreateTournamentRoundMutation();

  // const groups: TournamentRoundTemplateGroup[] = data?.groups ?? [];
  const groups = useMemo<TournamentRoundTemplateGroup[]>(
    () => data?.groups ?? [],
    [data?.groups],
  );
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");

  function toggleTemplate(key: string) {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const selectedCount = selectedKeys.size;

  // Labels for summary chips (all selected, not just first 3)
  const allTemplates = useMemo(
    () => groups.flatMap((g) => g.templates),
    [groups],
  );

  const selectedLabels = useMemo(
    () =>
      Array.from(selectedKeys).map(
        (key) => allTemplates.find((t) => t.key === key)?.label ?? key,
      ),
    [selectedKeys, allTemplates],
  );

  async function handleDone() {
    if (selectedKeys.size === 0) return;

    try {
      const selectedTemplates = allTemplates.filter((template) =>
        selectedKeys.has(template.key),
      );

      const results = await Promise.allSettled(
        selectedTemplates.map((template) =>
          createTournamentRound({
            tournamentId,
            body: {
              name: template.label,
              description: template.description,
              roundType: template.roundType,
              sequenceNumber: template.suggestedSequenceNumber,
            },
          }).unwrap(),
        ),
      );

      const success = results.filter((r) => r.status === "fulfilled");

      const failed = results.filter((r) => r.status === "rejected");

      const failedMessages = failed.map((r) => {
        const error = (r as PromiseRejectedResult).reason;

        return error?.data?.message ?? error?.error ?? "Unknown error";
      });

      if (failed.length === 0) {
        router.push(`/tournaments/${tournamentId}/start-match`);
        return;
      }

      if (success.length > 0) {
        setError(
          `${success.length} round(s) created successfully.\n${failedMessages.join("\n")}`,
        );
      } else {
        setError(failedMessages.join("\n"));
      }

      router.push(`/tournaments/${tournamentId}/start-match`);
    } catch (err) {
      console.error(err);
    }
  }
  console.log(selectedKeys);

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-(--color-bg-base)">
      {/* ── Page header ── */}
      <div className="border-b border-(--color-bg-border) bg-(--color-bg-card) px-4 pt-5 pb-4">
        <h1 className="font-display text-[22px] font-black uppercase tracking-wide text-(--color-navy)">
          Select Rounds
        </h1>
        <p className="mt-0.5 text-[13px] text-(--color-text-secondary)">
          Choose one or more round types for your tournament.
        </p>
      </div>

      {/* ── Scrollable accordion list ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-3 p-4 pb-6">
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <AccordionSkeleton key={i} />
            ))}

          {isError && (
            <div className="mt-10 flex flex-col items-center gap-2 px-6 text-center">
              <p className="font-display text-[16px] font-bold uppercase text-(--color-navy)">
                Failed to load rounds
              </p>
              <p className="text-meta">Check your connection and try again.</p>
            </div>
          )}

          {!isLoading &&
            !isError &&
            groups.map((group, i) => (
              <CategoryAccordion
                key={group.category}
                group={group}
                selectedKeys={selectedKeys}
                onToggleTemplate={toggleTemplate}
                defaultOpen={i === 0}
                tournamentId={tournamentId}
              />
            ))}
        </div>
      </div>

      {/* ── Selection summary strip ── */}
      {selectedCount > 0 && (
        <div className="border-t border-(--color-bg-border) bg-(--color-bg-tint) px-4 py-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-(--color-brand)">
              {selectedCount} selected:
            </span>
            {selectedLabels.slice(0, 3).map((label) => (
              <span
                key={label}
                className="flex items-center gap-1 rounded-full bg-(--color-brand)/10 px-2.5 py-1 text-[11px] font-semibold text-(--color-brand)"
              >
                {label}
                <button
                  onClick={() => {
                    const t = allTemplates.find((t) => t.label === label);
                    if (t) toggleTemplate(t.key);
                  }}
                >
                  <X size={9} strokeWidth={3} />
                </button>
              </span>
            ))}
            {selectedCount > 3 && (
              <span className="text-[11px] font-semibold text-(--color-text-muted)">
                +{selectedCount - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Sticky Add Rounds button ── */}
      <div className="safe-bottom shrink-0 border-t border-(--color-bg-border) bg-(--color-bg-card) p-4">
        <Button
          size="sm"
          onClick={handleDone}
          disabled={selectedCount === 0 || isCreatingRound}
          loading={isCreatingRound}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-2xl py-4",
            "font-display text-[15px] font-black uppercase tracking-[0.06em]",
            "transition-all active:scale-[0.98]",
            selectedCount > 0
              ? "bg-(--color-brand) text-white shadow-[0_4px_20px_rgba(27,63,160,0.35)]"
              : "cursor-not-allowed bg-(--color-bg-border) text-(--color-text-muted)",
          )}
        >
          {selectedCount > 0 ? (
            <>
              Add {selectedCount} Round{selectedCount !== 1 ? "s" : ""}
              <ChevronRight size={18} strokeWidth={2.5} />
            </>
          ) : (
            "Select at least one round"
          )}
        </Button>
      </div>
    </div>
  );
};

export default RoundPage;
