"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

interface OrdersHeaderProps {
  onBack?: () => void;
  showBack?: boolean;
}

export function OrdersHeader({ onBack, showBack = false }: OrdersHeaderProps) {
  const router = useRouter();
  const t = useTranslations("orders");

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 md:hidden"
      style={{
        backgroundColor: "var(--color-bg)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      {showBack ? (
        <button
          onClick={onBack ?? (() => router.back())}
          className="w-9 h-9 flex items-center justify-center rounded-full -ml-1"
          style={{ color: "var(--color-primary)" }}
          aria-label={t("goBack")}
        >
          <ChevronLeftIcon className="w-5 h-5" strokeWidth={2.5} />
        </button>
      ) : (
        <div className="w-9" />
      )}

      <h1
        className="text-base font-semibold absolute left-1/2 -translate-x-1/2"
        style={{ fontFamily: "var(--font-sans)", color: "var(--color-text)" }}
      >
        {t("myOrders")}
      </h1>

      <div className="w-9" />
    </header>
  );
}