// src/config/nav-config.ts
import {
  HomeIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  EllipsisHorizontalIcon,
  Squares2X2Icon,
  TagIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeSolid,
  MagnifyingGlassIcon as SearchSolid,
  ShoppingCartIcon as CartSolid,
  EllipsisHorizontalIcon as MoreSolid,
  Squares2X2Icon as Squares2X2Solid,
  TagIcon as TagSolid,
} from "@heroicons/react/24/solid";
import type { ComponentType, SVGProps } from "react";

export type NavItemId =
  | "home"
  | "categories"
  | "deals"
  | "search"
  | "pay"
  | "cart"
  | "brands"
  | "more";

export interface NavItem {
  id: NavItemId;
  labelKey: string; // Keep this for translation keys
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>> | string; // Allow string for potential image icons
  iconActive: ComponentType<SVGProps<SVGSVGElement>> | string;
  badge?: number;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    labelKey: "nav.home",
    href: "/",
    icon: "/assets/icons/category-1.svg",
    iconActive: "/assets/icons/category-1.svg",
  },
  {
    id: "categories",
    labelKey: "nav.categories",
    href: "/categories",
    icon: "/assets/icons/category-4.svg", // Example of using a custom SVG icon
    iconActive: "/assets/icons/category-4.svg",
  },
  {
    id: "deals",
    labelKey: "nav.deals",
    href: "/deals",
    icon: "/assets/icons/icon-1.svg", // Example of using a custom SVG icon
    iconActive: "/assets/icons/icon-1.svg",
  },
  {
    id: "brands",
    labelKey: "nav.brands",
    href: "/brands",
    icon: "/assets/icons/category-2.svg", // Example of using a custom SVG icon
    iconActive: "/assets/icons/category-2.svg",
  },
  {
    id: "cart",
    labelKey: "nav.cart",
    href: "/cart",
    icon: "/assets/icons/icon-cart2.svg",
    iconActive: "/assets/icons/icon-cart2.svg",
  },

  {
    id: "more",
    labelKey: "nav.more",
    href: "/more",
    icon: "/assets/icons/icon-more.svg",
    iconActive: "/assets/icons/icon-more.svg",
  },
];
