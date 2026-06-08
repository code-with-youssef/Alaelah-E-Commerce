"use client";

import { usePathname } from "next/navigation";
import { DesktopNavbar } from "./DesktopNavbar";
import { MobileNavbar } from "./MobileNavbar";
import { NAV_ITEMS, NavItemId } from "@/src/config/nav-config";
import { MobileTopBar } from "./MobileTopBar";

const NO_SEARCH_ROUTES = [
  "/cart",
  "/checkout",
  "/settings",
  "/profile",
  "/orders",
  "/addresses",
  "/login",
  "/register",
];

function resolveActiveItem(pathname: string): NavItemId {
  const stripped = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");
  const match = NAV_ITEMS.find((item) => {
    if (item.href === "/") return stripped === "/";
    return stripped.startsWith(item.href);
  });
  return match?.id ?? "home";
}

function shouldShowSearch(pathname: string): boolean {
  const stripped = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");
  return !NO_SEARCH_ROUTES.some((route) => stripped.startsWith(route));
}

export function Navbar() {
  const pathname = usePathname();
  const activeItem = resolveActiveItem(pathname);
  const showSearch = shouldShowSearch(pathname);

  return (
    <>
      <DesktopNavbar activeItem={activeItem} />
      <MobileTopBar showSearch={showSearch} />
      <MobileNavbar activeItem={activeItem} />
    </>
  );
}