"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, RotateCcw, ShieldCheck, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/cn";
import { OtpInput } from "./Otpinput";

import {
  useLazyGetMeQuery,
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/store/api/authApi";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/auth/authSlice";
import { selectIsAuthenticated } from "@/store/auth/authSelectors";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = "phone" | "otp";

// ─── Countdown hook ───────────────────────────────────────────────────────────

function useCountdown(from: number, active: boolean, resetKey: number) {
  const [seconds, setSeconds] = useState(from);

  useEffect(() => {
    if (!active) {
      setSeconds(from);
      return;
    }
    setSeconds(from);
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [active, from, resetKey]);

  return seconds;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LoginForm() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("phone");
  const [otp, setOtp] = useState("");
  const [shaking, setShaking] = useState(false);
  const [mobile, setMobile] = useState("");
  const [mobileInteracted, setMobileInteracted] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(30);
  const [validForSeconds, setValidForSeconds] = useState(300);
  const [countdownResetKey, setCountdownResetKey] = useState(0);
  const verifyInFlight = useRef(false);

  const countdown = useCountdown(cooldownSeconds, step === "otp", countdownResetKey);
  const phoneValid = /^\d{10}$/.test(mobile);
  const showMobileError = mobileInteracted && !phoneValid;
  const otpDigits = otp.replace(/\D/g, "");
  const otpComplete = /^\d{6}$/.test(otpDigits);

  const [sendOtp, sendOtpState] = useSendOtpMutation();
  const [verifyOtp, verifyOtpState] = useVerifyOtpMutation();
  const [getMe] = useLazyGetMeQuery();

  const dispatch = useAppDispatch();

  const loading = sendOtpState.isLoading || verifyOtpState.isLoading;

  const errorMessage =
    (sendOtpState.error as any)?.data?.message ||
    (verifyOtpState.error as any)?.data?.message ||
    null;

  // Auto-submit when all 6 digits are entered
  useEffect(() => {
    if (otpComplete) void handleVerifyOtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  function shake() {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }

  // ── Step 1: Send OTP ────────────────────────────────────────────────────────

  async function handleSendOtp() {
    setMobileInteracted(true);
    if (!phoneValid) return;

    try {
      const policy = await sendOtp(mobile).unwrap();
      setCooldownSeconds(policy.cooldownSeconds);
      setValidForSeconds(policy.validForSeconds);
      setCountdownResetKey((key) => key + 1);

      setStep("otp");
    } catch {
      shake();
    }
  }

  // ── Step 2: Verify OTP ──────────────────────────────────────────────────────

  async function handleVerifyOtp() {
    if (!otpComplete || verifyInFlight.current) return;
    verifyInFlight.current = true;

    try {
      const response = await verifyOtp({
        mobile,
        otp: otpDigits,
      }).unwrap();

      dispatch(setCredentials(response));

      if (response.user.isProfileCompleted) {
        // router.push("/home");
        router.push("/mode");
      } else {
        router.push("/on-boarding");
      }
    } catch {
      verifyInFlight.current = false;
      setOtp("");
      shake();
    }
  }

  // ── Resend OTP ──────────────────────────────────────────────────────────────

  async function handleResend() {
    if (countdown > 0 || loading) return;
    setOtp("");
    // setLoading(true);
    try {
      const policy = await sendOtp(mobile).unwrap();
      setCooldownSeconds(policy.cooldownSeconds);
      setValidForSeconds(policy.validForSeconds);
      setCountdownResetKey((key) => key + 1);
    } finally {
      //   setLoading(false);
    }
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Phone step ───────────────────────────────────────────────────── */}
      {step === "phone" && (
        <div
          className={cn(
            "flex flex-1 flex-col",
            shaking && "animate-[shake_0.4s_ease-in-out]",
          )}
        >
          <h2
            className="font-(family-name:--font-display) text-2xl font-black uppercase text-(--color-text-primary)"
            style={{ letterSpacing: "0.02em" }}
          >
            Sign In
          </h2>
          <p className="mt-1 text-sm text-(--color-text-secondary)">
            Enter your mobile number to continue
          </p>

          <div className="mt-7 flex flex-1 flex-col gap-5">
            {/* Phone input */}
            <div>
              <label
                htmlFor="mobile-number"
                className="text-section-label mb-2 block"
              >
                Mobile Number
              </label>
              <div
                className={cn(
                  "flex items-center overflow-hidden rounded-2xl border-2 transition-all duration-150",
                  mobile
                    ? "border-(--color-sky)"
                    : "border-(--color-bg-border)",
                  "focus-within:border-(--color-sky) focus-within:shadow-[0_0_0_3px_rgba(75,139,255,0.12)]",
                )}
              >
                {/* Country prefix */}
                <div className="flex h-14 shrink-0 items-center gap-1.5 border-r-2 border-(--color-bg-border) bg-(--color-bg-base) px-3.5">
                  <span className="text-base leading-none">🇮🇳</span>
                  <span className="font-(family-name:--font-display) text-base font-bold text-(--color-text-primary)">
                    +91
                  </span>
                </div>

                {/* Number field */}
                <input
                  id="mobile-number"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  placeholder="99999 99999"
                  value={mobile}
                  aria-invalid={showMobileError}
                  aria-describedby={showMobileError ? "mobile-number-error" : undefined}
                  onChange={(e) => {
                    // dispatch(clearError());
                    sendOtpState.reset();
                    verifyOtpState.reset();
                    setMobileInteracted(true);
                    setMobile(e.target.value);
                  }}
                  onBlur={() => setMobileInteracted(true)}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    e.preventDefault();
                    void handleSendOtp();
                  }}
                  className={cn(
                    "h-14 flex-1 bg-transparent px-4 outline-none",
                    "font-(family-name:--font-display) text-xl font-bold tracking-[0.08em] text-(--color-text-primary)",
                    "placeholder:font-medium placeholder:tracking-normal placeholder:text-(--color-text-muted) placeholder:text-base",
                  )}
                />

                {/* Valid tick */}
                {phoneValid && (
                  <ShieldCheck
                    size={18}
                    className="mr-3.5 shrink-0 text-(--color-four)"
                  />
                )}
              </div>
              {showMobileError && (
                <p
                  id="mobile-number-error"
                  role="alert"
                  className="mt-2 text-sm font-medium text-(--color-live)"
                >
                  Enter exactly 10 numeric digits.
                </p>
              )}
            </div>

            {/* Error */}
            {errorMessage && (
              <p className="text-sm font-medium text-(--color-live)">
                {errorMessage}
              </p>
            )}

            <div className="flex-1" />

            {/* CTA */}
            <button
              onClick={handleSendOtp}
              disabled={!phoneValid || loading}
              className={cn(
                "flex h-14 w-full items-center justify-center gap-2 rounded-2xl",
                "font-(family-name:--font-display) text-lg font-black uppercase tracking-[0.06em] text-white",
                "transition-all duration-200 active:scale-[0.97]",
                phoneValid && !loading
                  ? "bg-(--color-brand) shadow-(--shadow-button)"
                  : "bg-(--color-bg-border) text-(--color-text-muted)",
              )}
            >
              {loading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  Get OTP
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <p className="text-center text-xs text-(--color-text-muted)">
              By continuing, you agree to our{" "}
              <span className="font-semibold text-(--color-brand)">
                <Link href={"/terms-of-service"}>Terms of service</Link>
              </span>{" "}
              and{" "}
              <span className="font-semibold text-(--color-brand)">
                <Link href={"/privacy-policy"}>Privacy Policy</Link>
              </span>
            </p>
          </div>
        </div>
      )}

      {/* ── OTP step ─────────────────────────────────────────────────────── */}
      {step === "otp" && (
        <div
          className={cn(
            "flex flex-1 flex-col",
            shaking && "animate-[shake_0.4s_ease-in-out]",
          )}
        >
          {/* Back */}
          <button
            onClick={() => {
              setStep("phone");
              setOtp("");
              // dispatch(clearError());
              sendOtpState.reset();
              verifyOtpState.reset();
            }}
            className="-ml-1 mb-4 flex items-center gap-1 text-sm font-semibold text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary)"
          >
            <ChevronLeft size={16} />
            Change number
          </button>

          <h2
            className="font-(family-name:--font-display) text-2xl font-black uppercase text-(--color-text-primary)"
            style={{ letterSpacing: "0.02em" }}
          >
            Verify OTP
          </h2>
          <p className="mt-1 text-sm text-(--color-text-secondary)">
            Sent to{" "}
            <span className="font-bold text-(--color-text-primary)">
              +91 {mobile}
            </span>
          </p>

          <div className="mt-7 flex flex-1 flex-col gap-5">
            {/* OTP boxes */}
            <div>
              <label className="text-section-label mb-3 block">
                Enter 6-digit OTP
              </label>
              {/* Light card background so white boxes are visible */}
              <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-base) p-4">
                <OtpInput value={otp} onChange={setOtp} disabled={loading} />
              </div>
            </div>

            {/* Error */}
            {errorMessage && (
              <p className="text-sm font-medium text-(--color-live)">
                {errorMessage}
              </p>
            )}

            {/* Resend row */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-(--color-text-muted)">
                {countdown > 0
                  ? `Resend in ${countdown}s`
                  : "Didn't receive OTP?"}
              </p>
              <button
                onClick={handleResend}
                disabled={countdown > 0 || loading}
                className={cn(
                  "flex items-center gap-1.5 text-sm font-bold transition-colors",
                  countdown === 0
                    ? "text-(--color-brand)"
                    : "text-(--color-text-muted)",
                )}
              >
                <RotateCcw size={13} />
                Resend OTP
              </button>
            </div>

            <div className="flex-1" />

            {/* CTA */}
            <button
              onClick={handleVerifyOtp}
              disabled={!otpComplete || loading}
              className={cn(
                "flex h-14 w-full items-center justify-center gap-2 rounded-2xl",
                "font-(family-name:--font-display) text-lg font-black uppercase tracking-[0.06em] text-white",
                "transition-all duration-200 active:scale-[0.97]",
                otpComplete && !loading
                  ? "bg-(--color-brand) shadow-(--shadow-button)"
                  : "bg-(--color-bg-border) text-(--color-text-muted)",
              )}
            >
              {loading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  Verify & Sign In
                  <ShieldCheck size={18} />
                </>
              )}
            </button>

            <p className="text-center text-xs text-(--color-text-muted)">
              OTP is valid for{" "}
              <span className="font-semibold text-(--color-text-secondary)">
                {Math.round(validForSeconds / 60)} minutes
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Shake keyframes — scoped to this component */}
      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0);   }
          15%      { transform: translateX(-6px); }
          30%      { transform: translateX(6px);  }
          45%      { transform: translateX(-4px); }
          60%      { transform: translateX(4px);  }
          75%      { transform: translateX(-2px); }
          90%      { transform: translateX(2px);  }
        }
      `}</style>
    </>
  );
}
