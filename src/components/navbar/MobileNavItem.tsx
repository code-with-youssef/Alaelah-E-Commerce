"use client";

import Link from "next/link";
import { NavBadge } from "./NavBadge";
import { NavItem } from "@/src/config/nav-config";
import { useTranslations } from "next-intl";

interface MobileNavItemProps {
  item: NavItem;
  isActive: boolean;
  badge?: number;
}

export function MobileNavItem({ item, isActive, badge }: MobileNavItemProps) {
  const Icon = isActive ? item.iconActive : item.icon;
  const t = useTranslations("home");

  // Get translated label using the labelKey from the config
  const label = t(item.labelKey);

  return (
    <Link
      href={item.href}
      className="flex flex-col items-center gap-1 flex-1 py-1 px-2 transition-all duration-150 group"
      aria-current={isActive ? "page" : undefined}
      aria-label={label}
    >
      {/* Icon container */}
      <span className="relative">
        <span
          className="relative flex items-center justify-center w-10 h-8 rounded-full transition-all duration-150"
          style={
            isActive
              ? { backgroundColor: "var(--color-primary-light)" }
              : { backgroundColor: "transparent" }
          }
        >
          <Icon
            className="w-5 h-5 transition-transform duration-150 group-active:scale-90"
            style={
              isActive
                ? { color: "var(--color-primary)" }
                : { color: "var(--color-text-muted)" }
            }
            aria-hidden="true"
          />
        </span>
        {badge !== undefined ? <NavBadge count={badge} /> : null}
      </span>

      {/* Label */}
      <span
        className="text-[10px] font-semibold leading-none transition-colors duration-150"
        style={{
          fontFamily: "var(--font-sans)",
          color: isActive ? "var(--color-primary)" : "var(--color-text-muted)",
        }}
      >
        {label}
      </span>
    </Link>
  );
}
