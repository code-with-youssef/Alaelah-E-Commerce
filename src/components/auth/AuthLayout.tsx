"use client";

import { ChevronLeftIcon } from "@heroicons/react/24/outline";

interface AuthLayoutProps {
  children: React.ReactNode;
  onBack?: () => void;
  showBack?: boolean;
}

export function AuthLayout({ children, onBack, showBack = true }: AuthLayoutProps) {
  return (
    <div
      className="min-h-dvh flex flex-col md:items-center md:justify-center md:py-16"
      style={{ backgroundColor: "var(--color-bg-subtle)" }}
    >
      {/*
        Mobile  → full width, full height, no card chrome
        Desktop → 600px wide card, height is auto (content-driven, no stretching)
      */}
      <div
        className="
          w-full flex flex-col
          min-h-dvh md:min-h-0
          md:max-w-[600px] md:rounded-3xl md:shadow-xl md:overflow-hidden
        "
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        {/* Back row */}
        <div className="px-6 pt-6 pb-0 shrink-0">
          {showBack ? (
            <button
              onClick={onBack}
              className="w-9 h-9 flex items-center justify-center rounded-full -ml-1"
              style={{ color: "var(--color-primary)" }}
              aria-label="Go back"
            >
              <ChevronLeftIcon className="w-5 h-5" strokeWidth={2.5} />
            </button>
          ) : (
            <div className="h-9" />
          )}
        </div>

        {/*
          On mobile: flex-1 so the inner content can push the button to the
          very bottom with mt-auto.
          On desktop: flex-none so the card wraps its content naturally.
        */}
        <div className="flex flex-col flex-1 md:flex-none px-6 pt-5 pb-8 md:pb-10">
          {children}
        </div>
      </div>
    </div>
  );
}