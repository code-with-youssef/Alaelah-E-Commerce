"use client";

import { useEffect, useRef } from "react";
import {
  LanguageIcon,
  GlobeAltIcon,
  ChevronRightIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/src/contexts/AuthContext";
import LangSwitcher from "../common/LangSwitcher";
import { useTranslations } from "next-intl";

interface DesktopMoreDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DesktopMoreDropdown({
  isOpen,
  onClose,
}: DesktopMoreDropdownProps) {
  const { user } = useAuth();
  const t = useTranslations("home");
  const isLoggedIn = !!user;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="absolute top-full right-0 mt-2 w-80 rounded-2xl shadow-xl z-[200] overflow-hidden animate-fade-in"
      style={{
        backgroundColor: "var(--color-bg)",
        border: "1px solid var(--color-border)",
        boxShadow:
          "0 20px 35px -8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.05)",
      }}
      role="menu"
    >
      {/* Language Section */}
      <div
        className="p-4"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <LanguageIcon
            className="w-4 h-4"
            style={{ color: "var(--color-text-muted)" }}
          />
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-text-muted)" }}
          >
            {t("language.title")}
          </span>
        </div>
        <LangSwitcher onSelect={onClose} />
      </div>

      {/* Theme Section */}
      <div
        className="p-4"
        style={{
          borderBottom: !isLoggedIn ? "1px solid var(--color-border)" : "none",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <SunIcon
            className="w-4 h-4"
            style={{ color: "var(--color-text-muted)" }}
          />
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-text-muted)" }}
          >
            {t("appearance.title")}
          </span>
        </div>
        <ThemeToggle />
      </div>

      {/* Login Section - Only for logged out users */}
      {!isLoggedIn && (
        <div
          className="p-4"
          style={{ backgroundColor: "var(--color-bg-subtle)" }}
        >
          <a
            href="/auth/login"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "#fff",
              textDecoration: "none",
              fontFamily: "var(--font-sans)",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <span>{t("auth.signIn")}</span>
            <ChevronRightIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
          <p
            className="text-xs text-center mt-3"
            style={{ color: "var(--color-text-muted)" }}
          >
            {t("auth.newUser")}{" "}
            <a
              href="/auth/register"
              onClick={onClose}
              style={{ color: "var(--color-primary)" }}
              className="hover:underline font-medium"
            >
              {t("auth.createAccount")}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
