// src/components/common/LoginNotification.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

interface LoginNotificationProps {
  message?: string;
  duration?: number; // in milliseconds
  onClose?: () => void;
}

export function LoginNotification({
  message,
  duration = 5000, // 5 seconds default
  onClose,
}: LoginNotificationProps) {
  const router = useRouter();
  const t = useTranslations("common");
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isVisible, setIsVisible] = useState(true);

  const defaultMessage = t("loginNotification.defaultMessage");
  const finalMessage = message || defaultMessage;

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        setIsVisible(false);
        onClose?.();
      }
    }, 10); // Update every 10ms for smooth animation

    return () => clearInterval(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const handleLoginClick = () => {
    handleClose(); // Close the notification first
    router.push("/auth/login");
  };

  if (!isVisible) return null;

  const progress = (timeLeft / duration) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
        onClick={handleClose}
      />
      
      {/* Notification card */}
      <div
        className="relative w-full max-w-sm pointer-events-auto animate-fade-in"
        style={{
          animation: "fadeIn 0.3s ease-out",
        }}
      >
        <div
          className="relative overflow-hidden rounded-2xl shadow-2xl"
          style={{
            backgroundColor: "var(--color-bg)",
            border: "1px solid var(--color-border)",
          }}
        >
          {/* Progress bar */}
          <div
            className="absolute top-0 left-0 h-1 transition-all duration-100 ease-linear"
            style={{
              width: `${progress}%`,
              backgroundColor: "var(--color-primary)",
            }}
          />

          <div className="p-6">
            <div className="flex flex-col items-center text-center gap-4">
              {/* Icon */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(var(--color-primary-rgb), 0.1)" }}
              >
                <UserIcon
                  className="w-8 h-8"
                  style={{ color: "var(--color-primary)" }}
                />
              </div>

              {/* Content */}
              <div>
                <h4
                  className="text-lg font-semibold mb-2"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--color-text)",
                  }}
                >
                  {t("loginNotification.title")}
                </h4>
                <p
                  className="text-sm mb-4"
                  style={{
                    fontFamily: "var(--font-sans)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {finalMessage}
                </p>
              </div>
              
              {/* Actions */}
              <div className="w-full flex flex-col gap-2">
                <button
                  onClick={handleLoginClick}
                  className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.98] hover:opacity-90"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {t("loginNotification.loginNow")}
                </button>
                
                <button
                  onClick={handleClose}
                  className="w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all hover:opacity-70 active:scale-[0.98]"
                  style={{
                    backgroundColor: "transparent",
                    fontFamily: "var(--font-display)",
                    color: "var(--color-text-muted)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  {t("loginNotification.maybeLater")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}