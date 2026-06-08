"use client";

import { useState } from "react";
import { MobileNavItem } from "./MobileNavItem";
import { SearchModal } from "../search/SearchModal";
import { MobileMoreModal } from "./MobileMoreModal";
import { NavItemId } from "@/src/config/nav-config";
import { useTranslations } from "next-intl";
import { useNavItems } from "@/src/hooks/home/useNavItems";
import { useCart } from "@/src/hooks/cart/useCart";

interface MobileNavbarProps {
  activeItem: NavItemId;
}

export function MobileNavbar({ activeItem }: MobileNavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const t = useTranslations("home");
  const { cartCount } = useCart();

  const navItems = useNavItems(); // ✅ أضف السطر ده

  return (
    <>
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-stretch"
        style={{
          backgroundColor: "var(--color-bg)",
          borderTop: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-bottom-nav)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
        aria-label={t("mobileNav.ariaLabel")}
      >
        {navItems.map((item) => {
          if (item.id === "search") {
            return (
              <button
                key={item.id}
                onClick={() => setSearchOpen(true)}
                className="flex flex-col items-center gap-1 flex-1 py-1 px-2 border-0 bg-transparent cursor-pointer"
                aria-label={t("mobileNav.searchAriaLabel")}
              >
                <span
                  className="flex items-center justify-center w-10 h-8 rounded-full"
                  style={{
                    backgroundColor:
                      activeItem === "search"
                        ? "var(--color-primary-light)"
                        : "transparent",
                  }}
                >
                  <item.icon
                    className="w-5 h-5"
                    style={{
                      color:
                        activeItem === "search"
                          ? "var(--color-primary)"
                          : "var(--color-text-muted)",
                    }}
                  />
                </span>
                <span
                  className="text-[10px] font-semibold leading-none"
                  style={{
                    fontFamily: "var(--font-sans)",
                    color:
                      activeItem === "search"
                        ? "var(--color-primary)"
                        : "var(--color-text-muted)",
                  }}
                >
                  {t("mobileNav.search")}
                </span>
              </button>
            );
          }

          if (item.id === "more") {
            return (
              <button
                key={item.id}
                onClick={() => setMoreOpen(true)}
                className="flex flex-col items-center gap-1 flex-1 py-1 px-2 border-0 bg-transparent cursor-pointer"
                aria-label={t("mobileNav.moreAriaLabel")}
              >
                <span
                  className="flex items-center justify-center w-10 h-8 rounded-full"
                  style={{
                    backgroundColor:
                      moreOpen || activeItem === "more"
                        ? "var(--color-primary-light)"
                        : "transparent",
                  }}
                >
                  <item.iconActive
                    className="w-5 h-5"
                    style={{
                      color:
                        moreOpen || activeItem === "more"
                          ? "var(--color-primary)"
                          : "var(--color-text-muted)",
                    }}
                  />
                </span>
                <span
                  className="text-[10px] font-semibold leading-none"
                  style={{
                    fontFamily: "var(--font-sans)",
                    color:
                      moreOpen || activeItem === "more"
                        ? "var(--color-primary)"
                        : "var(--color-text-muted)",
                  }}
                >
                  {t("mobileNav.more")}
                </span>
              </button>
            );
          }

          return (
            <MobileNavItem
              key={item.id}
              item={item}
              isActive={activeItem === item.id}
              badge={item.id === "cart" ? cartCount : undefined}
            />
          );
        })}
      </nav>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMoreModal isOpen={moreOpen} onClose={() => setMoreOpen(false)} />
    </>
  );
}
