"use client";

import { useEffect, useRef } from "react";
import {
  ClockIcon,
  HeartIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/src/contexts/AuthContext";
import { useTranslations } from "next-intl";

interface DesktopUserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DesktopUserDropdown({
  isOpen,
  onClose,
}: DesktopUserDropdownProps) {
  const { user, loading, logout } = useAuth();
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

  const userItems = [
    { icon: ClockIcon, label: t("auth.myOrders"), href: "/orders" },
    { icon: HeartIcon, label: t("auth.favourites"), href: "/favourites" },
    {
      icon: Cog6ToothIcon,
      label: t("auth.accountSettings"),
      href: "/settings",
    },
  ];

  return (
    <div
      ref={ref}
      className="absolute top-full end-0 mt-2 w-60 rounded-2xl shadow-xl z-[200] overflow-hidden animate-fade-in"
      style={{
        backgroundColor: "var(--color-bg)",
        border: "1px solid var(--color-border)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      }}
      role="menu"
    >
      {loading ? (
        <div className="px-4 py-4 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full animate-pulse shrink-0"
            style={{ backgroundColor: "var(--color-border)" }}
          />
          <div className="flex-1 space-y-2">
            <div
              className="h-3 rounded animate-pulse w-24"
              style={{ backgroundColor: "var(--color-border)" }}
            />
            <div
              className="h-2 rounded animate-pulse w-16"
              style={{ backgroundColor: "var(--color-border)" }}
            />
          </div>
        </div>
      ) : isLoggedIn ? (
        <>
          {/* Profile header */}
          <div
            className="flex items-center gap-3 px-4 py-4"
            style={{ borderBottom: "1px solid var(--color-border)" }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p
                className="text-sm font-bold leading-tight"
                style={{
                  color: "var(--color-text)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {user.name}
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                {t("userDropdown.viewProfile")}
              </p>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1">
            {userItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg mx-1 text-sm font-medium transition-colors"
                  style={{
                    color: "var(--color-text)",
                    fontFamily: "var(--font-sans)",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor =
                      "var(--color-bg-subtle)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor =
                      "transparent")
                  }
                >
                  <Icon
                    className="w-4 h-4 shrink-0"
                    style={{ color: "var(--color-text-muted)" }}
                  />
                  <span className="flex-1">{item.label}</span>
                </a>
              );
            })}
          </div>

          {/* Logout */}
          <div
            className="py-1"
            style={{ borderTop: "1px solid var(--color-border)" }}
          >
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                color: "var(--color-error)",
                fontFamily: "var(--font-sans)",
                background: "none",
                border: "none",
                cursor: "pointer",
                width: "calc(100% - 8px)",
                marginLeft: "4px",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor =
                  "#FEF2F2")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor =
                  "transparent")
              }
            >
              <ArrowRightStartOnRectangleIcon
                className="w-4 h-4 shrink-0"
                style={{ color: "var(--color-error)" }}
              />
              {t("auth.logout")}
            </button>
          </div>
        </>
      ) : (
        <div className="p-3">
          <a
            href="/auth/login"
            onClick={onClose}
            className="flex items-center justify-center w-full py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
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
    </div>
  );
}
