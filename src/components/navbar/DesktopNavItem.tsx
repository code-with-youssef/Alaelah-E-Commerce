"use client";

import Link from "next/link";
import { NavItem } from "@/src/config/nav-config";
import { useTranslations } from "next-intl";

interface DesktopNavItemProps {
  item: NavItem;
  isActive: boolean;
  badge?: number;
}

export function DesktopNavItem({ item, isActive, badge }: DesktopNavItemProps) {
  const t = useTranslations("home");
  const label = t(item.labelKey);
  const icon = isActive ? item.iconActive : item.icon;

  console.log(item);
  return (
    <Link
      href={item.href}
      className="relative flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm
                 transition-all duration-150 group"
      style={{
        fontFamily: "var(--font-sans)",
        backgroundColor: isActive ? "var(--color-primary-light)" : "transparent",
        color: isActive ? "var(--color-primary)" : "var(--color-text-muted)",
      }}
      aria-current={isActive ? "page" : undefined}
      aria-label={label}
    >
      {/* Icon + badge */}
      <span className="relative inline-flex items-center justify-center">
        {typeof icon === "string" ? (
          <img
            src={icon}
            alt=""
            aria-hidden="true"
            className="w-[18px] h-[18px] transition-transform duration-150 group-hover:scale-110"
          />
        ) : (
          (() => { const Icon = icon; return (
            <Icon
              className="w-[18px] h-[18px] transition-transform duration-150 group-hover:scale-110"
              aria-hidden="true"
            />
          );})()
        )}
        {badge ? (
          <span
            className="absolute -top-2.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full
                       flex items-center justify-center
                       text-[9px] font-bold text-white leading-none pointer-events-none"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {badge > 99 ? "99+" : badge}
          </span>
        ) : null}
      </span>

      <span
        className="transition-colors duration-150"
        style={isActive ? { color: "var(--color-primary)" } : { color: "var(--color-text-muted)" }}
      >
        {label}
      </span>

      {/* Hover background */}
      {!isActive && (
        <span
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150 -z-10"
          style={{ backgroundColor: "var(--color-primary-light)" }}
        />
      )}
    </Link>
  );
}