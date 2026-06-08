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
  | "more";

export interface NavItem {
  id: NavItemId;
  labelKey: string; // Keep this for translation keys
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  iconActive: ComponentType<SVGProps<SVGSVGElement>>;
  badge?: number;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    labelKey: "nav.home",
    href: "/",
    icon: HomeIcon,
    iconActive: HomeSolid,
  },
  {
    id: "categories",
    labelKey: "nav.categories",
    href: "/categories",
    icon: Squares2X2Icon,
    iconActive: Squares2X2Solid,
  },
  {
    id: "cart",
    labelKey: "nav.cart",
    href: "/cart",
    icon: ShoppingCartIcon,
    iconActive: CartSolid,
  },
  {
    id: "deals",
    labelKey: "nav.deals",
    href: "/category/2/magazine-offers",
    icon: TagIcon,
    iconActive: TagSolid,
  },
  {
    id: "search",
    labelKey: "nav.search",
    href: "/search",
    icon: MagnifyingGlassIcon,
    iconActive: SearchSolid,
  },

  {
    id: "more",
    labelKey: "nav.more",
    href: "/more",
    icon: EllipsisHorizontalIcon,
    iconActive: MoreSolid,
  },
];
