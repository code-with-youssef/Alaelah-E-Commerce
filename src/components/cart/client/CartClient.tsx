"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CartMobile } from "../CartMobile";
import { CartDesktop } from "../CartDesktop";
import { useCart } from "@/src/hooks/cart/useCart";
import { useTranslations } from "next-intl";
import { useCartStockCheck } from "@/src/hooks/cart/useCartStockCheck";

export function CartClient() {
  const router = useRouter();
  const { cartItems, isLoading, removeFromCart } = useCart();
  const { warnings, dismissWarning, dismissAll } = useCartStockCheck();
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const t = useTranslations("cart");

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleClearAll = () => {
    Promise.all(cartItems.map((item) => removeFromCart(item.product.id))).catch(
      () => {}
    );
  };

  const handleCheckout = () => router.push("/checkout");

  if (isMobile === null || isLoading) {
    return (
      <div
        className="min-h-dvh flex items-center justify-center"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <div
          className="w-10 h-10 rounded-full border-[3px] border-t-transparent animate-spin"
          style={{ borderColor: "var(--color-primary)" }}
          aria-label={t("loading")}
        />
      </div>
    );
  }

  const sharedProps = {
    items: cartItems,
    onClearAll: handleClearAll,
    onCheckout: handleCheckout,
    isLoading: false,
    warnings,
    onDismissWarning: dismissWarning,
    onDismissAllWarnings: dismissAll,
  };

  return isMobile ? (
    <CartMobile {...sharedProps} />
  ) : (
    <CartDesktop
      {...sharedProps}
      onRemove={(productId) => removeFromCart(productId)}
    />
  );
}