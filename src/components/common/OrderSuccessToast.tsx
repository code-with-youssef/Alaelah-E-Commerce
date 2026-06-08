"use client";

import { useEffect, useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";

interface OrderSuccessToastProps {
  visible: boolean;
  orderCode?: string | null;
  /** Total visible duration in ms before it fades out (default 4000) */
  duration?: number;
}

export function OrderSuccessToast({
  visible,
  orderCode,
  duration = 4000,
}: OrderSuccessToastProps) {
  const [show, setShow] = useState(false);
  const [fading, setFading] = useState(false);
  const t = useTranslations("common");

  useEffect(() => {
    if (!visible) return;

    setShow(true);
    setFading(false);

    const fadeTimer = setTimeout(() => setFading(true), duration - 400);
    const hideTimer = setTimeout(() => setShow(false), duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [visible, duration]);

  if (!show) return null;

  return (
    <>
      <style>{`
        @keyframes successPopIn {
          0%   { opacity: 0; transform: scale(0.82) translateY(12px); }
          65%  { opacity: 1; transform: scale(1.03) translateY(0); }
          100% { opacity: 1; transform: scale(1)    translateY(0); }
        }
        @keyframes successCheckDraw {
          0%   { opacity: 0; transform: scale(0.5); }
          70%  { opacity: 1; transform: scale(1.15); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes successRipple {
          0%   { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes successCodeFadeIn {
          0%   { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .success-card {
          animation: successPopIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .success-check {
          animation: successCheckDraw 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both;
        }
        .success-ripple {
          animation: successRipple 0.9s ease-out 0.2s both;
        }
        .success-code {
          animation: successCodeFadeIn 0.35s ease-out 0.45s both;
        }
      `}</style>

      {/* Full-screen dimmed overlay */}
      <div
        className="fixed inset-0 z-[300] flex items-center justify-center"
        aria-live="assertive"
        role="status"
        style={{
          backgroundColor: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          transition: "opacity 0.4s ease",
          opacity: fading ? 0 : 1,
          pointerEvents: "none",
        }}
      >
        <div
          className="success-card flex flex-col items-center gap-4 px-10 py-8 rounded-3xl mx-6"
          style={{
            backgroundColor: "var(--color-bg)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.06)",
            maxWidth: 320,
            width: "100%",
          }}
        >
          {/* Icon with ripple */}
          <div className="relative flex items-center justify-center w-20 h-20">
            <div
              className="success-ripple absolute inset-0 rounded-full"
              style={{ backgroundColor: "rgba(22,163,74,0.2)" }}
            />
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(220,252,231,1)" }}
            >
              <CheckCircleIcon
                className="success-check w-10 h-10"
                style={{ color: "#16a34a" }}
              />
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col items-center gap-1.5 text-center">
            <p
              className="text-lg font-bold leading-tight"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-text)",
              }}
            >
              {t("orderSuccessToast.title")}
            </p>
            <p
              className="text-sm leading-snug"
              style={{
                fontFamily: "var(--font-sans)",
                color: "var(--color-text-muted)",
              }}
            >
              {t("orderSuccessToast.message")}
            </p>
          </div>

          {/* Order code — shown only when available */}
          {orderCode && (
            <div
              className="success-code w-full flex flex-col items-center gap-1 rounded-2xl px-4 py-3"
              style={{
                backgroundColor: "rgba(220,252,231,0.6)",
                border: "1px solid rgba(22,163,74,0.2)",
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest"
                style={{
                  color: "#16a34a",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {t("orderSuccessToast.orderCode")}
              </p>
              <p
                className="text-base font-bold tracking-wide"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--color-text)",
                  letterSpacing: "0.05em",
                }}
              >
                {orderCode}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}