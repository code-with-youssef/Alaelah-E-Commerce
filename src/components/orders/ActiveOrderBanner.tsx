// app/orders/components/ActiveOrderBanner.tsx
"use client";

import { TruckIcon } from "@heroicons/react/24/outline";
import { UIOrder } from "@/src/config/order";
import { useTranslations } from "next-intl";

interface ActiveOrderBannerProps {
  order: UIOrder;
}

export function ActiveOrderBanner({ order }: ActiveOrderBannerProps) {
  const t = useTranslations("orders");

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 pt-4">
      <div
        className="rounded-2xl p-4 flex items-center gap-3"
        style={{
          backgroundColor: "var(--color-primary-light)",
          border: "1px solid var(--color-primary)",
        }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <TruckIcon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>
            {t("activeOrder", { orderNumber: order.orderNumber })}
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {t("status")}: {order.statusText}
          </p>
        </div>
        <button
          className="px-4 py-2 rounded-full text-sm font-semibold"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "#fff",
          }}
        >
          {t("track")}
        </button>
      </div>
    </div>
  );
}