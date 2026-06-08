"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("home");

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);

    setIsDarkMode(shouldBeDark);

    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const setLightMode = () => {
    setIsDarkMode(false);
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  };

  const setDarkMode = () => {
    setIsDarkMode(true);
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  };

  // Return placeholder with same dimensions to prevent layout shift
  if (!mounted) {
    return (
      <div
        className="flex rounded-xl p-1 gap-1 w-32 h-9"
        style={{ backgroundColor: "var(--color-bg-muted)" }}
      />
    );
  }

  return (
    <div
      className="flex rounded-xl p-1 gap-1"
      style={{ backgroundColor: "var(--color-bg-muted)" }}
    >
      {/* Light */}
      <button
        onClick={setLightMode}
        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200"
        style={{
          fontFamily: "var(--font-sans)",
          backgroundColor: !isDarkMode ? "var(--color-bg)" : "transparent",
          color: !isDarkMode
            ? "var(--color-primary)"
            : "var(--color-text-muted)",
          boxShadow: !isDarkMode ? "0 1px 4px rgba(0,0,0,0.10)" : "none",
        }}
        aria-label={t("theme.lightAriaLabel")}
      >
        <SunIcon
          className="w-3.5 h-3.5 transition-all duration-200"
          style={{
            transform: !isDarkMode
              ? "rotate(0deg) scale(1.15)"
              : "rotate(-30deg) scale(0.9)",
            opacity: !isDarkMode ? 1 : 0.7,
          }}
        />
        <span>{t("theme.light")}</span>
      </button>

      {/* Dark */}
      <button
        onClick={setDarkMode}
        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200"
        style={{
          fontFamily: "var(--font-sans)",
          backgroundColor: isDarkMode ? "var(--color-bg)" : "transparent",
          color: isDarkMode
            ? "var(--color-primary)"
            : "var(--color-text-muted)",
          boxShadow: isDarkMode ? "0 1px 4px rgba(0,0,0,0.10)" : "none",
        }}
        aria-label={t("theme.darkAriaLabel")}
      >
        <MoonIcon
          className="w-3.5 h-3.5 transition-all duration-200"
          style={{
            transform: isDarkMode
              ? "rotate(0deg) scale(1.15)"
              : "rotate(30deg) scale(0.9)",
            opacity: isDarkMode ? 1 : 0.7,
          }}
        />
        <span>{t("theme.dark")}</span>
      </button>
    </div>
  );
}
