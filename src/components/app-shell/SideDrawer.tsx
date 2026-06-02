"use client";

import { cn } from "@/lib/cn";
import { useLogoutMutation } from "@/store/api/authApi";
import { logout } from "@/store/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import LogoMark from "./LogoMark";
import { ChevronRight, X } from "lucide-react";
import { drawerSections } from "./constant";
import Link from "next/link";
import { selectUser } from "@/store/auth/authSelectors";
import Image from "next/image";

export default function SideDrawer({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const prevPath = useRef(pathname);
  const [logoutApi] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const user = useAppSelector(selectUser);

  async function handleLogout() {
    try {
      await logoutApi().unwrap();
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(logout());

      router.replace("/login");
    }
  }

  // Close on route change
  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 z-40 transition-opacity duration-300",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        style={{
          background: "rgba(13,27,62,0.55)",
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Drawer panel — shadow only when open, clipped when closed */}
      <div
        className={cn(
          "absolute inset-y-0 left-0 z-50 flex w-[82%] max-w-[300px] flex-col",
          "bg-(--color-navy)",
          "transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          open
            ? "translate-x-0 shadow-[8px_0_48px_rgba(13,27,62,0.55)]"
            : "-translate-x-full shadow-none",
        )}
      >
        {/* Drawer header */}
        <div className="safe-top flex items-center justify-between border-b border-white/10 px-5 pt-2">
          <div className="flex items-center gap-2.5 h-16">
            <LogoMark />
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white/70 transition-all active:scale-90 hover:bg-white/15"
          >
            <X size={16} />
          </button>
        </div>

        {/* User card */}
        <div className="px-4 pt-4">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--color-sky) font-(family-name:--font-display) text-sm font-black text-white shadow-[0_2px_8px_rgba(75,139,255,0.35)]">
              {user?.avatarUrl ? (
                <Image
                  src={user?.avatarUrl}
                  alt={user.fullName ?? "User avatar"}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              ) : (
                (user?.fullName?.charAt(0)?.toUpperCase() ?? "Y")
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {user?.fullName || "User Name"}
              </p>

              <p className="text-[11px] font-medium text-white/50">
                {user?.mobile}
              </p>
            </div>
            <span className="ml-auto flex items-center gap-1 rounded-full bg-(--color-violet)/20 px-2.5 py-1 font-(family-name:--font-display) text-[10px] font-bold uppercase tracking-widest text-(--color-violet)">
              Upgrade
            </span>
          </div>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {drawerSections.map((section) => (
            <div key={section.title} className="mb-4">
              <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white/35">
                {section.title}
              </p>
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = pathname.startsWith(item.href);

                if (item.action === "logout") {
                  return (
                    <button
                      key={item.label}
                      onClick={handleLogout}
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150 active:scale-[0.98]",
                        "text-(--color-live) hover:bg-white/6",
                      )}
                    >
                      <Icon
                        size={17}
                        className="shrink-0 text-(--color-live)"
                      />

                      <span className="flex-1 text-sm font-semibold">
                        {item.label}
                      </span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 active:scale-[0.98]",
                      active
                        ? "bg-(--color-brand) text-white shadow-[0_4px_16px_rgba(27,63,160,0.45)]"
                        : item.danger
                          ? "text-(--color-live) hover:bg-white/6"
                          : "text-white/75 hover:bg-white/8 hover:text-white",
                    )}
                  >
                    <Icon
                      size={17}
                      className={cn(
                        "shrink-0",
                        active
                          ? "text-white"
                          : item.danger
                            ? "text-(--color-live)"
                            : "text-white/50",
                      )}
                    />
                    <span className="flex-1 text-sm font-semibold">
                      {item.label}
                    </span>

                    {item.badge && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 font-(family-name:--font-display) text-[10px] font-bold uppercase tracking-widest",
                          item.badgeColor === "live" &&
                            "bg-(--color-live)/15 text-(--color-live)",
                          item.badgeColor === "violet" &&
                            "bg-(--color-violet)/20 text-(--color-violet)",
                          !item.badgeColor &&
                            "min-w-[18px] bg-(--color-brand) text-center text-white",
                        )}
                      >
                        {item.badgeColor === "live" && (
                          <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-(--color-live)" />
                        )}
                        {item.badge}
                      </span>
                    )}

                    {!item.badge && !item.danger && (
                      <ChevronRight
                        size={14}
                        className={cn(
                          "opacity-0 transition-opacity group-hover:opacity-30",
                          active && "opacity-30",
                        )}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Drawer footer */}
        <div className="safe-bottom border-t border-white/10 px-5 py-4">
          <p className="text-center font-(family-name:--font-display) text-xs font-bold uppercase tracking-widest text-white/25">
            YuvaCrix v0.1.0
          </p>
        </div>
      </div>
    </>
  );
}
