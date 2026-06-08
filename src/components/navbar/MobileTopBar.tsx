"use client";

import { Logo } from "./Logo";
import { ShoppingCartIcon, ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useCart } from "@/src/hooks/cart/useCart";
import { SearchBar } from "../common/SearchBar";
import { LocationHeader } from "../home/location/LocationHeader";

interface MobileTopBarProps {
  showSearch?: boolean;
}

export function MobileTopBar({ showSearch = true }: MobileTopBarProps) {
  const { cartCount } = useCart();

  return (
    <header
      className="md:hidden sticky top-0 z-50 flex flex-col"
      style={{
        backgroundColor: "var(--color-bg)",
        borderBottom: "1px solid var(--color-border)",
        boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)",
      }}
    >
      {/* Row 1: chat | Logo | cart */}
      <div className="relative flex items-center justify-between px-4 h-12">
        {/* Chat icon */}
        <button
          className="w-9 h-9 flex items-center justify-center"
          style={{ color: "var(--color-text-muted)" }}
          aria-label="Chat"
        >
          <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />
        </button>

        {/* Logo — absolutely centered */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Logo />
        </div>

        {/* Cart icon */}
        <Link
          href="/cart"
          className="relative w-9 h-9 flex items-center justify-center"
          style={{ color: "var(--color-text-muted)" }}
          aria-label="Cart"
        >
          <ShoppingCartIcon className="w-6 h-6" />
          {cartCount > 0 && (
            <span
              className="absolute -top-0.5 -end-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* Row 2 + 3: Search & Location — consistent px-4 */}
      {showSearch && (
        <div className="flex flex-col gap-2 px-4 pb-3">
          {/* Full width search bar */}
          <div className="w-full">
            <SearchBar />
          </div>
          <LocationHeader deliveryMin={35} deliveryMax={45} />
        </div>
      )}
    </header>
  );
}