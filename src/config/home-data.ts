// ─── Spotlight Items ────────────────────────────────────────
export interface SpotlightItem {
  id: number;
  name: string;
  image: string;
  tag?: string;
  href: string;
}

export const SPOTLIGHT_ITEMS: SpotlightItem[] = [
  {
    id: 1,
    name: "Laho Chicken",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80",
    tag: "Fresh",
    href: "/store/laho"
  },
  {
    id: 2,
    name: "Elano Water",
    image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&q=80",
    tag: "Essentials",
    href: "/store/elano"
  },
  {
    id: 3,
    name: "Dairy & Eggs",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80",
    tag: "Daily",
    href: "/category/dairy"
  },
  {
    id: 4,
    name: "Artisan Bakery",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
    tag: "Fresh",
    href: "/category/bakery"
  },
  {
    id: 5,
    name: "Snacks & More",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&q=80",
    tag: "Trending",
    href: "/category/snacks"
  },
  {
    id: 6,
    name: "Fresh Juices",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=80",
    tag: "Healthy",
    href: "/category/beverages"
  }
];

// ─── Shops ──────────────────────────────────────────────────
export interface ShopItem {
  id: number;
  name: string;
  logo?: string;
  bg_color: string;
  text_color: string;
  href: string;
}

export const SHOPS: ShopItem[] = [
  {
    id: 1,
    name: "ELARABY\nضياء الثقة",
    bg_color: "#1A3FAB",
    text_color: "#FFFFFF",
    href: "/shop/elaraby"
  },
  {
    id: 2,
    name: "MEDIATECH",
    bg_color: "#111111",
    text_color: "#FFFFFF",
    href: "/shop/mediatech"
  },
  {
    id: 3,
    name: "Mienta",
    bg_color: "#F0F0F0",
    text_color: "#222222",
    href: "/shop/mienta"
  },
  {
    id: 4,
    name: "BEKO",
    bg_color: "#E8F4FD",
    text_color: "#0066B3",
    href: "/shop/beko"
  },
  {
    id: 5,
    name: "Tefal",
    bg_color: "#C8102E",
    text_color: "#FFFFFF",
    href: "/shop/tefal"
  }
];
