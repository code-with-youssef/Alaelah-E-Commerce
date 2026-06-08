"use client";

import { useState } from "react";
import { Logo } from "./Logo";
import { DesktopNavItem } from "./DesktopNavItem";
import { SearchModal } from "../search/SearchModal";
import { DesktopMoreDropdown } from "./DesktopMoreDropdown";
import { DesktopUserDropdown } from "./DesktopUserDropdown";
import {  NavItemId } from "@/src/config/nav-config";
import { useAuth } from "@/src/contexts/AuthContext";
import { useTranslations } from "next-intl";
import { useCart } from "@/src/hooks/cart/useCart";
import { useNavItems } from "@/src/hooks/home/useNavItems";

interface DesktopNavbarProps {
  activeItem: NavItemId;
}

export function DesktopNavbar({ activeItem }: DesktopNavbarProps) {
  const { user } = useAuth();
  const t = useTranslations("home");
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const { cartCount } = useCart();

  const userName = user?.name ?? t("desktopNavbar.guest");
  // ✅ first character of the first word, uppercased — handles empty gracefully
  const userInitial = userName.trim().charAt(0).toUpperCase() || "?";

  const navItems = useNavItems(); // ✅ أضف السطر ده

  // Find the search and more items from config
  const searchItem = navItems.find((item) => item.id === "search");
  const moreItem = navItems.find((item) => item.id === "more");

  return (
    <>
      <header
        className="hidden md:flex items-center justify-between px-6 h-16 sticky top-0 z-50"
        style={{
          backgroundColor: "var(--color-bg)",
          borderBottom: "1px solid var(--color-border)",
          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.05)",
        }}
      >
        <Logo width={200} />

        <nav
          className="flex items-center gap-1"
          aria-label={t("desktopNavbar.mainNavigation")}
        >
          {navItems.map((item) => {
            if (item.id === "search") {
              return (
                <button
                  key={item.id}
                  onClick={() => setSearchOpen(true)}
                  className="relative flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-150 cursor-pointer border-0 bg-transparent"
                  style={{
                    fontFamily: "var(--font-sans)",
                    color:
                      activeItem === "search"
                        ? "var(--color-primary)"
                        : "var(--color-text-muted)",
                    backgroundColor:
                      activeItem === "search"
                        ? "var(--color-primary-light)"
                        : "transparent",
                  }}
                  aria-label={t(searchItem?.labelKey || "nav.search")}
                >
                  <item.icon className="w-[18px] h-[18px]" />
                  {t(searchItem?.labelKey || "nav.search")}
                </button>
              );
            }

            if (item.id === "more") {
              return (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => {
                      setMoreOpen((v) => !v);
                      setUserOpen(false);
                    }}
                    className="relative flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-150 cursor-pointer border-0"
                    style={{
                      fontFamily: "var(--font-sans)",
                      color: moreOpen
                        ? "var(--color-primary)"
                        : "var(--color-text-muted)",
                      backgroundColor: moreOpen
                        ? "var(--color-primary-light)"
                        : "transparent",
                    }}
                    aria-label={t(moreItem?.labelKey || "nav.more")}
                    aria-expanded={moreOpen}
                  >
                    <item.icon className="w-[18px] h-[18px]" />
                    {t(moreItem?.labelKey || "nav.more")}
                  </button>
                  <DesktopMoreDropdown
                    isOpen={moreOpen}
                    onClose={() => setMoreOpen(false)}
                  />
                </div>
              );
            }

            return (
              <DesktopNavItem
                key={item.id}
                item={item}
                isActive={activeItem === item.id}
                badge={item.id === "cart" ? cartCount : undefined}
              />
            );
          })}
        </nav>

        <div className="relative w-[130px] flex justify-end">
          <button
            onClick={() => {
              setUserOpen((v) => !v);
              setMoreOpen(false);
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0 hover:opacity-80 transition-opacity"
            style={{ backgroundColor: "var(--color-primary)" }}
            aria-label={t("desktopNavbar.userProfile")}
            aria-expanded={userOpen}
          >
            {userInitial}
          </button>
          <DesktopUserDropdown
            isOpen={userOpen}
            onClose={() => setUserOpen(false)}
          />
        </div>
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
