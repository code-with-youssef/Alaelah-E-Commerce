"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

interface SettingsLayoutProps {
  title: string;
  children: React.ReactNode;
  rightAction?: React.ReactNode;
  closeIcon?: boolean;
  fullHeight?: boolean;
}

export function SettingsLayout({
  title,
  children,
  rightAction,
  closeIcon = false,
  fullHeight = false,
}: SettingsLayoutProps) {
  const t = useTranslations("settings");
  const router = useRouter();

  return (
    <div className="flex flex-col " style={{ backgroundColor: "var(--color-bg)" }}>

      {/* Header — full width */}
      <header className="flex items-center justify-between px-4 pt-4 pb-2 md:px-0">
        <button
          onClick={() => router.back()}
          aria-label={t("goBack")}
          className="w-9 h-9 flex items-center justify-center rounded-full active:scale-90 transition-transform"
          style={{ color: "var(--color-primary)" }}
        >
          {closeIcon ? (
            <XMarkIcon className="w-5 h-5" strokeWidth={2} />
          ) : (
            <ArrowLeftIcon className="w-5 h-5" strokeWidth={2} />
          )}
        </button>

        {title && (
          <h1
            className="text-lg font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
          >
            {title}
          </h1>
        )}

        <div className="w-9 flex items-center justify-end">
          {rightAction ?? null}
        </div>
      </header>

      {/*
        Content wrapper:
        - flex-1          → fills remaining space below header
        - flex flex-col justify-center → centers content vertically
        - w-full px-4     → full width with side padding
        - fullHeight removes justify-center for pages with fixed bottom button
      */}
      <div
        className={`flex-1 flex flex-col mb-110 w-full px-4 md:px-0 ${
          fullHeight ? "" : "justify-center"
        }`}
      >
        {children}
      </div>
    </div>
  );
}