"use client";

import { useEffect } from "react";
import {
  ClockIcon,
  HeartIcon,
  Cog6ToothIcon,
  LanguageIcon,
  ArrowRightStartOnRectangleIcon,
  QrCodeIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import ThemeToggle from "./ThemeToggle";
import LangSwitcher from "../common/LangSwitcher";
import { useAuth } from "@/src/contexts/AuthContext";
import { useTranslations } from "next-intl";

interface MobileMoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  icon: React.ElementType;
  label: string;
  href: string;
  meta?: string;
}


export function MobileMoreModal({ isOpen, onClose }: MobileMoreModalProps) {
  const { user, loading, logout } = useAuth();
  const t = useTranslations("home");
  const isLoggedIn = !!user;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!isOpen) return null;

  // Map auth items with translated labels
  const translatedAuthItems: MenuItem[] = [
    { icon: ClockIcon, label: t("auth.myOrders"), href: "/orders" },
    { icon: HeartIcon, label: t("auth.favourites"), href: "/favourites" },
    {
      icon: Cog6ToothIcon,
      label: t("auth.accountSettings"),
      href: "/settings",
    },
  ];

  const menuItems: MenuItem[] = isLoggedIn ? [...translatedAuthItems] : [];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[101] rounded-t-3xl overflow-hidden animate-fade-in"
        style={{ backgroundColor: "var(--color-bg)", maxHeight: "92dvh" }}
        role="dialog"
        aria-modal="true"
        aria-label={t("mobileModal.ariaLabel")}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div
            className="w-10 h-1 rounded-full"
            style={{ backgroundColor: "var(--color-border)" }}
          />
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          {loading ? (
            <div
              className="h-5 w-32 rounded animate-pulse"
              style={{ backgroundColor: "var(--color-border)" }}
            />
          ) : (
            <h2
              className="text-xl font-bold"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-text)",
              }}
            >
              {isLoggedIn ? user.name : t("mobileModal.menu")}
            </h2>
          )}
        </div>

        {/* Scrollable content */}
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(92dvh - 120px)" }}
        >
          {/* Language Section */}
          <div
            className="px-5 py-4"
            style={{ borderBottom: "1px solid var(--color-border)" }}
          >
            <p
              className="text-[11px] font-semibold uppercase tracking-wide mb-3"
              style={{
                color: "var(--color-text-muted)",
                fontFamily: "var(--font-sans)",
              }}
            >
              {t("language.title")}
            </p>
            <LangSwitcher onSelect={onClose} />
          </div>

          {/* Theme Section */}
          <div
            className="px-5 py-4"
            style={{ borderBottom: "1px solid var(--color-border)" }}
          >
            <p
              className="text-[11px] font-semibold uppercase tracking-wide mb-3"
              style={{
                color: "var(--color-text-muted)",
                fontFamily: "var(--font-sans)",
              }}
            >
              {t("appearance.title")}
            </p>
            <ThemeToggle />
          </div>

          {/* Menu items - only for logged in users */}
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-4 px-5 py-[14px] transition-colors"
                style={{
                  borderBottom: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                  textDecoration: "none",
                }}
              >
                <Icon
                  className="w-5 h-5 shrink-0"
                  style={{ color: "var(--color-text-muted)" }}
                />
                <span
                  className="flex-1 text-[0.9375rem] font-medium"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {item.label}
                </span>
                <ChevronRightIcon
                  className="w-4 h-4 shrink-0"
                  style={{ color: "var(--color-text-placeholder)" }}
                />
              </a>
            );
          })}

          {/* Logged-in: Logout */}
          {isLoggedIn && (
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full flex items-center gap-4 px-5 py-[14px] transition-colors"
              style={{
                borderBottom: "1px solid var(--color-border)",
                color: "var(--color-error)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              <ArrowRightStartOnRectangleIcon
                className="w-5 h-5 shrink-0"
                style={{ color: "var(--color-error)" }}
              />
              <span className="flex-1 text-[0.9375rem] font-medium text-left">
                {t("auth.logout")}
              </span>
            </button>
          )}

          {/* Logged-out: Login CTA */}
          {!isLoggedIn && !loading && (
            <div className="px-5 py-4">
              <a
                href="/auth/login"
                onClick={onClose}
                className="flex items-center justify-center w-full py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "#fff",
                  textDecoration: "none",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {t("auth.login")}
              </a>
            </div>
          )}

          <div className="h-8" />
        </div>
      </div>
    </>
  );
}
