"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface CartCheckoutBarProps {
  subtotal: number;
  fixed?: boolean;
  disabled?: boolean;
}

export function CartCheckoutBar({
  subtotal,
  fixed = false,
  disabled = false,
}: CartCheckoutBarProps) {
  const router = useRouter();
  const t = useTranslations("cart");

  const handleCheckout = () => {
    if (disabled) return;
    // Pass subtotal as a search param so the checkout page can read it
    router.push(`/checkout?subtotal=${subtotal.toFixed(2)}`);
  };

  const button = (
    <button
      onClick={handleCheckout}
      disabled={disabled}
      className="w-full flex cursor-pointer items-center justify-between rounded-2xl px-6 py-4 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
      style={{ backgroundColor: "var(--color-primary)" }}
      aria-label={t("checkoutBar.goToCheckout")}
      aria-disabled={disabled}
    >
      <span
        className="text-white font-bold text-base"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {disabled ? t("checkoutBar.resolveWarningsFirst") : t("checkoutBar.goToCheckout")}
      </span>

      <div className="text-right">
        <p
          className="text-white font-bold text-base leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t("checkoutBar.currency")} {subtotal.toFixed(2).toLocaleString()}
        </p>
      </div>
    </button>
  );

  if (fixed) {
    return (
      <div
        className="fixed bottom-0 left-0 right-0 z-60 p-3"
        style={{
          backgroundColor: "var(--color-bg)",
          borderTop: "1px solid var(--color-border)",
          paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.08)",
        }}
      >
        {button}
      </div>
    );
  }

  return <div>{button}</div>;
}